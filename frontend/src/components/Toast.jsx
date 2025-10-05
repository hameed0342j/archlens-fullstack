import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const toastIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const toastColors = {
  success: 'from-green-500/20 to-green-600/20 border-green-500/50 text-green-300',
  error: 'from-red-500/20 to-red-600/20 border-red-500/50 text-red-300',
  info: 'from-blue-500/20 to-blue-600/20 border-blue-500/50 text-blue-300',
};

export default function Toast({ message, type = 'info', onClose }) {
  const Icon = toastIcons[type];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className="fixed top-4 right-4 z-50 max-w-md"
    >
      <div className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-lg shadow-2xl bg-gradient-to-br ${toastColors[type]}`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}