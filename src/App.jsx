import React, { useState, useEffect } from "react";
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
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './firebase';

function App() {
  const [activeSection, setActiveSection] = useState("calendar");
  const [isLoading, setIsLoading] = useState(true); // Start loading until auth state is determined
  const { toast } = useToast();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user); // Set the user state
      setIsLoading(false); // Stop loading once auth state is known
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

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
    // Display a loading indicator while checking auth status
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Main App component rendering based on routes and auth state
  return (
    <Router>
      <Routes>
        {/* Login and Sign Up Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/app" replace />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/app" replace />} />
        
        {/* Protected App Route */}
        <Route
          path="/app"
          element={
            user ? (
              // Render the main app content if user is logged in
              <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
                <Navigation
                  activeSection={activeSection}
                  onSelectSection={setActiveSection}
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-6xl mx-auto"
                >
                  {renderContent()}
                </motion.div>
                <Toaster />
              </div>
            ) : (
              // Redirect to login if user is not logged in
              <Navigate to="/login" replace />
            )
          }
        />
        
        {/* Redirect root path to /app or /login based on auth state */}
        <Route path="/" element={<Navigate to={user ? "/app" : "/login"} replace />} />
        
      </Routes>
    </Router>
  );
}

export default App;