import React, { useState, useEffect, useMemo, useCallback } from "react";
import { format, parseISO, startOfDay, getDay, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import NotesList from "@/components/NotesList";
import RemindersList from "@/components/RemindersList";
import VoiceAssistant from "@/components/VoiceAssistant"; // Import VoiceAssistant directly
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
  const [habits, setHabits] = useState([]);
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
      if (!note.date) return false; // Skip notes without a date
      try {
        const noteDate = parseISO(note.date);
        // Direct match
        if (note.date === selectedDateString) {
          return true;
        }
        // Recurring checks
        if (note.recurring && noteDate <= startOfDay(selectedDate)) {
          switch (note.recurringPattern) {
            case 'daily':
              return true;
            case 'weekly':
              return getDay(noteDate) === getDay(selectedDate);
            case 'monthly':
               return noteDate.getDate() === selectedDate.getDate();
            default:
              return false;
          }
        }
      } catch (e) {
        console.error("Error parsing note date:", note.date, e);
        return false;
      }
      return false;
    });
  }, [allNotes, selectedDateString, selectedDate]);

  // Filter reminders based on selected date
   const filteredReminders = useMemo(() => {
     return allReminders.filter(reminder => {
        if (!reminder.date) return false;
         try {
           // Basic check for now, assuming reminders are not recurring yet
           return reminder.date === selectedDateString;
         } catch (e) {
           console.error("Error parsing reminder date:", reminder.date, e);
           return false;
         }
     });
  }, [allReminders, selectedDateString]);


  // --- Handler Functions ---

  const handleAddNote = useCallback((newNoteData) => {
    const noteToAdd = {
      id: uuidv4(),
      completed: false,
      priority: 'normal',
      date: selectedDateString, // Associate with the selected date
      text: newNoteData.text || "New Note", // Ensure text exists
      recurring: newNoteData.recurring || false,
      recurringPattern: newNoteData.recurringPattern || null,
      // Add any other fields from newNoteData if necessary
    };
    setAllNotes(prevNotes => [...prevNotes, noteToAdd]);
     toast({ title: "Note Added", description: `Note "${noteToAdd.text.substring(0, 20)}..." added for ${format(selectedDate, 'PPP')}`});
  }, [selectedDateString, toast]); // Dependencies for useCallback

   const handleAddReminder = useCallback((newReminderData) => {
     const reminderToAdd = {
       id: uuidv4(),
       completed: false,
       date: selectedDateString, // Associate with the selected date
       text: newReminderData.text || "New Reminder",
       time: newReminderData.time || "", // Store time if provided
       category: newReminderData.category || "personal", // Default category
       timestamp: new Date().toISOString(), // Add timestamp for sorting
     };
     setAllReminders(prevReminders => [...prevReminders, reminderToAdd]);
     toast({ title: "Reminder Added", description: `Reminder "${reminderToAdd.text.substring(0, 20)}..." added for ${format(selectedDate, 'PPP')}`});
   }, [selectedDateString, toast]); // Dependencies for useCallback

  const handleToggleNote = useCallback((noteId) => {
    setAllNotes(prevNotes => prevNotes.map(note =>
      note.id === noteId ? { ...note, completed: !note.completed } : note
    ));
  }, []);

  const handleToggleReminder = useCallback((reminderId) => {
    setAllReminders(prevReminders => prevReminders.map(reminder =>
      reminder.id === reminderId ? { ...reminder, completed: !reminder.completed } : reminder
    ));
  }, []);

  // Update needs to find the note by ID in the main list
  const handleUpdateNote = useCallback((index, updatedNoteData) => {
    const noteToUpdateId = filteredNotes[index]?.id;
    if (!noteToUpdateId) return; // Safety check

    setAllNotes(prevNotes => prevNotes.map(note =>
      note.id === noteToUpdateId
        ? { ...note, ...updatedNoteData, id: note.id } // Merge changes
        : note
    ));
     toast({ title: "Note Updated"});
  }, [filteredNotes, toast]); // filteredNotes changes, so include it

  const handleDeleteNote = useCallback((noteId) => {
    setAllNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    toast({
      title: "Note Deleted",
      variant: "destructive",
    });
  }, [toast]);

   const handleDeleteReminder = useCallback((reminderId) => {
    setAllReminders(prevReminders => prevReminders.filter(reminder => reminder.id !== reminderId));
    toast({
      title: "Reminder Deleted",
       variant: "destructive",
    });
  }, [toast]);

  // --- Voice Command Processing --- 
  const handleVoiceCommand = useCallback((commandResult) => {
    console.log("Processing voice command in DayContent:", commandResult);
    const { action, data } = commandResult;

    if (action === 'addNote' && data.text) {
      handleAddNote({ text: data.text }); // Pass necessary data
    } else if (action === 'addReminder' && data.text) {
      handleAddReminder({ 
          text: data.text, 
          time: data.time, // Pass time if extracted
          category: data.category // Pass category if extracted
      }); 
    } else {
      console.warn("Unknown or incomplete voice command action:", commandResult);
      toast({ title: "Voice Command", description: "Could not perform action.", variant: "destructive" });
    }
  }, [handleAddNote, handleAddReminder, toast]); // Dependencies


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:col-span-1 space-y-6" // Added space-y-6 for spacing
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(newDate) => setSelectedDate(newDate || new Date())}
          className="rounded-lg bg-white shadow-lg p-4 border border-gray-200"
        />
        {/* Render VoiceAssistant directly instead of VoiceModeTile */}
        <VoiceAssistant onCommandProcessed={handleVoiceCommand} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="md:col-span-2"
      >
        <NotesList
          notes={filteredNotes}
          reminders={filteredReminders}
          habits={habits}
          onToggleNote={handleToggleNote}
          onAddNote={handleAddNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
          selectedDate={selectedDate}
        />
        <div className="mt-6">
          <RemindersList
            reminders={filteredReminders}
            onAddReminder={handleAddReminder}
            onToggleReminder={handleToggleReminder}
            onDeleteReminder={handleDeleteReminder}
            selectedDate={selectedDate}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default DayContent;
