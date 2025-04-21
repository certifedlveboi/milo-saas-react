import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Check, Trophy, Target, Calendar, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ReactConfetti from 'react-confetti';
import AddHabitDialog from "./AddHabitDialog";
import { nanoid } from 'nanoid'

const HabitTracker = () => {
    const [habits, setHabits] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const { toast } = useToast();

    const handleAddHabit = (habitData) => {
        setHabits(prevHabits => [...prevHabits, { ...habitData, id: nanoid() }]);
    };

    return (
        <div className="space-y-6">
            {showConfetti && <ReactConfetti />}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="col-span-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Your Habits</CardTitle>
                        <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Habit
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[500px] pr-4">
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {habits.map((habit) => {
                                        const habitId = habit.id || nanoid();
                                        return (
                                            <motion.div
                                                key={habitId}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                className="bg-white rounded-lg p-6 shadow-sm border"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-gray-800">{habit.name}</h3>
                                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                                            <Calendar className="h-4 w-4" />
                                                            {habit.frequency}
                                                        </p>
                                                        {habit.target_goal && (
                                                            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                                <Target className="h-4 w-4" />
                                                                Goal: {habit.target_goal}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                            Complete
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="icon"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                                        <span>Current Streak</span>
                                                        <span className="flex items-center gap-1">
                                                            <Trophy className="h-4 w-4 text-yellow-500" />
                                                            {habit.habit_streaks?.[0]?.current_streak || 0} days
                                                        </span>
                                                    </div>
                                                    <Progress
                                                        value={((habit.habit_streaks?.[0]?.current_streak || 0) / 7) * 100}
                                                        className="h-2"
                                                    />
                                                    <div className="flex justify-between text-xs text-gray-500">
                                                        <span>Best Streak: {habit.habit_streaks?.[0]?.longest_streak || 0} days</span>
                                                        <span>Goal: 7 days</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            <AddHabitDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                onAddHabit={handleAddHabit}
            />
        </div>
    );
};

export default HabitTracker;
