import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Package, Search, Terminal, ChevronRight,
  Cpu, Monitor, Wifi, Volume2, LayoutDashboard, Code, Library, 
  AppWindow, Wrench, Container, Type, Boxes, Shield, Zap, 
  Database, HardDrive, BookOpen, Palette, Sparkles, TrendingUp
} from 'lucide-react';
import CursorSpotlight from './components/CursorSpotlight';
import DiagnosticTool from './components/DiagnosticTool';
import CategoryCard from './components/CategoryCard';
import PackageCard from './components/PackageCard';
import LoadingSkeleton from './components/LoadingSkeleton';
import Toast from './components/Toast';
import StatsPanel from './components/StatsPanel';
import { api } from './api/client';
import { useDebounce } from './hooks/useDebounce';
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Category icon mapping
const categoryIcons = {
  'System Core': Cpu,
  'System Services & Daemons': Zap,
  'Display & Graphics': Monitor,
  'Audio Subsystem': Volume2,
  'Networking': Wifi,
  'Security & Encryption': Shield,
  'Command-line Utilities': Terminal,
  'Arch Linux & AUR Helpers': Package,
  'Desktop Environment (General)': LayoutDashboard,
  'KDE Plasma Components': Boxes,
  'User Applications (GUI)': AppWindow,
  'Development Tools & IDEs': Code,
  'Programming Languages & Runtimes': BookOpen,
  'GUI Toolkits': Palette,
  'Multimedia Libraries & Codecs': Library,
  'Data & Databases': Database,
  'Virtualization & Emulation': Container,
  'Fonts': Type,
  'Icons & Themes': Palette,
  'Core Libraries (Low-Level)': HardDrive
};

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  }
};

// Main App Component
function ArchLensApp() {
  const [view, setView] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchInputRef, setSearchInputRef] = useState(null);

  // Debounce search input
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useKeyboardShortcut(['cmd+k', 'ctrl+k'], (e) => {
    e.preventDefault();
    searchInputRef?.focus();
  });

  // Show toast notification
  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
    onError: () => showToast('Failed to load categories', 'error')
  });

  // Fetch packages for selected category
  const {
    data: packagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: packagesLoading,
  } = useInfiniteQuery({
    queryKey: ['packages', selectedCategory],
    queryFn: ({ pageParam = 1 }) => 
      api.getPackagesByCategory(selectedCategory, pageParam, 30),
    getNextPageParam: (lastPage) => 
      lastPage.pagination.has_next ? lastPage.pagination.page + 1 : undefined,
    enabled: !!selectedCategory && view === 'packages',
  });

  // Search packages
  const {
    data: searchData,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
    isLoading: searchLoading,
  } = useInfiniteQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: ({ pageParam = 1 }) => 
      api.searchPackages(debouncedSearch, pageParam, 30),
    getNextPageParam: (lastPage) => 
      lastPage.pagination.has_next ? lastPage.pagination.page + 1 : undefined,
    enabled: debouncedSearch.length > 0,
  });

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setView('packages');
    setSearchQuery('');
    showToast(`Exploring ${categoryName}`, 'success');
  };

  const handleBack = () => {
    setView('categories');
    setSelectedCategory(null);
    setSearchQuery('');
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      setView('search');
    } else {
      setView('categories');
    }
  };

  const packages = packagesData?.pages.flatMap(page => page.packages) || [];
  const searchResults = searchData?.pages.flatMap(page => page.packages) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-green-50 relative overflow-hidden">
      <CursorSpotlight />
      
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="mb-8 text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Package className="w-12 h-12 text-green-400" />
            </motion.div>
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 bg-clip-text text-transparent">
              ArchLens
            </h1>
            <Sparkles className="w-8 h-8 text-green-400 animate-pulse" />
          </div>
          <p className="text-gray-400 text-lg">Demystifying Your Arch Linux System</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-400 transition-colors" />
              <input
                ref={setSearchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search packages... (⌘K)"
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-green-100 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all shadow-lg hover:shadow-green-500/10"
              />
              <kbd className="absolute right-4 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs bg-gray-900 border border-gray-700 rounded text-gray-500">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => { setView('categories'); setShowDiagnostic(false); setSearchQuery(''); }}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                view === 'categories' && !showDiagnostic
                  ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                  : 'bg-gray-800/50 text-gray-400 hover:text-green-400'
              }`}
            >
              Browse Packages
            </button>
            <button
              onClick={() => { setShowDiagnostic(true); setView('diagnostic'); setSearchQuery(''); }}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                showDiagnostic
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-gray-800/50 text-gray-400 hover:text-blue-400'
              }`}
            >
              Diagnostic Tool
            </button>
          </div>
        </motion.div>

        {/* Stats Panel */}
        {!showDiagnostic && categories && (
          <StatsPanel categories={categories} />
        )}

        {/* Main Content */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
          {/* Back Button */}
          {(view === 'packages' || (view === 'search' && searchQuery)) && !showDiagnostic && (
            <motion.div 
              className="p-4 border-b border-gray-800 bg-gray-900/80"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-all transform hover:translate-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back to Categories</span>
              </button>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* Diagnostic Tool View */}
            {showDiagnostic && (
              <motion.div
                key="diagnostic"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="p-6"
              >
                <DiagnosticTool showToast={showToast} />
              </motion.div>
            )}

            {/* Categories View */}
            {view === 'categories' && !searchQuery && !showDiagnostic && (
              <motion.div
                key="categories"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="p-6"
              >
                <h2 className="text-2xl font-bold text-green-300 mb-6 flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  Package Categories {categories && `(${categories.length} groups)`}
                </h2>

                {categoriesLoading ? (
                  <LoadingSkeleton count={20} type="category" />
                ) : categoriesError ? (
                  <div className="text-center py-12">
                    <p className="text-red-400">Failed to load categories. Please try again.</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {categories?.map((category, idx) => (
                      <CategoryCard
                        key={category.name}
                        category={category}
                        icon={categoryIcons[category.name]}
                        onClick={() => handleCategorySelect(category.name)}
                        index={idx}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Packages View */}
            {view === 'packages' && selectedCategory && !showDiagnostic && (
              <motion.div
                key="packages"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  {(() => {
                    const IconComponent = categoryIcons[selectedCategory] || Package;
                    return <IconComponent className="w-7 h-7 text-green-400" />;
                  })()}
                  <h2 className="text-2xl font-bold text-green-300">
                    {selectedCategory}
                  </h2>
                </div>

                {packagesLoading ? (
                  <LoadingSkeleton count={30} type="package" />
                ) : (
                  <>
                    <div className="grid gap-3">
                      {packages.map((pkg, idx) => (
                        <PackageCard key={pkg.id} package={pkg} index={idx} />
                      ))}
                    </div>

                    {hasNextPage && (
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                          className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-700 disabled:to-gray-700 text-white font-medium rounded-xl transition-all transform hover:scale-105 disabled:scale-100 shadow-lg"
                        >
                          {isFetchingNextPage ? 'Loading...' : 'Load More Packages'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* Search Results View */}
            {view === 'search' && debouncedSearch && !showDiagnostic && (
              <motion.div
                key="search"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="p-6"
              >
                <h2 className="text-2xl font-bold text-green-300 mb-6 flex items-center gap-2">
                  <Search className="w-6 h-6" />
                  Search Results for "{debouncedSearch}"
                </h2>

                {searchLoading ? (
                  <LoadingSkeleton count={30} type="package" />
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No packages found matching your search.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-3">
                      {searchResults.map((pkg, idx) => (
                        <PackageCard 
                          key={pkg.id} 
                          package={pkg} 
                          index={idx} 
                          showCategory 
                          searchTerm={debouncedSearch}
                        />
                      ))}
                    </div>

                    {hasNextSearchPage && (
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => fetchNextSearchPage()}
                          disabled={isFetchingNextSearchPage}
                          className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-700 disabled:to-gray-700 text-white font-medium rounded-xl transition-all transform hover:scale-105 disabled:scale-100 shadow-lg"
                        >
                          {isFetchingNextSearchPage ? 'Loading...' : 'Load More Results'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div 
          className="mt-8 text-center text-gray-500 text-sm space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" />
            ArchLens v1.0.0 • Making Arch Linux understandable, one package at a time
          </p>
          <p className="text-xs text-gray-600">
            Powered by FastAPI, React, PostgreSQL & Supabase
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// Root App with QueryClient Provider
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ArchLensApp />
    </QueryClientProvider>
  );
}