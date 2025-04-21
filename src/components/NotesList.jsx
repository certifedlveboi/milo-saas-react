import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import QuickAddNote from "@/components/QuickAddNote";
import { Edit2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const getProgressColor = (percentage) => {
  if (percentage < 30) return "from-red-200 to-red-500";
  if (percentage < 70) return "from-yellow-200 to-yellow-500";
  return "from-green-200 to-green-500";
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 border-red-200 text-red-800";
    case "medium":
      return "bg-yellow-100 border-yellow-200 text-yellow-800";
    case "low":
      return "bg-green-100 border-green-200 text-green-800";
    default:
      return "bg-gray-100 border-gray-200 text-gray-800";
  }
};

const NotesList = ({
  notes, // Now receives filtered notes
  reminders, // Still needed for prioritization logic
  habits,
  onToggleNote,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [editingNote, setEditingNote] = React.useState(null); // { note: NoteData, index: number }
  const completedTasks = notes.filter((note) => note.completed).length;
  const totalTasks = notes.length;
  const progressPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Prioritization and sorting logic remains similar, but operates on the filtered `notes` prop
  const prioritizeNotes = () => {
    const prioritizedNotes = notes.map((note) => {
      let currentPriority = note.priority || "normal";

      const matchedReminder = reminders?.find((reminder) =>
        note.text.toLowerCase().includes(reminder.text.toLowerCase())
      );
      if (matchedReminder) {
        currentPriority = "high"; // Override if matches a reminder
      }

      const matchedHabit = habits?.find((habit) =>
        note.text.toLowerCase().includes(habit.text.toLowerCase())
      );
       if (matchedHabit) {
         currentPriority = "high"; // Override if matches a habit
       }

      return { ...note, priority: currentPriority };
    });

    const priorityOrder = { high: 1, medium: 2, low: 3, normal: 4 };
    return prioritizedNotes.sort((a, b) => {
        // Sort primarily by completion status (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Then sort by priority
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const [prioritizedNotes, setPrioritizedNotes] = React.useState(prioritizeNotes());

  // Recalculate prioritized notes when the incoming filtered `notes` change
  React.useEffect(() => {
    setPrioritizedNotes(prioritizeNotes());
  }, [notes, reminders, habits]);

  const handleEditNoteClick = (note, index) => {
    // Pass the index *within the currently displayed filtered list*
    setEditingNote({ ...note, index });
  };

  const handleSaveEdit = () => {
    if (editingNote) {
      // Pass the index and the updated note data (without index)
      const { index, ...updatedNoteData } = editingNote;
      onUpdateNote(index, updatedNoteData); // DayContent uses this index to find the ID
      setEditingNote(null);
    }
  };

  const handleDeleteNote = (noteId) => {
    if (onDeleteNote) {
      onDeleteNote(noteId);
    }
  };

  const noteVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-gray-700">Tasks</h3>
        {totalTasks > 0 && (
          <span className="text-sm text-gray-500">
            {completedTasks}/{totalTasks} completed
          </span>
        )}
      </div>

      {totalTasks > 0 && (
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              className={`h-full bg-gradient-to-r ${getProgressColor(
                progressPercentage
              )}`}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      <QuickAddNote onAddNote={onAddNote} />

      <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto pr-2">
        <AnimatePresence>
          {prioritizedNotes.length === 0 && (
             <p className="text-gray-500 text-center py-4">No tasks for this day.</p>
          )}
          {prioritizedNotes.map((note, index) => (
            <motion.div
              key={note.id}
              layout // Animate layout changes (like reordering)
              variants={noteVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={cn(
                `flex items-center gap-3 p-3 rounded-md border transition-colors group`,
                getPriorityColor(note.priority),
                note.completed && "opacity-60"
              )}
            >
              <Checkbox
                id={`note-${note.id}`}
                checked={note.completed}
                onCheckedChange={() => onToggleNote(note.id)}
                className="flex-shrink-0 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label
                htmlFor={`note-${note.id}`}
                className={cn(
                  `flex-1 cursor-pointer text-sm`,
                  note.completed ? "line-through text-gray-500" : "text-gray-800"
                )}
                onClick={() => handleEditNoteClick(note, index)} // Use specific click handler
              >
                {note.text}
                {note.recurring && (
                  <span className="ml-2 text-xs text-gray-500">
                    (Repeats {note.recurringPattern})
                  </span>
                )}
              </label>
              {/* Edit Button */}
               <Button
                 variant="ghost"
                 size="icon"
                 className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-gray-500 hover:text-gray-700"
                 onClick={() => handleEditNoteClick(note, index)}
               >
                 <Edit2 className="h-4 w-4" />
               </Button>
              {/* Delete Button */}
              {note.completed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingNote && (
            <div className="space-y-4 py-4">
              <Input
                value={editingNote.text}
                onChange={(e) =>
                  setEditingNote({ ...editingNote, text: e.target.value })
                }
                placeholder="Task description"
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={editingNote.priority || "normal"}
                  onValueChange={(value) =>
                    setEditingNote({
                      ...editingNote,
                      priority: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Recurring Pattern</label>
                <Select
                  value={editingNote.recurring ? (editingNote.recurringPattern || "daily") : "none"}
                  onValueChange={(value) =>
                    setEditingNote({
                      ...editingNote,
                      recurring: value !== "none",
                      recurringPattern: value !== "none" ? value : null,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recurring pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Recurrence</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNote(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotesList;
