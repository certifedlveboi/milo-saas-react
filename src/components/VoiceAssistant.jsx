import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Mic, StopCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Check for browser compatibility
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const microphoneSupported = !!SpeechRecognition;

// Removed onClose prop
const VoiceAssistant = ({ onCommandProcessed }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [statusMessage, setStatusMessage] = useState(
    microphoneSupported ? "Click the mic to start" : "Microphone not supported"
  );
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  // --- Firebase Function URL (Replace with your deployed function URL!) ---
  const processCommandUrl = "YOUR_DEPLOYED_FUNCTION_URL_HERE/processVoiceCommand"; 
  // Example: "https://us-central1-your-project-id.cloudfunctions.net/processVoiceCommand"

  // Initialize Speech Recognition
  useEffect(() => {
    if (!microphoneSupported) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop after first phrase
    recognition.lang = 'en-US';
    recognition.interimResults = false; // We only want final results

    recognition.onresult = (event) => {
      const currentTranscript = event.results[0][0].transcript;
      console.log("Transcript received:", currentTranscript);
      setTranscript(currentTranscript);
      setIsListening(false);
      setStatusMessage("Processing command...");
      processTranscript(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      let errorMessage = "An unknown error occurred.";
      if (event.error === 'no-speech') {
        errorMessage = "No speech detected. Please try again.";
      } else if (event.error === 'audio-capture') {
        errorMessage = "Microphone problem. Please check permissions and hardware.";
      } else if (event.error === 'not-allowed') {
        errorMessage = "Microphone access denied. Please allow access in browser settings.";
      }
       else if (event.error === 'aborted') {
         // This can happen if stopListening is called before speech ends, usually fine
         console.log("Recognition aborted, likely intentional.");
         return; // Don't show error for this
       }
      setError(errorMessage);
      setStatusMessage("Error occurred");
      setIsListening(false);
      setIsProcessing(false); // Ensure processing stops on error
    };

    recognition.onend = () => {
       // Only reset if not already processing or errored
      if (!isProcessing && !error && isListening) {
        console.log("Recognition ended naturally without result.");
        setIsListening(false);
        setStatusMessage("Click the mic to start");
      }
    };


    recognitionRef.current = recognition;

    // Cleanup function
    return () => {
       if (recognitionRef.current) {
         recognitionRef.current.abort(); // Stop listening if component unmounts
       }
    };
  }, [isProcessing, error, isListening]); // Rerun effect if these change relevant states

  const processTranscript = useCallback(async (text) => {
    setIsProcessing(true);
    setError(null); // Clear previous errors
    setTranscript(text); // Show the final transcript while processing
    
    if (processCommandUrl === "YOUR_DEPLOYED_FUNCTION_URL_HERE/processVoiceCommand") {
       console.error("Firebase Function URL not set!");
       setError("Configuration error: Function URL missing.");
       setStatusMessage("Error");
       setIsProcessing(false);
       return;
    }

    try {
      const response = await fetch(processCommandUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Processed command result:", result);

      if (result.action && result.action !== 'unknown') {
         onCommandProcessed(result); // Pass the structured result up
         setStatusMessage("Command processed!");
         // Reset status after a delay
         setTimeout(() => setStatusMessage("Click the mic to start"), 2000); 
      } else {
         setStatusMessage("Could not understand command. Try again.");
         setError("Intent not recognized or data missing.");
      }

    } catch (err) {
      console.error("Error processing command:", err);
      setError(err.message || "Failed to connect to processing service.");
      setStatusMessage("Error");
    } finally {
      setIsProcessing(false);
      // Reset transcript after a delay
      setTimeout(() => setTranscript(""), 2000); 
    }
  }, [onCommandProcessed, processCommandUrl]);

  const handleToggleListen = () => {
    if (!microphoneSupported) return;
    if (isProcessing) return; // Don't allow starting while processing

    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
         recognitionRef.current.stop();
      }
      setIsListening(false);
      setStatusMessage("Stopped listening. Click mic to start.");

    } else {
      // Start listening
      setError(null); // Clear previous errors
      setTranscript(""); // Clear previous transcript
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
         navigator.mediaDevices.getUserMedia({ audio: true })
           .then(() => {
              if (recognitionRef.current) {
                 recognitionRef.current.start();
                 setIsListening(true);
                 setStatusMessage("Listening...");
              }
           })
           .catch(err => {
              console.error("Microphone access denied:", err);
              setError("Microphone access denied. Please allow access.");
              setStatusMessage("Error");
           });
       } else {
           setError("getUserMedia not supported");
           setStatusMessage("Error");
       }
    }
  };


  return (
    // Changed container style for direct embedding
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md border border-gray-200 min-h-[180px]">
      <motion.div
        animate={{ scale: isListening ? 1.1 : 1 }} // Reduced scale effect slightly
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <Button
          size="lg"
          variant={isListening ? "destructive" : "outline"}
          className={cn(
            "rounded-full w-16 h-16 shadow-md", // Slightly smaller button
            isListening ? "bg-red-500 hover:bg-red-600" : "bg-gray-50 hover:bg-gray-100",
            !microphoneSupported && "opacity-50 cursor-not-allowed"
          )}
          onClick={handleToggleListen}
          disabled={!microphoneSupported || isProcessing}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isProcessing ? (
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          ) : isListening ? (
            <StopCircle className="h-6 w-6 text-white" />
          ) : (
            <Mic className="h-6 w-6 text-blue-600" />
          )}
        </Button>
      </motion.div>

      <p className="mt-3 text-base font-medium text-gray-600 min-h-[24px] text-center">
        {statusMessage}
      </p>

      {transcript && (
        <p className="mt-1 text-sm text-gray-500 italic text-center">"{transcript}"</p>
      )}

      {error && (
        <div className="mt-2 flex items-center gap-1 text-red-600 bg-red-50 p-2 rounded-md text-xs">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
       {!microphoneSupported && (
         <p className="mt-2 text-xs text-orange-600 text-center">
            Voice commands require microphone access and browser support.
         </p>
        )}
    </div>
  );
};

export default VoiceAssistant;
