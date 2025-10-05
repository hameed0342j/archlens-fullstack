from sqlalchemy import Column, Integer, String, Text, Index
from sqlalchemy.dialects.postgresql import TSVECTOR
from database import Base

class Package(Base):
    __tablename__ = "packages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)
    search_vector = Column(TSVECTOR)
    
    __table_args__ = (
        Index('idx_search_vector', 'search_vector', postgresql_using='gin'),
    )