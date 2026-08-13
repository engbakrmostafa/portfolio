import { motion } from 'framer-motion';

interface LoadingScreenProps {
  name?: string;
}

export default function LoadingScreen({ name }: LoadingScreenProps) {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-[9999] bg-[#0C0C0C] flex flex-col items-center justify-center gap-8"
    >
      {/* Logo / Name */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col items-center gap-3"
      >
        {/* Glowing ring */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <motion.svg
            viewBox="0 0 80 80"
            className="absolute inset-0 w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
          >
            <circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke="url(#loadGrad)"
              strokeWidth="3"
              strokeDasharray="150 76"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="loadGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#B501A7" />
                <stop offset="100%" stopColor="#00F0FF" />
              </linearGradient>
            </defs>
          </motion.svg>
          <span className="font-black text-white text-xl uppercase">
            {(name || 'A').charAt(0)}
          </span>
        </div>

        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="font-black uppercase tracking-[0.3em] text-white text-sm"
        >
          {name || 'Portfolio'}
        </motion.p>
      </motion.div>

      {/* Progress bar */}
      <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #B501A7, #00F0FF)' }}
        />
      </div>
    </motion.div>
  );
}
