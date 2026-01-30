import { useCallback, useRef, useEffect } from "react";

// Sound URLs from free sound libraries
const SOUNDS = {
  engine: "https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3",
  collision: "https://assets.mixkit.co/active_storage/sfx/2010/2010-preview.mp3",
  countdown: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
  go: "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3",
  finish: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3",
  powerup: "https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3",
};

export const useGameSounds = () => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const engineLoopRef = useRef<HTMLAudioElement | null>(null);

  // Preload sounds
  useEffect(() => {
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = "auto";
      audio.volume = key === "engine" ? 0.3 : 0.5;
      audioRefs.current[key] = audio;
    });

    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = "";
        }
      });
      if (engineLoopRef.current) {
        engineLoopRef.current.pause();
      }
    };
  }, []);

  const playSound = useCallback((soundName: keyof typeof SOUNDS) => {
    const audio = audioRefs.current[soundName];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }, []);

  const startEngineLoop = useCallback(() => {
    const audio = audioRefs.current.engine;
    if (audio) {
      audio.loop = true;
      audio.play().catch(() => {});
      engineLoopRef.current = audio;
    }
  }, []);

  const stopEngineLoop = useCallback(() => {
    if (engineLoopRef.current) {
      engineLoopRef.current.pause();
      engineLoopRef.current.currentTime = 0;
      engineLoopRef.current.loop = false;
    }
  }, []);

  return {
    playSound,
    startEngineLoop,
    stopEngineLoop,
  };
};
