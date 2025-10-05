import { motion } from 'framer-motion';
import { Package, Layers, TrendingUp, Zap } from 'lucide-react';

export default function StatsPanel({ categories }) {
  const totalPackages = categories.reduce((sum, cat) => sum + cat.count, 0);
  const avgPackagesPerCategory = Math.round(totalPackages / categories.length);
  const largestCategory = categories.reduce((max, cat) => cat.count > max.count ? cat : max, categories[0]);

  const stats = [
    {
      icon: Package,
      label: 'Total Packages',
      value: totalPackages.toLocaleString(),
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Layers,
      label: 'Categories',
      value: categories.length,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Avg per Category',
      value: avgPackagesPerCategory,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: Zap,
      label: 'Largest Category',
      value: largestCategory.name.split(' ')[0],
      subValue: `${largestCategory.count} pkgs`,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="relative group"
        >
          <div className={`absolute inset-0 ${stat.bgColor} rounded-xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity`} />
          <div className="relative p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl group-hover:border-gray-600 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-green-300">
                {stat.value}
              </p>
              {stat.subValue && (
                <p className="text-sm text-gray-400">{stat.subValue}</p>
              )}
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}