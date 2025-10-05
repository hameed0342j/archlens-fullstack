# 🏛️ ArchLens - Arch Linux Package Explorer

> A modern, full-stack web application for exploring and understanding Arch Linux packages with intelligent categorization and diagnostic tools.

![ArchLens Preview](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%2B%20FastAPI%20%2B%20PostgreSQL-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## ✨ Features

- 📦 **Browse 1,758+ Packages** - Explore Arch Linux packages across 20+ intelligent categories
- 🔍 **Powerful Search** - Full-text search powered by PostgreSQL with instant results
- 🎨 **Beautiful UI** - Dark theme with smooth animations and responsive design
- 📊 **Package Analytics** - Detailed package information, dependencies, and statistics
- 🛠️ **Diagnostic Tools** - Smart package troubleshooting and recommendations
- ⚡ **Fast Performance** - Optimized with React Query caching and efficient APIs
- 🐳 **Containerized** - Fully Dockerized for easy deployment

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Advanced relational database
- **Asyncpg** - Fast PostgreSQL driver for Python

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **TanStack Query** - Powerful data fetching
- **Lucide React** - Beautiful icons

### Database
- **Supabase PostgreSQL** - Cloud-hosted database
- **Full-text search** - Advanced search capabilities
- **Optimized indexes** - Fast query performance

## 🚀 Quick Start

### Method 1: Local Development (Recommended)

#### Prerequisites
- **Python 3.13+** (recommended)
- **Node.js 20+** and npm
- **Git**

#### 1. Clone the Repository
```bash
git clone https://github.com/hameed0342j/archlens-fullstack.git
cd archlens-fullstack
```

#### 2. Setup Environment Variables
```bash
# The .env file is already configured with Supabase credentials
# No additional setup needed!
```

#### 3. Backend Setup
```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install fastapi uvicorn sqlalchemy asyncpg psycopg2-binary python-dotenv

# Seed the database (first time only)
cd backend
python seed.py

# Start the backend server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### 4. Frontend Setup
```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

#### 5. Access the Application
- **Frontend:** http://localhost:5173/
- **Backend API:** http://localhost:8000/
- **API Documentation:** http://localhost:8000/docs

### Method 2: Docker Deployment

#### Prerequisites
- **Docker** and **Docker Compose**

#### Quick Deploy
```bash
# Clone and start with Docker
git clone https://github.com/hameed0342j/archlens-fullstack.git
cd archlens-fullstack

# Start all services
docker compose up --build -d

# Access the application
# Frontend: http://localhost:8080
# Backend: http://localhost:8000
```

## 📋 Available Scripts

### Backend Scripts
```bash
# Start development server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Seed database
python seed.py

# Run with virtual environment
/path/to/venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Scripts
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🗂️ Project Structure

```
archlens-fullstack/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main application file
│   ├── models.py           # Database models
│   ├── database.py         # Database configuration
│   ├── seed.py             # Database seeding script
│   ├── categorizer.py      # Package categorization logic
│   ├── diagnostic_rules.json # Diagnostic rules
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend container config
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── api/            # API client configuration
│   │   ├── app.jsx         # Main application component
│   │   └── main.jsx        # Application entry point
│   ├── package.json        # Node.js dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── Dockerfile          # Frontend container config
├── .env                    # Environment variables
├── docker-compose.yml      # Docker services configuration
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables
The `.env` file contains all necessary configuration:

```env
# Database Connection
DATABASE_URL=postgresql+asyncpg://[credentials]

# Supabase Configuration
SUPABASE_URL=https://sgkuqrjvmvotsraiccih.supabase.co
SUPABASE_ANON_KEY=[your-anon-key]

# Frontend Configuration
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://sgkuqrjvmvotsraiccih.supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

### VS Code Configuration
For optimal development experience, the project includes:
- **Python environment integration**
- **Environment variable loading**
- **Recommended extensions**

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check Python version
python3 --version  # Should be 3.11+

# Ensure virtual environment is activated
source venv/bin/activate

# Install dependencies again
pip install -r backend/requirements.txt
```

#### Database Connection Issues
```bash
# Verify environment variables
cat .env

# Test database connection
cd backend && python -c "from database import engine; print('Database connected!')"
```

#### Frontend Build Errors
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Port Already in Use
```bash
# Kill processes on ports 8000 or 5173
pkill -f uvicorn  # Backend
pkill -f vite     # Frontend

# Or use different ports
uvicorn main:app --port 8001
npm run dev -- --port 5174
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend for production
cd frontend
npm run build

# The build files will be in frontend/dist/
# Serve with any static file server
```

### Docker Production
```bash
# Build and run in production mode
docker compose -f docker-compose.yml up --build -d

# Scale services if needed
docker compose up --scale backend=2 --scale frontend=2
```

## 📊 Performance

- **Database:** 1,758+ packages indexed with full-text search
- **Frontend:** Optimized bundle with code splitting
- **Caching:** React Query for efficient data fetching
- **Build Time:** ~30 seconds average
- **Bundle Size:** ~500KB gzipped

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] Package dependency visualization
- [ ] User authentication and favorites
- [ ] Package installation tracking
- [ ] Community ratings and reviews
- [ ] Advanced filtering options
- [ ] Mobile app development

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/hameed0342j/archlens-fullstack/issues)
3. Create a new issue with detailed information

---

<div align="center">
  <p>Made with ❤️ for the Arch Linux community</p>
  <p>
    <a href="https://github.com/hameed0342j/archlens-fullstack">⭐ Star this project</a> •
    <a href="https://github.com/hameed0342j/archlens-fullstack/issues">🐛 Report Bug</a> •
    <a href="https://github.com/hameed0342j/archlens-fullstack/issues">💡 Request Feature</a>
  </p>
</div>