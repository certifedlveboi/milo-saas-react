import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Mic } from "lucide-react"; // Import Mic icon
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Import cn utility

const QuickAddNote = ({ onAddNote }) => {
  const [note, setNote] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Setup Speech Recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false; // Stop listening after first pause
    recognition.interimResults = false; // Only get final results
    recognition.lang = 'en-US';

    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      console.log("[QuickAddNote] Speech Recognition Result:", event); // Added logging
      const transcript = event.results[0][0].transcript;
      console.log("[QuickAddNote] Transcript:", transcript); // Added logging
      setNote(transcript); // Update input field with transcript
      // setIsListening(false); // Let onend handle this
    };

    recognition.onstart = () => {
      console.log("[QuickAddNote] Speech Recognition Started"); // Added logging
      setIsListening(true);
    };

    recognition.onend = () => {
      console.log("[QuickAddNote] Speech Recognition Ended"); // Added logging
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('[QuickAddNote] Speech recognition error:', event.error, event.message); // Added logging
      setIsListening(false);
    };

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []); // Run only once on mount

  const handleMicClick = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
         setNote(""); // Clear input field before starting
         recognitionRef.current.start();
      } catch (err) {
          console.error("[QuickAddNote] Error starting recognition:", err);
          setIsListening(false); // Ensure state is correct if start fails
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (note.trim()) {
      onAddNote({ text: note });
      setNote("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4">
      <div className="relative flex-1"> {/* Wrapper for input and mic */}
        <Input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Type or click mic to add a task..."
          className="bg-yellow-50/50 border-yellow-200 focus-visible:ring-yellow-400 pr-10" // Add padding-right for mic
        />
        <button
          type="button" // Prevent form submission
          onClick={handleMicClick}
          className={cn(
            "absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full",
            "text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400",
            isListening ? "bg-red-500 text-white animate-pulse" : "bg-transparent" // Style for listening state
          )}
          title={isListening ? "Stop listening" : "Start listening"}
        >
          <Mic className="h-5 w-5" />
        </button>
      </div>
      <Button size="lg" type="submit" className="bg-yellow-500 hover:bg-yellow-600 w-12 h-12 flex-shrink-0">
        <Plus className="h-6 w-6" />
      </Button>
    </form>
  );
};

export default QuickAddNote;
