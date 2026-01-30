import { motion } from "framer-motion";
import { Trophy, Medal, RotateCcw } from "lucide-react";

interface ScoreboardProps {
  player1Score: number;
  player2Score: number;
  onPlayAgain: () => void;
}

const Scoreboard = ({ player1Score, player2Score, onPlayAgain }: ScoreboardProps) => {
  const winner = player1Score < player2Score ? 1 : player1Score > player2Score ? 2 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-8"
    >
      {/* Trophy Animation */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
      >
        <Trophy className="w-20 h-20 mx-auto text-accent animate-float" />
      </motion.div>

      {/* Winner Announcement */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        {winner === 0 ? (
          <h2 className="font-pixel text-3xl neon-text-yellow">IT'S A TIE!</h2>
        ) : (
          <h2
            className={`font-pixel text-3xl ${
              winner === 1 ? "neon-text-cyan" : "neon-text-magenta"
            }`}
          >
            PLAYER {winner} WINS!
          </h2>
        )}
      </motion.div>

      {/* Score Cards */}
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
        {/* Player 1 Score */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className={`relative p-6 rounded-xl border-2 w-64 ${
            winner === 1
              ? "neon-box-cyan bg-primary/10"
              : "border-muted bg-card"
          }`}
        >
          {winner === 1 && (
            <Medal className="absolute -top-3 -right-3 w-8 h-8 text-accent" />
          )}
          <p className="font-game text-lg text-muted-foreground mb-2">
            Player 1
          </p>
          <p
            className={`font-pixel text-2xl ${
              winner === 1 ? "neon-text-cyan" : "text-foreground"
            }`}
          >
            {(player1Score / 1000).toFixed(2)}s
          </p>
        </motion.div>

        {/* Player 2 Score */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className={`relative p-6 rounded-xl border-2 w-64 ${
            winner === 2
              ? "neon-box-magenta bg-secondary/10"
              : "border-muted bg-card"
          }`}
        >
          {winner === 2 && (
            <Medal className="absolute -top-3 -right-3 w-8 h-8 text-accent" />
          )}
          <p className="font-game text-lg text-muted-foreground mb-2">
            Player 2
          </p>
          <p
            className={`font-pixel text-2xl ${
              winner === 2 ? "neon-text-magenta" : "text-foreground"
            }`}
          >
            {(player2Score / 1000).toFixed(2)}s
          </p>
        </motion.div>
      </div>

      {/* Time Difference */}
      {winner !== 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-muted-foreground font-game"
        >
          Winner by{" "}
          <span className="text-accent">
            {Math.abs((player1Score - player2Score) / 1000).toFixed(2)}s
          </span>
        </motion.p>
      )}

      {/* Play Again Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        onClick={onPlayAgain}
        className="mx-auto flex items-center gap-3 px-8 py-4 rounded-xl font-game text-lg bg-accent/20 border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <RotateCcw className="w-5 h-5" />
        PLAY AGAIN
      </motion.button>
    </motion.div>
  );
};

export default Scoreboard;
