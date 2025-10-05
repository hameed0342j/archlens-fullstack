import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Loader2, 
  Search,
  Terminal,
  TrendingUp,
  Package,
  Info
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Diagnose API call
const diagnoseAPI = async (problem) => {
  const response = await axios.post(`${API_BASE_URL}/api/diagnose`, { problem });
  return response.data;
};

export default function DiagnosticTool() {
  const [problem, setProblem] = useState('');
  const [copiedCommand, setCopiedCommand] = useState(null);

  const mutation = useMutation({
    mutationFn: diagnoseAPI,
    onSuccess: (data) => {
      console.log('Diagnosis complete:', data);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (problem.trim()) {
      mutation.mutate(problem);
    }
  };

  const handleCopyCommand = (command, pkgName) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(pkgName);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-400 bg-green-500/10';
    if (confidence >= 70) return 'text-yellow-400 bg-yellow-500/10';
    return 'text-orange-400 bg-orange-500/10';
  };

  const exampleQueries = [
    "My bluetooth headphones won't connect",
    "No sound coming from speakers",
    "Screen flickering and graphics glitches",
    "Virtual machine fails to start",
    "WiFi constantly disconnecting",
    "Terminal fonts showing boxes instead of icons"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <AlertCircle className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            System Diagnostic Tool
          </h2>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Describe your problem in plain English, and we'll identify the relevant packages and suggest troubleshooting commands.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="problem" className="block text-sm font-medium text-gray-300 mb-2">
              What's the issue?
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="problem"
                type="text"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="e.g., My bluetooth headphones won't connect"
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-green-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                disabled={mutation.isPending}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending || !problem.trim()}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-700 disabled:to-gray-700 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Analyze Problem
              </>
            )}
          </button>
        </form>

        {/* Example Queries */}
        {!mutation.data && !mutation.isPending && (
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-400 mb-3">Example queries:</p>
            <div className="grid gap-2">
              {exampleQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => setProblem(query)}
                  className="text-left text-sm text-gray-500 hover:text-blue-400 hover:bg-gray-800/50 px-3 py-2 rounded-lg transition-all"
                >
                  • {query}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {mutation.isError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-400 font-medium">Analysis Failed</p>
              <p className="text-red-300/70 text-sm mt-1">
                {mutation.error?.response?.data?.detail || 'An error occurred. Please try again.'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence mode="wait">
        {mutation.isSuccess && mutation.data && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Results Header */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-green-300 mb-1">
                    Diagnostic Results
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Found {mutation.data.total_found} relevant {mutation.data.total_found === 1 ? 'package' : 'packages'}
                    {mutation.data.matched_keywords?.length > 0 && (
                      <span className="ml-2">
                        • Matched keywords: 
                        <span className="text-blue-400 ml-1">
                          {mutation.data.matched_keywords.join(', ')}
                        </span>
                      </span>
                    )}
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
            </div>

            {/* No Results */}
            {mutation.data.suggestions?.length === 0 && (
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 text-center">
                <Info className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">
                  {mutation.data.message || 'No specific packages identified. Try searching with different keywords.'}
                </p>
              </div>
            )}

            {/* Suggestions List */}
            {mutation.data.suggestions?.map((suggestion, idx) => (
              <motion.div
                key={suggestion.package.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden hover:border-blue-500/50 transition-all"
              >
                <div className="p-5">
                  {/* Package Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <Package className="w-6 h-6 text-blue-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-xl font-bold text-green-300 truncate">
                            {suggestion.package.name}
                          </h4>
                          <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded">
                            {suggestion.package.category}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {suggestion.package.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                      <span className={`text-sm font-bold px-2 py-1 rounded ${getConfidenceColor(suggestion.confidence)}`}>
                        {suggestion.confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-300">
                      <span className="text-blue-400 font-medium">Why this package: </span>
                      {suggestion.reason}
                    </p>
                  </div>

                  {/* Command */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Suggested Command
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-950/50 border border-gray-700 rounded-lg p-3 font-mono text-sm text-green-400 flex items-center gap-2">
                        <Terminal className="w-4 h-4 flex-shrink-0" />
                        <code className="flex-1 truncate">{suggestion.command}</code>
                      </div>
                      <button
                        onClick={() => handleCopyCommand(suggestion.command, suggestion.package.name)}
                        className="px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-all flex items-center gap-2"
                        title="Copy command"
                      >
                        {copiedCommand === suggestion.package.name ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm font-medium">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-400 text-sm font-medium">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Match Type Badge */}
                  <div className="mt-3 flex justify-end">
                    <span className={`text-xs px-2 py-1 rounded ${
                      suggestion.match_type === 'keyword' 
                        ? 'bg-green-500/10 text-green-400' 
                        : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {suggestion.match_type === 'keyword' ? '🎯 High Confidence Match' : '🔍 Search Match'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}