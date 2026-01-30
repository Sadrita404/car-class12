import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface RaceTrackProps {
  player: 1 | 2;
  onGameEnd: (time: number) => void;
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
}

const TRACK_WIDTH = 300;
const TRACK_HEIGHT = 500;
const CAR_WIDTH = 40;
const CAR_HEIGHT = 60;
const OBSTACLE_HEIGHT = 40;
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

  const keysPressed = useRef<Set<string>>(new Set());
  const gameLoopRef = useRef<number | null>(null);
  const obstacleIdRef = useRef(0);

  // Countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }
  }, [countdown, gameStarted]);

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

  // Collision detection
  const checkCollision = useCallback(
    (carXPos: number, obs: Obstacle[]) => {
      const carTop = TRACK_HEIGHT - CAR_HEIGHT - 20;
      const carBottom = TRACK_HEIGHT - 20;
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
          return true;
        }
      }
      return false;
    },
    []
  );

  // Game loop
  useEffect(() => {
    if (!gameStarted) return;

    const speed = 8;
    const carSpeed = 6;

    const gameLoop = () => {
      setDistance((prev) => {
        const newDistance = prev + speed;

        // Check for finish
        if (newDistance >= FINISH_DISTANCE) {
          const endTime = Date.now();
          const totalTime = endTime - (startTime || endTime);
          setTimeout(() => onGameEnd(totalTime), 100);
          return prev;
        }

        return newDistance;
      });

      // Update time display
      if (startTime) {
        setCurrentTime(Date.now() - startTime);
      }

      // Move car
      setCarX((prev) => {
        let newX = prev;
        if (keysPressed.current.has("ArrowLeft")) {
          newX = Math.max(10, prev - carSpeed);
        }
        if (keysPressed.current.has("ArrowRight")) {
          newX = Math.min(TRACK_WIDTH - CAR_WIDTH - 10, prev + carSpeed);
        }
        return newX;
      });

      // Generate obstacles
      setObstacles((prev) => {
        let updated = prev
          .map((obs) => ({ ...obs, y: obs.y + speed }))
          .filter((obs) => obs.y < TRACK_HEIGHT + 50);

        // Add new obstacle randomly
        if (Math.random() < 0.03 && updated.length < 5) {
          const width = 40 + Math.random() * 60;
          updated.push({
            id: obstacleIdRef.current++,
            x: 20 + Math.random() * (TRACK_WIDTH - width - 40),
            y: -50,
            width,
          });
        }

        return updated;
      });

      // Check collision
      setCarX((currentCarX) => {
        setObstacles((currentObs) => {
          if (checkCollision(currentCarX, currentObs)) {
            setCollision(true);
            setTimeout(() => setCollision(false), 300);
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
    };
  }, [gameStarted, startTime, checkCollision, onGameEnd]);

  const progress = Math.min((distance / FINISH_DISTANCE) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md px-4">
        <div
          className={`font-game text-lg ${
            player === 1 ? "neon-text-cyan" : "neon-text-magenta"
          }`}
        >
          PLAYER {player}
        </div>
        <div className="font-game text-accent">
          {(currentTime / 1000).toFixed(2)}s
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md h-4 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${player === 1 ? "bg-primary" : "bg-secondary"}`}
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      <div className="text-sm text-muted-foreground font-game">
        {Math.floor(progress)}% to finish
      </div>

      {/* Track */}
      <div
        className={`relative overflow-hidden rounded-xl border-4 ${
          collision ? "animate-shake" : ""
        } ${player === 1 ? "border-primary" : "border-secondary"}`}
        style={{
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          background: "linear-gradient(180deg, hsl(240 20% 4%), hsl(240 20% 8%))",
        }}
      >
        {/* Road lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 -translate-x-1/2 w-1 h-8 bg-track-line opacity-50"
              style={{ top: `${(i * 40 + (distance % 40)) - 40}px` }}
            />
          ))}
        </div>

        {/* Side lines */}
        <div className="absolute left-2 top-0 bottom-0 w-1 bg-track-line opacity-70" />
        <div className="absolute right-2 top-0 bottom-0 w-1 bg-track-line opacity-70" />

        {/* Countdown */}
        {countdown > 0 && (
          <motion.div
            key={countdown}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="font-pixel text-6xl neon-text-yellow">
              {countdown}
            </span>
          </motion.div>
        )}

        {countdown === 0 && !gameStarted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="font-pixel text-3xl neon-text-cyan">GO!</span>
          </motion.div>
        )}

        {/* Obstacles */}
        {obstacles.map((obstacle) => (
          <motion.div
            key={obstacle.id}
            className="absolute bg-destructive rounded-lg"
            style={{
              left: obstacle.x,
              top: obstacle.y,
              width: obstacle.width,
              height: OBSTACLE_HEIGHT,
              boxShadow: "0 0 10px hsl(0 84% 60% / 0.5)",
            }}
          />
        ))}

        {/* Car */}
        <motion.div
          className={`absolute rounded-lg ${
            player === 1 ? "bg-primary neon-box-cyan" : "bg-secondary neon-box-magenta"
          }`}
          style={{
            left: carX,
            bottom: 20,
            width: CAR_WIDTH,
            height: CAR_HEIGHT,
          }}
          animate={collision ? { x: [-2, 2, -2, 2, 0] } : {}}
          transition={{ duration: 0.2 }}
        >
          {/* Car details */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-3 bg-background/30 rounded-sm" />
          <div className="absolute bottom-3 left-1 w-2 h-2 bg-accent rounded-full" />
          <div className="absolute bottom-3 right-1 w-2 h-2 bg-accent rounded-full" />
        </motion.div>
      </div>

      <p className="text-sm text-muted-foreground font-game">
        ← → to steer
      </p>
    </motion.div>
  );
};

export default RaceTrack;
