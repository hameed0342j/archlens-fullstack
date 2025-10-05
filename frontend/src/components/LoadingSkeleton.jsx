import { motion } from 'framer-motion';

export default function LoadingSkeleton({ count = 10, type = 'package' }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className="relative p-5 rounded-xl bg-gray-800/30 border border-gray-700/50 overflow-hidden"
        >
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-gray-700/20 to-transparent" />
          </div>

          {type === 'category' ? (
            // Category skeleton
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-700/50 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-700/50 rounded w-1/3 animate-pulse" />
                <div className="h-2 bg-gray-700/50 rounded w-full animate-pulse" />
              </div>
            </div>
          ) : (
            // Package skeleton
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-700/50 rounded-lg animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-700/50 rounded w-1/4 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-700/50 rounded w-full animate-pulse" />
                  <div className="h-3 bg-gray-700/50 rounded w-5/6 animate-pulse" />
                </div>
                <div className="h-8 bg-gray-900/50 border border-gray-800 rounded-lg animate-pulse" />
              </div>
            </div>
          )}
        </motion.div>
      ))}

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}