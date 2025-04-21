
import React from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import DailyMotivationTile from "./DailyMotivationTile";
import NewsForYouTile from "./NewsForYouTile";
import ProgressBoostTile from "./ProgressBoostTile";
import SmartTipsTile from "./SmartTipsTile";
import MoodBoostTile from "./MoodBoostTile";

const MotivationDashboard = () => {
  const { toast } = useToast();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2"
      >
        <DailyMotivationTile />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <MoodBoostTile />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <NewsForYouTile />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ProgressBoostTile />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="lg:col-span-1"
      >
        <SmartTipsTile />
      </motion.div>
    </div>
  );
};

export default MotivationDashboard;
