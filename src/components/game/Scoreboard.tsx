import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, Medal } from "lucide-react";

interface ScoreboardProps {
  player1Score: number;
  player2Score: number;
  onPlayAgain: () => void;
}

const Scoreboard = ({
  player1Score,
  player2Score,
  onPlayAgain,
}: ScoreboardProps) => {
  const winner = player1Score < player2Score ? 1 : player2Score < player1Score ? 2 : 0;
  const difference = Math.abs(player1Score - player2Score) / 1000;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-8"
    >
      {/* Winner announcement */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-center"
      >
        {winner !== 0 ? (
          <>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex justify-center mb-4"
            >
              <Trophy className="w-16 h-16 text-primary" />
            </motion.div>
            <h2 className="font-title text-5xl text-valorant tracking-wider uppercase">
              Player {winner} Wins!
            </h2>
            <p className="mt-2 text-muted-foreground font-game uppercase">
              By {difference.toFixed(2)} seconds
            </p>
          </>
        ) : (
          <>
            <Medal className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="font-title text-5xl text-foreground tracking-wider uppercase">
              It's a Tie!
            </h2>
            <p className="mt-2 text-muted-foreground font-game uppercase">
              Both finished in {(player1Score / 1000).toFixed(2)}s
            </p>
          </>
        )}
      </motion.div>

      {/* Score comparison */}
      <div className="flex gap-6">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`px-8 py-6 rounded border-2 text-center relative ${
            winner === 1
              ? "border-primary bg-primary/10"
              : "border-border bg-card"
          }`}
        >
          {winner === 1 ? (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-game uppercase rounded">
              Winner
            </div>
          ) : winner === 0 ? (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-muted text-muted-foreground text-xs font-game uppercase rounded">
              Tie
            </div>
          ) : null}
          <p className="text-sm text-muted-foreground font-game uppercase">
            Player 1
          </p>
          <p className={`text-4xl font-title ${winner === 1 ? "text-primary" : "text-foreground"}`}>
            {(player1Score / 1000).toFixed(2)}s
          </p>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`px-8 py-6 rounded border-2 text-center relative ${
            winner === 2
              ? "border-primary bg-primary/10"
              : "border-border bg-card"
          }`}
        >
          {winner === 2 ? (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-game uppercase rounded">
              Winner
            </div>
          ) : winner === 0 ? (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-muted text-muted-foreground text-xs font-game uppercase rounded">
              Tie
            </div>
          ) : null}
          <p className="text-sm text-muted-foreground font-game uppercase">
            Player 2
          </p>
          <p className={`text-4xl font-title ${winner === 2 ? "text-primary" : "text-foreground"}`}>
            {(player2Score / 1000).toFixed(2)}s
          </p>
        </motion.div>
      </div>

      {/* Play again button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={onPlayAgain}
          size="lg"
          className="font-title text-2xl px-12 py-8 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground uppercase tracking-wider"
          style={{
            boxShadow: "0 0 30px hsl(0 85% 55% / 0.4)",
          }}
        >
          Race Again
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Scoreboard;
