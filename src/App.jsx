import React, { useState } from "react";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import HabitTracker from "@/components/habits/HabitTracker";
import FocusMode from "@/components/FocusMode";
import BudgetPlanning from "@/components/budget/BudgetPlanning";
import DayContent from "@/components/DayContent";
import MotivationDashboard from "@/components/motivation/MotivationDashboard";
import EmailDashboard from "@/components/email/EmailDashboard";
import TeamsDashboard from "@/components/teams/TeamsDashboard";

function App() {
  const [activeSection, setActiveSection] = useState("calendar");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const renderContent = () => {
    switch (activeSection) {
      case "calendar":
        return <DayContent />;
      case "habits":
        return <HabitTracker />;
      case "focus":
        return <FocusMode />;
      case "budget":
        return <BudgetPlanning />;
      case "email":
        return <EmailDashboard />;
      case "teams":
        return <TeamsDashboard />;
      case "motivation":
        return <MotivationDashboard />;
      default:
        return <DayContent />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <Navigation activeSection={activeSection} onSelectSection={setActiveSection} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {renderContent()}
      </motion.div>
      <Toaster />
    </div>
  );
}

export default App;
