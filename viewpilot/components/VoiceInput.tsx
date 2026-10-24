'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceInputProps {
  onTranscriptChange: (text: string) => void;
  isListening?: boolean;
  className?: string;
}

export function VoiceInput({ onTranscriptChange, className = '' }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              onTranscriptChange(transcript);
            } else {
              currentInterim += transcript;
            }
          }
          setInterimText(currentInterim);
        };

        recognition.onerror = (event: any) => {
          console.warn('[VoiceInput] Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
          setInterimText('');
        };

        recognitionRef.current = recognition;
      }
    }
  }, [onTranscriptChange]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setInterimText('');
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('[VoiceInput] Could not start speech recognition:', err);
      }
    }
  };

  if (!isSupported) {
    return null; // Graceful degradation if browser doesn't have Web Speech API
  }

  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={toggleRecording}
        title={isRecording ? 'Stop listening' : 'Start voice input (Speech to Text)'}
        className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
          isRecording
            ? 'bg-[#B9573D] text-white shadow-lg shadow-[#B9573D]/30 scale-105'
            : 'bg-[var(--surface-container)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-container-high)]'
        }`}
      >
        {isRecording ? (
          <>
            <motion.span
              className="absolute inset-0 rounded-full bg-[#B9573D]"
              animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            />
            <Mic className="w-5 h-5 relative z-10 animate-pulse" />
          </>
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </button>

      {/* Live Interim Transcript Pill */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface-container-high)] text-xs text-[var(--text-primary)] border border-[var(--outline)]/20 shadow-sm max-w-xs truncate"
          >
            <span className="w-2 h-2 rounded-full bg-[#B9573D] animate-ping" />
            <span className="truncate italic">
              {interimText || 'Listening... Speak naturally.'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
