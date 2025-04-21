
import React, { useState } from "react";
import NetWorthTile from "./NetWorthTile";
import ExpensesTile from "./ExpensesTile";
import SubscriptionsTile from "./SubscriptionsTile";
import BillsTile from "./BillsTile";
import SavingsGoalsTile from "./SavingsGoalsTile";
import AISuggestionsTile from "./AISuggestionsTile";
import { useToast } from "@/components/ui/use-toast";

const BudgetPlanning = () => {
  const [expenses, setExpenses] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [bills, setBills] = useState([]);
  const [goals, setGoals] = useState([]);
  const { toast } = useToast();

  const calculateNetWorth = () => {
    const totalAssets = 0; // Implement asset calculation
    const totalLiabilities = bills.reduce((sum, bill) => sum + bill.amount, 0) +
      subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
    return totalAssets - totalLiabilities;
  };

  const aiSuggestions = [
    "Consider reducing streaming subscriptions to save $30/month",
    "Setting up automatic payments for bills could help avoid late fees",
    "You're on track to reach your vacation savings goal by June",
    "Your grocery spending is 20% higher than last month"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-3">
        <NetWorthTile netWorth={calculateNetWorth()} />
      </div>
      <ExpensesTile expenses={expenses} />
      <SubscriptionsTile
        subscriptions={subscriptions}
      />
      <BillsTile
        bills={bills}
      />
      <SavingsGoalsTile
        goals={goals}
      />
      <div className="lg:col-span-2">
        <AISuggestionsTile suggestions={aiSuggestions} />
      </div>
    </div>
  );
};

export default BudgetPlanning;
