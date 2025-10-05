import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Package, Search, Terminal, ChevronRight,
  Cpu, Monitor, Wifi, Volume2, LayoutDashboard, Code, Library, 
  AppWindow, Wrench, Container, Type, Boxes, Shield, Zap, 
  Database, HardDrive, BookOpen, Palette
} from 'lucide-react';
import CursorSpotlight from './components/CursorSpotlight';
import { api } from './api/client';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Category icon mapping for all 20 categories
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

// Animation variants for smooth transitions
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
  }
};

// Main App Component
function ArchLensApp() {
  const [view, setView] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });

  // Fetch packages for selected category with infinite scroll
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

  // Search packages with infinite scroll
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
  };

  const handleBack = () => {
    if (view === 'packages') {
      setView('categories');
      setSelectedCategory(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim()) {
      setView('search');
    } else {
      setView('categories');
    }
  };

  // Flatten paginated results
  const packages = packagesData?.pages.flatMap(page => page.packages) || [];
  const searchResults = searchData?.pages.flatMap(page => page.packages) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-green-50 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <CursorSpotlight />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 text-center space-y-4">
          <motion.div 
            className="flex items-center justify-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Package className="w-10 h-10 text-green-400 animate-pulse" />
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              ArchLens
            </h1>
          </motion.div>
          <p className="text-gray-400 text-lg">Demystifying Your Arch Linux System</p>
          
          {/* Search Bar */}
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search packages..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-green-100 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
              />
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
          {/* Back Button */}
          {(view === 'packages' || (view === 'search' && searchQuery)) && (
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
            {/* Categories View */}
            {view === 'categories' && !searchQuery && (
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
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
                    <p className="text-gray-400 mt-4">Loading categories...</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {categories?.map((category, idx) => {
                      const IconComponent = categoryIcons[category.name] || Package;
                      return (
                        <motion.div
                          key={category.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => handleCategorySelect(category.name)}
                          className="group p-5 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-green-500/50 hover:bg-gray-800 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 transform hover:scale-[1.02]"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <IconComponent className="w-6 h-6 text-green-400 transition-transform group-hover:scale-110" />
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <span className="text-green-300 font-bold text-lg">{category.name}</span>
                                  <span className="text-gray-500 text-sm">
                                    ({category.count} packages)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-green-400 transition-all group-hover:translate-x-1" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* Packages View */}
            {view === 'packages' && selectedCategory && (
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
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
                    <p className="text-gray-400 mt-4">Loading packages...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-3">
                      {packages.map((pkg, idx) => (
                        <motion.div
                          key={pkg.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-green-500/50 hover:bg-gray-800 transition-all duration-300"
                        >
                          <div className="flex items-start gap-3">
                            <Terminal className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-green-300 font-bold text-lg mb-1">{pkg.name}</h3>
                              <p className="text-gray-400 text-sm">{pkg.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {hasNextPage && (
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white font-medium rounded-lg transition-all"
                        >
                          {isFetchingNextPage ? 'Loading...' : 'Load More'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* Search Results View */}
            {view === 'search' && debouncedSearch && (
              <motion.div
                key="search"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="p-6"
              >
                <h2 className="text-2xl font-bold text-green-300 mb-6">
                  Search Results for "{debouncedSearch}"
                </h2>

                {searchLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
                    <p className="text-gray-400 mt-4">Searching...</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No packages found matching your search.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-3">
                      {searchResults.map((pkg, idx) => (
                        <motion.div
                          key={pkg.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-green-500/50 hover:bg-gray-800 transition-all duration-300"
                        >
                          <div className="flex items-start gap-3">
                            <Terminal className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-green-300 font-bold text-lg">{pkg.name}</h3>
                                <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                                  {pkg.category}
                                </span>
                              </div>
                              <p className="text-gray-400 text-sm">{pkg.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {hasNextSearchPage && (
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => fetchNextSearchPage()}
                          disabled={isFetchingNextSearchPage}
                          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white font-medium rounded-lg transition-all"
                        >
                          {isFetchingNextSearchPage ? 'Loading...' : 'Load More'}
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
          className="mt-8 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>ArchLens v1.0.0 • Making Arch Linux understandable, one package at a time</p>
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