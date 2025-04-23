import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Mic } from "lucide-react"; // Import Mic icon
import { motion } from "framer-motion";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils"; // Import cn utility

const QuickAddReminder = ({ onAddReminder }) => {
  const [reminder, setReminder] = useState("");
  const [time, setTime] = useState("12:00 AM");
  const [category, setCategory] = useState("personal");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Setup Speech Recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      console.log("[QuickAddReminder] Speech Recognition Result:", event); // Added logging
      const transcript = event.results[0][0].transcript;
      console.log("[QuickAddReminder] Transcript:", transcript); // Added logging
      setReminder(transcript); // Update input field with transcript
      // setIsListening(false); // Let onend handle this
    };

    recognition.onstart = () => {
      console.log("[QuickAddReminder] Speech Recognition Started"); // Added logging
      setIsListening(true);
    };

    recognition.onend = () => {
      console.log("[QuickAddReminder] Speech Recognition Ended"); // Added logging
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('[QuickAddReminder] Speech recognition error:', event.error, event.message); // Added logging
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
       try {
         setReminder(""); // Clear input field before starting
         recognitionRef.current.start();
      } catch (err) {
          console.error("[QuickAddReminder] Error starting recognition:", err);
          setIsListening(false); // Ensure state is correct if start fails
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reminder.trim() && time) {
      onAddReminder({ 
        text: reminder, 
        time,
        completed: false,
        timestamp: convertTo24Hour(time),
        category
      });
      setReminder("");
      setTime("12:00 AM");
      setCategory("personal");
    }
  };

  const convertTo24Hour = (time12h) => {
    if (!time12h) return "00:00"; // Handle cases where time might be missing
    const [timePart, modifier] = time12h.split(' ');
    if (!timePart) return "00:00";
    let [hours, minutes] = timePart.split(':');

    if (!minutes) minutes = '00'; // Default minutes if missing

    if (hours === '12') {
      hours = '00';
    }

    if (modifier && modifier.toUpperCase() === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    // Ensure hours are two digits
    hours = String(hours).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-4">
       <div className="relative flex-1"> {/* Wrapper for input and mic */}
            <Input
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                placeholder="Add a reminder or click mic..."
                className="w-full bg-blue-50/50 border-blue-200 focus-visible:ring-blue-400 pr-10"
            />
            <button
                type="button"
                onClick={handleMicClick}
                className={cn(
                    "absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full",
                    "text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
                    isListening ? "bg-red-500 text-white animate-pulse" : "bg-transparent"
                )}
                title={isListening ? "Stop listening" : "Start listening"}
            >
                <Mic className="h-5 w-5" />
            </button>
        </div>

      <div className="flex gap-2">
        <TimePicker
          value={time}
          onChange={setTime}
          className="flex-1"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="fitness">Fitness</SelectItem>
          </SelectContent>
        </Select>
        <Button size="lg" type="submit" className="bg-blue-500 hover:bg-blue-600 w-12 h-12 flex-shrink-0">
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </form>
  );
};

export default QuickAddReminder;
