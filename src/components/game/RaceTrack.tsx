import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useGameSounds } from "@/hooks/useGameSounds";

interface RaceTrackProps {
  player: 1 | 2;
  onGameEnd: (time: number) => void;
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  type: "barrier" | "cone" | "oil";
  hit?: boolean;
}

const TRACK_WIDTH = 320;
const TRACK_HEIGHT = 520;
const CAR_WIDTH = 36;
const CAR_HEIGHT = 65;
const OBSTACLE_HEIGHT = 35;
const FINISH_DISTANCE = 5000;

const RaceTrack = ({ player, onGameEnd }: RaceTrackProps) => {
  const [carX, setCarX] = useState(TRACK_WIDTH / 2 - CAR_WIDTH / 2);
  const [distance, setDistance] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [collision, setCollision] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  // Penalty state handled via ref so the game loop always sees the latest multiplier.
  const penaltyRef = useRef({ multiplier: 1, until: 0 } as { multiplier: number; until: number });
  const penaltyTimeoutRef = useRef<number | null>(null);

  const keysPressed = useRef<Set<string>>(new Set());
  const gameLoopRef = useRef<number | null>(null);
  const obstacleIdRef = useRef(0);
  
  const { playSound, startEngineLoop, stopEngineLoop } = useGameSounds();

  // Countdown with sounds
  useEffect(() => {
    if (countdown > 0) {
      playSound("countdown");
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !gameStarted) {
      playSound("go");
      setGameStarted(true);
      setStartTime(Date.now());
      startEngineLoop();
    }
  }, [countdown, gameStarted, playSound, startEngineLoop]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        keysPressed.current.add(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Collision detection - returns the obstacle that was hit (or null)
  const detectCollision = useCallback(
    (carXPos: number, obs: Obstacle[]) => {
      const carTop = TRACK_HEIGHT - CAR_HEIGHT - 30;
      const carBottom = TRACK_HEIGHT - 30;
      const carLeft = carXPos;
      const carRight = carXPos + CAR_WIDTH;

      for (const obstacle of obs) {
        const obsTop = obstacle.y;
        const obsBottom = obstacle.y + OBSTACLE_HEIGHT;
        const obsLeft = obstacle.x;
        const obsRight = obstacle.x + obstacle.width;

        if (
          carRight > obsLeft &&
          carLeft < obsRight &&
          carBottom > obsTop &&
          carTop < obsBottom
        ) {
          return obstacle;
        }
      }
      return null;
    },
    []
  );

  // Game loop
  useEffect(() => {
    if (!gameStarted) return;

    const baseSpeed = 8;
    const baseCarSpeed = 6;

    const gameLoop = () => {
      const now = Date.now();
      const activeMultiplier = penaltyRef.current.until > now ? penaltyRef.current.multiplier : 1;

      const effectiveSpeed = baseSpeed * activeMultiplier;
      const effectiveCarSpeed = baseCarSpeed * activeMultiplier;

      setDistance((prev) => {
        const newDistance = prev + effectiveSpeed;

        // Check for finish
        if (newDistance >= FINISH_DISTANCE) {
          const endTime = Date.now();
          const totalTime = endTime - (startTime || endTime);
          stopEngineLoop();
          playSound("finish");
          setTimeout(() => onGameEnd(totalTime), 100);
          return prev;
        }

        return newDistance;
      });

      // Update time display
      if (startTime) {
        setCurrentTime(Date.now() - startTime);
      }

      // Move car (slower when penalized)
      setCarX((prev) => {
        let newX = prev;
        if (keysPressed.current.has("ArrowLeft")) {
          newX = Math.max(15, prev - effectiveCarSpeed);
        }
        if (keysPressed.current.has("ArrowRight")) {
          newX = Math.min(TRACK_WIDTH - CAR_WIDTH - 15, prev + effectiveCarSpeed);
        }
        return newX;
      });

      // Generate obstacles and move them down
      setObstacles((prev) => {
        let updated = prev
          .map((obs) => ({ ...obs, y: obs.y + effectiveSpeed }))
          .filter((obs) => obs.y < TRACK_HEIGHT + 50);

        // Add new obstacle randomly
        if (Math.random() < 0.03 && updated.length < 5) {
          const width = 35 + Math.random() * 50;
          const types: Obstacle["type"][] = ["barrier", "cone", "oil"];
          updated.push({
            id: obstacleIdRef.current++,
            x: 25 + Math.random() * (TRACK_WIDTH - width - 50),
            y: -50,
            width,
            type: types[Math.floor(Math.random() * types.length)],
          });
        }

        return updated;
      });

      // Check collision and apply penalties
      setCarX((currentCarX) => {
        setObstacles((currentObs) => {
          const collided = detectCollision(currentCarX, currentObs);
          if (collided) {
            // Apply penalty based on obstacle type
            let multiplier = 0.6;
            let duration = 900;

            if (collided.type === "barrier") {
              multiplier = 0.4;
              duration = 1400;
            } else if (collided.type === "cone") {
              multiplier = 0.75;
              duration = 700;
            } else if (collided.type === "oil") {
              multiplier = 0.5;
              duration = 1100;
            }

            // Remove the obstacle so we don't re-collide
            const remaining = currentObs.filter((o) => o.id !== collided.id);

            // Apply penalty
            penaltyRef.current.multiplier = multiplier;
            penaltyRef.current.until = Date.now() + duration;
            if (penaltyTimeoutRef.current) {
              window.clearTimeout(penaltyTimeoutRef.current);
            }
            penaltyTimeoutRef.current = window.setTimeout(() => {
              penaltyRef.current.multiplier = 1;
              penaltyRef.current.until = 0;
              penaltyTimeoutRef.current = null;
            }, duration);

            // Collision visual & sound
            setCollision(true);
            playSound("collision");
            setTimeout(() => setCollision(false), 300);

            // Oil creates a small lateral slip
            if (collided.type === "oil") {
              const slip = (Math.random() - 0.5) * 40; // -20..20
              setCarX((x) => Math.max(15, Math.min(TRACK_WIDTH - CAR_WIDTH - 15, x + slip)));
            }

            return remaining;
          }

          return currentObs;
        });
        return currentCarX;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      stopEngineLoop();
      // clear any pending penalty timeout
      if (penaltyTimeoutRef.current) {
        window.clearTimeout(penaltyTimeoutRef.current);
        penaltyTimeoutRef.current = null;
      }
    };
  }, [gameStarted, startTime, detectCollision, onGameEnd, playSound, stopEngineLoop]);

  const progress = Math.min((distance / FINISH_DISTANCE) * 100, 100);

  const getObstacleStyle = (type: Obstacle["type"]) => {
    switch (type) {
      case "barrier":
        return "bg-gradient-to-b from-red-600 to-red-800 border-2 border-red-400";
      case "cone":
        return "bg-gradient-to-b from-orange-500 to-orange-700 rounded-t-full";
      case "oil":
        return "bg-gradient-to-b from-gray-700 to-gray-900 rounded-full opacity-80";
      default:
        return "bg-destructive";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md px-4">
        <div className="font-title text-2xl tracking-wider text-valorant uppercase">
          Player {player}
        </div>
        <div className="font-game text-xl text-foreground bg-secondary px-4 py-1 rounded">
          {(currentTime / 1000).toFixed(2)}s
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md h-3 bg-muted rounded overflow-hidden border border-border">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      <div className="text-sm text-muted-foreground font-game uppercase tracking-wide">
        {Math.floor(progress)}% Complete
      </div>

      {/* Track Container with Perspective */}
      <div className="track-perspective">
        <div
          className={`relative overflow-hidden border-2 ${
            collision ? "animate-shake" : ""
          } ${player === 1 ? "border-primary" : "border-foreground"}`}
          style={{
            width: TRACK_WIDTH,
            height: TRACK_HEIGHT,
            background: "linear-gradient(180deg, hsl(0 0% 8%) 0%, hsl(0 0% 4%) 100%)",
            boxShadow: player === 1 
              ? "0 0 30px hsl(0 85% 55% / 0.3), inset 0 0 60px hsl(0 0% 0% / 0.5)"
              : "0 0 30px hsl(0 0% 50% / 0.2), inset 0 0 60px hsl(0 0% 0% / 0.5)",
          }}
        >
          {/* Perspective road effect */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(180deg, 
                  transparent 0%, 
                  hsl(0 0% 6%) 20%, 
                  hsl(0 0% 10%) 50%,
                  hsl(0 0% 15%) 100%
                )
              `,
            }}
          />

          {/* Road lane markers - center dashed line */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 -translate-x-1/2 w-2 h-10 bg-foreground/40 rounded"
                style={{ 
                  top: `${(i * 35 + (distance % 35)) - 40}px`,
                }}
              />
            ))}
          </div>

          {/* Lane edge lines */}
          <div 
            className="absolute left-4 top-0 bottom-0 w-1 opacity-60"
            style={{ background: "linear-gradient(180deg, hsl(0 0% 30%), hsl(0 0% 50%))" }}
          />
          <div 
            className="absolute right-4 top-0 bottom-0 w-1 opacity-60"
            style={{ background: "linear-gradient(180deg, hsl(0 0% 30%), hsl(0 0% 50%))" }}
          />

          {/* Track edge glow */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-2"
            style={{ background: "linear-gradient(90deg, hsl(0 85% 55% / 0.3), transparent)" }}
          />
          <div 
            className="absolute right-0 top-0 bottom-0 w-2"
            style={{ background: "linear-gradient(270deg, hsl(0 85% 55% / 0.3), transparent)" }}
          />

          {/* Speed lines effect */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`speed-${i}`}
                className="absolute w-px h-24 bg-gradient-to-b from-transparent via-foreground to-transparent"
                style={{ 
                  left: `${10 + i * 12}%`,
                  top: `${(i * 60 + (distance * 2) % 200) - 100}px`,
                }}
              />
            ))}
          </div>

          {/* Countdown */}
          {countdown > 0 && (
            <motion.div
              key={countdown}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-20"
            >
              <span className="font-title text-8xl text-valorant">
                {countdown}
              </span>
            </motion.div>
          )}

          {countdown === 0 && !gameStarted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 flex items-center justify-center z-20"
            >
              <span className="font-title text-6xl text-valorant">GO!</span>
            </motion.div>
          )}

          {/* Obstacles */}
          {obstacles.map((obstacle) => (
            <motion.div
              key={obstacle.id}
              className={`absolute ${getObstacleStyle(obstacle.type)}`}
              style={{
                left: obstacle.x,
                top: obstacle.y,
                width: obstacle.width,
                height: OBSTACLE_HEIGHT,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
              }}
            />
          ))}

          {/* Car */}
          <motion.div
            className="absolute"
            style={{
              left: carX,
              bottom: 30,
              width: CAR_WIDTH,
              height: CAR_HEIGHT,
            }}
            animate={collision ? { x: [-3, 3, -3, 3, 0] } : {}}
            transition={{ duration: 0.2 }}
          >
            {/* Car body */}
            <div 
              className={`w-full h-full rounded-t-lg rounded-b-sm relative ${
                player === 1 
                  ? "bg-gradient-to-b from-red-500 via-red-600 to-red-800" 
                  : "bg-gradient-to-b from-gray-200 via-gray-300 to-gray-500"
              }`}
              style={{
                boxShadow: player === 1 
                  ? "0 0 20px hsl(0 85% 55% / 0.6), 0 4px 10px rgba(0,0,0,0.5)"
                  : "0 0 15px hsl(0 0% 80% / 0.4), 0 4px 10px rgba(0,0,0,0.5)",
              }}
            >
              {/* Windshield */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-7 h-5 bg-gradient-to-b from-blue-900 to-blue-950 rounded-sm" />
              
              {/* Hood accent */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-5 h-8 bg-black/20 rounded" />
              
              {/* Headlights */}
              <div className="absolute bottom-3 left-1 w-2 h-3 bg-yellow-300 rounded-full shadow-lg" 
                style={{ boxShadow: "0 0 8px hsl(60 100% 60%)" }}
              />
              <div className="absolute bottom-3 right-1 w-2 h-3 bg-yellow-300 rounded-full shadow-lg"
                style={{ boxShadow: "0 0 8px hsl(60 100% 60%)" }}
              />

              {/* Wheels */}
              <div className="absolute top-2 -left-1 w-3 h-5 bg-gray-900 rounded-sm" />
              <div className="absolute top-2 -right-1 w-3 h-5 bg-gray-900 rounded-sm" />
              <div className="absolute bottom-6 -left-1 w-3 h-5 bg-gray-900 rounded-sm" />
              <div className="absolute bottom-6 -right-1 w-3 h-5 bg-gray-900 rounded-sm" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="flex items-center gap-8 mt-4">
        <button
          className="w-16 h-16 bg-secondary hover:bg-secondary/80 active:bg-primary/30 border-2 border-primary/50 rounded-lg flex items-center justify-center text-3xl text-foreground transition-colors select-none touch-none"
          onPointerDown={() => keysPressed.current.add("ArrowLeft")}
          onPointerUp={() => keysPressed.current.delete("ArrowLeft")}
          onPointerLeave={() => keysPressed.current.delete("ArrowLeft")}
          onPointerCancel={() => keysPressed.current.delete("ArrowLeft")}
          aria-label="Steer Left"
        >
          ←
        </button>
        <button
          className="w-16 h-16 bg-secondary hover:bg-secondary/80 active:bg-primary/30 border-2 border-primary/50 rounded-lg flex items-center justify-center text-3xl text-foreground transition-colors select-none touch-none"
          onPointerDown={() => keysPressed.current.add("ArrowRight")}
          onPointerUp={() => keysPressed.current.delete("ArrowRight")}
          onPointerLeave={() => keysPressed.current.delete("ArrowRight")}
          onPointerCancel={() => keysPressed.current.delete("ArrowRight")}
          aria-label="Steer Right"
        >
          →
        </button>
      </div>

      <p className="text-sm text-muted-foreground font-game uppercase tracking-wide mt-2">
        ← → Arrow Keys or Tap Buttons
      </p>
    </motion.div>
  );
};

export default RaceTrack;
