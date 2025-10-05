import { motion } from 'framer-motion';
import { ChevronRight, Package } from 'lucide-react';

export default function CategoryCard({ category, icon: IconComponent = Package, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative p-6 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 hover:border-green-500/50 cursor-pointer transition-all duration-300 overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-300" />
      
      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Icon with background glow */}
          <div className="relative">
            <div className="absolute inset-0 bg-green-400/20 blur-xl group-hover:bg-green-400/30 transition-all duration-300" />
            <div className="relative p-3 bg-gray-900/50 rounded-lg border border-gray-700 group-hover:border-green-500/50 transition-all">
              <IconComponent className="w-7 h-7 text-green-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          
          {/* Category info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-green-300 font-bold text-lg group-hover:text-green-200 transition-colors">
                {category.name}
              </h3>
              <span className="text-xs px-2 py-1 bg-gray-700/50 text-gray-400 rounded-full font-medium">
                {category.count} {category.count === 1 ? 'package' : 'packages'}
              </span>
            </div>
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((category.count / 300) * 100, 100)}%` }}
                transition={{ delay: index * 0.03 + 0.2, duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Arrow icon */}
        <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-green-400 group-hover:translate-x-1 transition-all duration-300" />
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}