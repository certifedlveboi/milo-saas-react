import React, { useState, useEffect, useMemo } from "react";
import { format, isSameDay, isSameWeek, isSameMonth, parseISO, startOfDay, addDays, getDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import NotesList from "@/components/NotesList";
import RemindersList from "@/components/RemindersList";
import VoiceModeTile from "@/components/VoiceModeTile";
import { v4 as uuidv4 } from 'uuid';

// Helper function to get date string in yyyy-MM-dd format
const getDateString = (date) => format(startOfDay(date), 'yyyy-MM-dd');

const DayContent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allNotes, setAllNotes] = useState(() => {
    const storedNotes = localStorage.getItem('notes');
    return storedNotes ? JSON.parse(storedNotes) : [];
  });
  const [allReminders, setAllReminders] = useState(() => {
    const storedReminders = localStorage.getItem('reminders');
    return storedReminders ? JSON.parse(storedReminders) : [];
  });
  const [habits, setHabits] = useState([]); // Assuming habits are managed elsewhere
  const { toast } = useToast();

  const selectedDateString = getDateString(selectedDate);

  // Save notes to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(allNotes));
  }, [allNotes]);

  // Save reminders to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(allReminders));
  }, [allReminders]);

  // Filter notes based on selected date and recurrence
  const filteredNotes = useMemo(() => {
    return allNotes.filter(note => {
      const noteDate = parseISO(note.date); // Assumes note.date is 'yyyy-MM-dd'

      // Direct match
      if (note.date === selectedDateString) {
        return true;
      }

      // Recurring checks
      if (note.recurring && noteDate <= startOfDay(selectedDate)) {
        switch (note.recurringPattern) {
          case 'daily':
            return true; // Shows up every day after its start date
          case 'weekly':
            // Check if it's the same day of the week and on or after the start date
            return getDay(noteDate) === getDay(selectedDate);
          case 'monthly':
             // Check if it's the same day of the month and on or after the start date
             return noteDate.getDate() === selectedDate.getDate();
          default:
            return false;
        }
      }
      return false;
    });
  }, [allNotes, selectedDateString, selectedDate]);

  // Filter reminders based on selected date (assuming reminders are not recurring for now)
   const filteredReminders = useMemo(() => {
    return allReminders.filter(reminder => reminder.date === selectedDateString);
  }, [allReminders, selectedDateString]);


  // --- Handler Functions ---

  const handleAddNote = (newNoteData) => {
    const newNote = {
      ...newNoteData,
      id: uuidv4(),
      completed: false,
      priority: 'normal',
      date: selectedDateString, // Associate with the selected date
    };
    setAllNotes([...allNotes, newNote]);
     toast({ title: "Note Added", description: `Note added for ${format(selectedDate, 'PPP')}`});
  };

   const handleAddReminder = (newReminderData) => {
    const newReminder = {
      ...newReminderData,
      id: uuidv4(),
      completed: false,
      date: selectedDateString, // Associate with the selected date
    };
    setAllReminders([...allReminders, newReminder]);
     toast({ title: "Reminder Added", description: `Reminder added for ${format(selectedDate, 'PPP')}`});
  };

  const handleToggleNote = (noteId) => {
    setAllNotes(allNotes.map(note =>
      note.id === noteId ? { ...note, completed: !note.completed } : note
    ));
  };

  const handleToggleReminder = (reminderId) => {
    setAllReminders(allReminders.map(reminder =>
      reminder.id === reminderId ? { ...reminder, completed: !reminder.completed } : reminder
    ));
  };

  // Update needs to find the note by ID in the main list
  const handleUpdateNote = (index, updatedNoteData) => { // index here is from the *filtered* list
    const noteToUpdateId = filteredNotes[index].id; // Get the actual ID
    setAllNotes(allNotes.map(note =>
      note.id === noteToUpdateId
        ? { ...note, ...updatedNoteData, id: note.id } // Merge changes, keep original ID and date if not changed
        : note
    ));
     toast({ title: "Note Updated"});
  };

  // Delete needs to find the note by ID in the main list
  const handleDeleteNote = (noteId) => {
    setAllNotes(allNotes.filter(note => note.id !== noteId));
    toast({
      title: "Note Deleted",
      variant: "destructive",
      description: "The note has been removed.",
    });
  };

   const handleDeleteReminder = (reminderId) => {
    setAllReminders(allReminders.filter(reminder => reminder.id !== reminderId));
    toast({
      title: "Reminder Deleted",
       variant: "destructive",
      description: "The reminder has been removed.",
    });
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
          selected={selectedDate}
          onSelect={(newDate) => setSelectedDate(newDate || new Date())} // Update selectedDate state
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
        {/* Pass filtered data and all handlers */}
        <NotesList
          notes={filteredNotes} // Pass filtered notes
          reminders={filteredReminders} // Pass filtered reminders (for priority check)
          habits={habits}
          onToggleNote={handleToggleNote}
          onAddNote={handleAddNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
          selectedDate={selectedDate} // Pass selected date if needed in NotesList
        />
        <div className="mt-6">
           {/* Pass filtered data and all handlers */}
          <RemindersList
            reminders={filteredReminders} // Pass filtered reminders
            onAddReminder={handleAddReminder}
            onToggleReminder={handleToggleReminder}
            onDeleteReminder={handleDeleteReminder} // Add delete handler
            selectedDate={selectedDate} // Pass selected date if needed
          />
        </div>
      </motion.div>
    </div>
  );
};

export default DayContent;
