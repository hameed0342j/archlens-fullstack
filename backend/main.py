from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from typing import List, Dict, Optional
from pydantic import BaseModel
from database import get_session, init_db
from models import Package
import os
import json

app = FastAPI(
    title="ArchLens API",
    description="Backend API for the ArchLens Arch Linux package explorer",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load diagnostic rules
DIAGNOSTIC_RULES = {}
try:
    with open('diagnostic_rules.json', 'r') as f:
        DIAGNOSTIC_RULES = json.load(f)
except FileNotFoundError:
    print("⚠️  Warning: diagnostic_rules.json not found. Diagnostic features will be limited.")

@app.on_event("startup")
async def startup():
    """Initialize database on startup."""
    await init_db()
    print("✅ Database initialized")

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "ArchLens API",
        "version": "1.0.0",
        "endpoints": {
            "categories": "/api/categories",
            "packages": "/api/packages/{category_name}",
            "search": "/api/search?q=term",
            "diagnose": "/api/diagnose (POST)"
        }
    }

@app.get("/api/categories")
async def get_categories(
    session: AsyncSession = Depends(get_session)
) -> List[Dict]:
    """Get all package categories with their package counts."""
    query = select(
        Package.category,
        func.count(Package.id).label('count')
    ).group_by(Package.category).order_by(Package.category)
    
    result = await session.execute(query)
    categories = result.all()
    
    return [
        {
            "name": cat.category,
            "count": cat.count
        }
        for cat in categories
    ]

@app.get("/api/packages/{category_name}")
async def get_packages_by_category(
    category_name: str,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(30, ge=1, le=100, description="Items per page"),
    session: AsyncSession = Depends(get_session)
):
    """Get paginated packages for a specific category."""
    offset = (page - 1) * page_size
    
    count_query = select(func.count(Package.id)).where(
        Package.category == category_name
    )
    total_result = await session.execute(count_query)
    total = total_result.scalar()
    
    if total == 0:
        raise HTTPException(
            status_code=404,
            detail=f"Category '{category_name}' not found or contains no packages"
        )
    
    query = select(Package).where(
        Package.category == category_name
    ).order_by(Package.name).offset(offset).limit(page_size)
    
    result = await session.execute(query)
    packages = result.scalars().all()
    
    return {
        "packages": [
            {
                "id": pkg.id,
                "name": pkg.name,
                "category": pkg.category,
                "description": pkg.description
            }
            for pkg in packages
        ],
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": (total + page_size - 1) // page_size,
            "has_next": page * page_size < total,
            "has_previous": page > 1
        }
    }

@app.get("/api/search")
async def search_packages(
    q: str = Query(..., min_length=1, description="Search query"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(30, ge=1, le=100, description="Items per page"),
    session: AsyncSession = Depends(get_session)
):
    """Full-text search across package names and descriptions."""
    offset = (page - 1) * page_size
    search_term = ' & '.join(word for word in q.split() if word)
    
    search_query = text("""
        SELECT id, name, category, description,
               ts_rank(search_vector, query) as rank
        FROM packages,
             to_tsquery('english', :search_term) query
        WHERE search_vector @@ query
        ORDER BY rank DESC, name
        OFFSET :offset LIMIT :limit
    """)
    
    count_query = text("""
        SELECT COUNT(*)
        FROM packages,
             to_tsquery('english', :search_term) query
        WHERE search_vector @@ query
    """)
    
    try:
        count_result = await session.execute(
            count_query,
            {"search_term": search_term}
        )
        total = count_result.scalar() or 0
        
        result = await session.execute(
            search_query,
            {"search_term": search_term, "offset": offset, "limit": page_size}
        )
        packages = result.all()
        
        return {
            "query": q,
            "packages": [
                {
                    "id": pkg.id,
                    "name": pkg.name,
                    "category": pkg.category,
                    "description": pkg.description
                }
                for pkg in packages
            ],
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total": total,
                "total_pages": (total + page_size - 1) // page_size if total > 0 else 0,
                "has_next": page * page_size < total,
                "has_previous": page > 1
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid search query: {str(e)}"
        )

# Pydantic model for diagnostic request
class DiagnosticRequest(BaseModel):
    problem: str

@app.post("/api/diagnose")
async def diagnose_problem(
    request: DiagnosticRequest,
    session: AsyncSession = Depends(get_session)
):
    """
    Diagnose system problems by matching user descriptions to relevant packages.
    
    This endpoint uses a two-stage approach:
    1. Keyword matching against diagnostic_rules.json for high-confidence matches
    2. Full-text search against the database for additional relevant packages
    """
    problem = request.problem.lower().strip()
    
    if not problem:
        raise HTTPException(status_code=400, detail="Problem description cannot be empty")
    
    # Stage 1: Keyword matching (high confidence)
    keyword_matches = set()
    matched_keywords = []
    
    if DIAGNOSTIC_RULES and 'keywords' in DIAGNOSTIC_RULES:
        for keyword, packages in DIAGNOSTIC_RULES['keywords'].items():
            if keyword in problem:
                keyword_matches.update(packages)
                matched_keywords.append(keyword)
    
    # Stage 2: Full-text search (broader search)
    search_results = set()
    search_term = ' | '.join(word for word in problem.split() if len(word) > 2)
    
    if search_term:
        try:
            search_query = text("""
                SELECT DISTINCT name
                FROM packages,
                     to_tsquery('english', :search_term) query
                WHERE search_vector @@ query
                LIMIT 10
            """)
            
            result = await session.execute(
                search_query,
                {"search_term": search_term}
            )
            search_results = {row[0] for row in result}
        except:
            pass
    
    # Combine results - keyword matches first (higher priority)
    combined_packages = list(keyword_matches) + [pkg for pkg in search_results if pkg not in keyword_matches]
    
    # Limit to top 5 packages
    top_packages = combined_packages[:5]
    
    if not top_packages:
        return {
            "problem": request.problem,
            "suggestions": [],
            "message": "No specific packages identified. Try searching with different keywords."
        }
    
    # Fetch package details
    query = select(Package).where(Package.name.in_(top_packages))
    result = await session.execute(query)
    packages = {pkg.name: pkg for pkg in result.scalars().all()}
    
    # Build response with reasons and actions
    suggestions = []
    reasons_map = DIAGNOSTIC_RULES.get('reasons', {}) if DIAGNOSTIC_RULES else {}
    actions_map = DIAGNOSTIC_RULES.get('actions', {}) if DIAGNOSTIC_RULES else {}
    
    for idx, pkg_name in enumerate(top_packages):
        if pkg_name not in packages:
            continue
            
        pkg = packages[pkg_name]
        is_keyword_match = pkg_name in keyword_matches
        
        # Determine confidence score
        confidence = 95 - (idx * 10) if is_keyword_match else 70 - (idx * 5)
        confidence = max(confidence, 50)
        
        # Get reason
        reason = reasons_map.get(pkg_name, f"Related to {', '.join(matched_keywords[:2])} functionality" if matched_keywords else pkg.description)
        
        # Get suggested action
        action = actions_map.get(pkg_name, "Check Arch Wiki for troubleshooting")
        
        suggestions.append({
            "package": {
                "id": pkg.id,
                "name": pkg.name,
                "category": pkg.category,
                "description": pkg.description
            },
            "confidence": confidence,
            "reason": reason,
            "command": action,
            "match_type": "keyword" if is_keyword_match else "search"
        })
    
    return {
        "problem": request.problem,
        "matched_keywords": matched_keywords,
        "suggestions": suggestions,
        "total_found": len(suggestions)
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "healthy", "service": "archlens-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)