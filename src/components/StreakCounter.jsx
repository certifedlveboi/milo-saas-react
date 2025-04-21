
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

const StreakCounter = () => {
  const [streak, setStreak] = useState(0);

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-xl shadow-lg">
      <motion.div
        animate={{
          scale: [1, 1.2, 0.9, 1.1, 1],
          rotate: [-3, 3, -3, 3, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="relative"
      >
        <motion.div
          className="absolute inset-0 blur-lg bg-orange-400 rounded-full opacity-50"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <Flame className="h-6 w-6 text-white relative z-10" />
      </motion.div>
      <span className="font-bold text-white text-lg">{streak}</span>
    </div>
  );
};

export default StreakCounter;
