import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function VaultIntro({ onUnlock }) {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    setOpening(true);
    setTimeout(() => {
      onUnlock();
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#F4EFEA]">
      {/* Right Vault Door */}
      <motion.div
        initial={{ x: 0 }}
        animate={opening ? { x: '100%' } : { x: 0 }}
        transition={{ duration: 1.1, ease: [0.77, 0, 0.175, 1] }}
        className="absolute top-0 right-0 w-1/2 h-full bg-[#E8DFD5] border-l-2 border-[#D4C3B3] flex items-center justify-start shadow-2xl z-20"
      >
        <div className="w-10 h-64 border-r-2 border-[#D4C3B3] bg-[#DFD3C3]/40 rounded-l-2xl ml-2" />
      </motion.div>

      {/* Left Vault Door */}
      <motion.div
        initial={{ x: 0 }}
        animate={opening ? { x: '-100%' } : { x: 0 }}
        transition={{ duration: 1.1, ease: [0.77, 0, 0.175, 1] }}
        className="absolute top-0 left-0 w-1/2 h-full bg-[#E8DFD5] border-r-2 border-[#D4C3B3] flex items-center justify-end shadow-2xl z-20"
      >
        <div className="w-10 h-64 border-l-2 border-[#D4C3B3] bg-[#DFD3C3]/40 rounded-r-2xl mr-2" />
      </motion.div>

      {/* Center Lock Mechanism */}
      <AnimatePresence>
        {!opening && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.3, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-30 flex flex-col items-center gap-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
              className="w-36 h-36 rounded-full border-2 border-dashed border-[#B89B72] flex items-center justify-center p-2.5 shadow-[0_10px_30px_rgba(184,155,114,0.2)]"
            >
              <div className="w-full h-full rounded-full bg-[#FAF7F2] border border-[#D4C3B3] flex items-center justify-center shadow-inner">
                <Lock className="w-10 h-10 text-[#8C6D46]" />
              </div>
            </motion.div>

            <div className="text-center">
              <h1 className="text-4xl font-black text-[#4A3B2C] tracking-widest mb-1.5 font-sans">
                WAZEN
              </h1>
              <p className="text-[#8C7A6B] text-sm tracking-wide">Secure Personal Vault & Wealth Tracker</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#C5A880] hover:bg-[#B5966B] text-white font-bold text-sm tracking-wider shadow-lg shadow-[#C5A880]/30 border border-[#D9C4A6] cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-100" />
              <span>UNLOCK VAULT</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}