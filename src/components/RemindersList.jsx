import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import QuickAddReminder from "@/components/QuickAddReminder";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react"; // Import Trash2 icon

const RemindersList = ({
  reminders, // Accept reminders as prop
  onAddReminder,
  onToggleReminder,
  onDeleteReminder, // Accept delete handler as prop
}) => {

  // Sorting is now done on the passed `reminders` prop
  const sortedReminders = [...(reminders || [])].sort((a, b) => {
    // Assuming reminders have a time string like 'HH:mm'
    // Or a full timestamp; adjust parsing/comparison as needed
    const timeA = a.time; // Or a.timestamp
    const timeB = b.time; // Or b.timestamp
    return timeA.localeCompare(timeB);
  });

  const getCategoryColor = (category) => {
    switch (category) {
      case "work":
        return "bg-blue-500";
      case "personal":
        return "bg-purple-500";
      case "fitness":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleDeleteReminder = (reminderId) => {
    if (onDeleteReminder) {
      onDeleteReminder(reminderId);
    }
  };

  return (
    <div className="bg-blue-50 rounded-lg p-6 shadow-lg border-t-4 border-blue-400 min-h-[250px]">
      <h3 className="font-medium mb-4 text-blue-800">Reminders</h3>
      {/* Pass the handler from DayContent */}
      <QuickAddReminder onAddReminder={onAddReminder} />
      <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
        <AnimatePresence>
          {sortedReminders.map((reminder) => (
            <motion.div
              key={reminder.id} // Use unique ID
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} // Add exit animation
              className={cn(
                "bg-white/50 p-4 rounded-lg shadow-sm border border-blue-100 flex items-start gap-3 group",
                reminder.completed && "bg-blue-50/30 border-blue-200"
              )}
            >
              <Checkbox
                id={`reminder-${reminder.id}`}
                checked={reminder.completed}
                onCheckedChange={() => onToggleReminder(reminder.id)} // Use ID
                className="mt-1 flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getCategoryColor(reminder.category)}`} />
                  <p className={cn(
                    "font-medium text-blue-900",
                    reminder.completed && "line-through text-blue-600"
                  )}>
                    {reminder.text}
                  </p>
                </div>
                <p className="text-sm text-blue-600 mt-1">{reminder.time}</p>
              </div>
              {/* Delete Button (visible when completed) */}
              {reminder.completed && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0 ml-auto"
                  onClick={() => handleDeleteReminder(reminder.id)} // Pass ID
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RemindersList;
