import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PlayerSelectProps {
  currentPlayer: 1 | 2;
  player1Score: number | null;
  player2Score: number | null;
  trackLength: 50 | 100;
  onTrackLengthChange?: (length: 50 | 100) => void;
  onStartGame: () => void;
}

const PlayerSelect = ({
  currentPlayer,
  player1Score,
  player2Score,
  trackLength,
  onTrackLengthChange,
  onStartGame,
}: PlayerSelectProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-8"
    >
      {/* Player indicator */}
      <div className="text-center">
        <motion.div
          key={currentPlayer}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative inline-block"
        >
          <h3 className="font-title text-5xl text-valorant tracking-wider uppercase">
            Player {currentPlayer}
          </h3>
          <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary" />
        </motion.div>
        <p className="mt-4 text-muted-foreground font-game uppercase tracking-wide">
          Get Ready to Race
        </p>

        {/* Track Length Selection */}
        <div className="mt-4">
          <p className="text-sm text-muted-foreground font-game uppercase tracking-wide mb-3">
            Select Track Length
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onTrackLengthChange?.(50)}
              disabled={!onTrackLengthChange}
              className={`px-6 py-3 rounded border-2 font-title text-lg uppercase tracking-wider transition-all ${
                trackLength === 50
                  ? "border-primary bg-primary/20 text-primary shadow-lg"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50"
              } ${!onTrackLengthChange ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              style={trackLength === 50 ? { boxShadow: "0 0 15px hsl(0 85% 55% / 0.3)" } : {}}
            >
              50 Meter
            </button>
            <button
              onClick={() => onTrackLengthChange?.(100)}
              disabled={!onTrackLengthChange}
              className={`px-6 py-3 rounded border-2 font-title text-lg uppercase tracking-wider transition-all ${
                trackLength === 100
                  ? "border-primary bg-primary/20 text-primary shadow-lg"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50"
              } ${!onTrackLengthChange ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              style={trackLength === 100 ? { boxShadow: "0 0 15px hsl(0 85% 55% / 0.3)" } : {}}
            >
              100 Meter
            </button>
          </div>
          {!onTrackLengthChange && (
            <p className="text-xs text-muted-foreground/60 font-game mt-2">
              Track length set by Player 1: {trackLength}m
            </p>
          )}
        </div>
      </div>

      {/* Scores display */}
      <div className="flex gap-8">
        <div
          className={`px-6 py-4 rounded border-2 transition-all ${
            currentPlayer === 1
              ? "border-primary bg-primary/10"
              : "border-border bg-card"
          }`}
        >
          <p className="text-sm text-muted-foreground font-game uppercase">Player 1</p>
          <p className="text-2xl font-title text-foreground">
            {player1Score !== null
              ? `${(player1Score / 1000).toFixed(2)}s`
              : "---"}
          </p>
        </div>
        <div
          className={`px-6 py-4 rounded border-2 transition-all ${
            currentPlayer === 2
              ? "border-primary bg-primary/10"
              : "border-border bg-card"
          }`}
        >
          <p className="text-sm text-muted-foreground font-game uppercase">Player 2</p>
          <p className="text-2xl font-title text-foreground">
            {player2Score !== null
              ? `${(player2Score / 1000).toFixed(2)}s`
              : "---"}
          </p>
        </div>
      </div>

      {/* Start button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={onStartGame}
          size="lg"
          className="font-title text-2xl px-12 py-8 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground uppercase tracking-wider border-0"
          style={{
            boxShadow: "0 0 30px hsl(0 85% 55% / 0.4)",
          }}
        >
          Start Race
        </Button>
      </motion.div>

      {/* Instructions */}
      <div className="text-center text-muted-foreground font-game text-sm uppercase tracking-wide">
        <p>Use ← → arrow keys to steer</p>
        <p className="mt-1">Avoid obstacles • Reach the finish line</p>
      </div>
    </motion.div>
  );
};

export default PlayerSelect;
