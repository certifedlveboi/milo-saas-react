import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import NotesList from "@/components/NotesList";
import RemindersList from "@/components/RemindersList";
import VoiceModeTile from "@/components/VoiceModeTile";
import { v4 as uuidv4 } from 'uuid';

const DayContent = () => {
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState(() => {
    const storedNotes = localStorage.getItem('notes');
    return storedNotes ? JSON.parse(storedNotes) : [];
  });
  const [reminders, setReminders] = useState([]);
  const [habits, setHabits] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = (newNote) => {
    setNotes([...notes, { ...newNote, id: uuidv4() }]);
  };

  const handleAddReminder = (newReminder) => {
    setReminders([...reminders, newReminder]);
  };

  const handleAddHabit = (newHabit) => {
    setHabits([...habits, newHabit]);
  };

  const handleToggleReminder = (index) => {
    const updatedReminders = [...reminders];
    updatedReminders[index].completed = !updatedReminders[index].completed;
    setReminders(updatedReminders);
  };

  const handleToggleNote = (index) => {
    const updatedNotes = [...notes];
    updatedNotes[index].completed = !updatedNotes[index].completed;
    setNotes(updatedNotes);
  };

  const handleUpdateNote = (index, updatedNote) => {
    const updatedNotes = [...notes];
    updatedNotes[index] = updatedNote;
    setNotes(updatedNotes);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:col-span-1"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => setDate(newDate || new Date())}
          className="rounded-lg bg-white shadow-lg p-4"
        />
        <div className="mt-6">
          <VoiceModeTile />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="md:col-span-2"
      >
        <NotesList
          notes={notes}
          reminders={reminders}
          habits={habits}
          onToggleNote={handleToggleNote}
          onAddNote={handleAddNote}
          onUpdateNote={handleUpdateNote}
        />
        <div className="mt-6">
          <RemindersList
            reminders={reminders}
            onAddReminder={handleAddReminder}
            onToggleReminder={handleToggleReminder}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default DayContent;
