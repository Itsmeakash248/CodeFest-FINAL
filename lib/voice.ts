'use client';

let activeAudio: HTMLAudioElement | null = null;

export function stopSpeaking(): void {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function speakViaBrowser(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!isSpeechSynthesisSupported()) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    // Prefer high-quality English female or male voices
    const preferred = voices.find(
      (v) => /en-(US|GB)/i.test(v.lang) && /natural|samantha|aria|jenny|google/i.test(v.name)
    );
    const fallback = voices.find((v) => /^en/i.test(v.lang));

    if (preferred || fallback) {
      utterance.voice = preferred || fallback || null;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Speaks text using ElevenLabs server endpoint or smoothly falls back to browser TTS.
 */
export async function speakQuestion(
  text: string,
  onStateChange?: (isPlaying: boolean) => void
): Promise<void> {
  stopSpeaking();
  const clean = text.trim();
  if (!clean) return;

  onStateChange?.(true);

  try {
    const res = await fetch('/api/voice/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: clean }),
    });

    if (res.ok && res.headers.get('content-type')?.includes('audio')) {
      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      activeAudio = audio;

      await new Promise<void>((resolve) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          activeAudio = null;
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          activeAudio = null;
          resolve();
        };
        audio.play().catch(() => {
          // If auto-play blocked, fall back to browser speech
          speakViaBrowser(clean).then(resolve);
        });
      });
      onStateChange?.(false);
      return;
    }
  } catch (err) {
    console.warn('[Voice] ElevenLabs route error, switching to browser synthesis:', err);
  }

  // Fallback to browser SpeechSynthesis
  await speakViaBrowser(clean);
  onStateChange?.(false);
}
