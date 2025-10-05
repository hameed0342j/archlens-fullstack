import { motion } from 'framer-motion';
import { Terminal, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function PackageCard({ package: pkg, index, showCategory = false, searchTerm = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`pacman -S ${pkg.name}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Highlight search term in text
  const highlightText = (text, term) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={i} className="bg-green-500/30 text-green-200 px-1 rounded">{part}</mark>
      ) : part
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      className="group relative p-5 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 hover:border-green-500/50 transition-all duration-300 overflow-hidden"
    >
      {/* Hover gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:to-transparent transition-all duration-300" />

      <div className="relative flex items-start gap-4">
        {/* Terminal icon */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-green-400/20 blur-lg group-hover:bg-green-400/30 transition-all duration-300" />
          <div className="relative p-2 bg-gray-900/80 rounded-lg border border-gray-700 group-hover:border-green-500/50 transition-all">
            <Terminal className="w-5 h-5 text-green-400" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-green-300 font-bold text-lg group-hover:text-green-200 transition-colors">
                  {highlightText(pkg.name, searchTerm)}
                </h3>
                {showCategory && (
                  <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
                    {pkg.category}
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {highlightText(pkg.description, searchTerm)}
              </p>
            </div>

            {/* Copy install command button */}
            <button
              onClick={handleCopy}
              className="flex-shrink-0 p-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-green-500/50 rounded-lg transition-all group/btn"
              title="Copy install command"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400 group-hover/btn:text-green-400 transition-colors" />
              )}
            </button>
          </div>

          {/* Install command preview */}
          <div className="mt-3 p-2 bg-gray-950/50 border border-gray-800 rounded-lg">
            <code className="text-xs text-gray-500 font-mono">
              $ pacman -S <span className="text-green-400">{pkg.name}</span>
            </code>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}