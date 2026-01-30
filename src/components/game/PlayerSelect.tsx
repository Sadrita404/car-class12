import { motion } from "framer-motion";
import { User, Trophy } from "lucide-react";

interface PlayerSelectProps {
  currentPlayer: 1 | 2;
  player1Score: number | null;
  player2Score: number | null;
  onStartGame: () => void;
}

const PlayerSelect = ({
  currentPlayer,
  player1Score,
  player2Score,
  onStartGame,
}: PlayerSelectProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Player Cards */}
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
        {/* Player 1 */}
        <motion.div
          className={`relative p-6 rounded-xl border-2 w-64 transition-all duration-300 ${
            currentPlayer === 1
              ? "neon-box-cyan bg-card"
              : "border-muted bg-muted/20"
          }`}
          whileHover={{ scale: currentPlayer === 1 ? 1.05 : 1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-3 rounded-full ${
                currentPlayer === 1 ? "bg-primary/20" : "bg-muted"
              }`}
            >
              <User
                className={`w-6 h-6 ${
                  currentPlayer === 1 ? "text-primary" : "text-muted-foreground"
                }`}
              />
            </div>
            <span
              className={`font-game text-xl ${
                currentPlayer === 1 ? "neon-text-cyan" : "text-muted-foreground"
              }`}
            >
              Player 1
            </span>
          </div>

          {player1Score !== null ? (
            <div className="flex items-center gap-2 mt-4">
              <Trophy className="w-5 h-5 text-accent" />
              <span className="font-game text-accent">
                {(player1Score / 1000).toFixed(2)}s
              </span>
            </div>
          ) : currentPlayer === 1 ? (
            <span className="text-sm text-primary animate-pulse-neon">
              Ready to race!
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">Waiting...</span>
          )}

          {currentPlayer === 1 && (
            <motion.div
              className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* VS Divider */}
        <div className="font-pixel text-2xl neon-text-yellow">VS</div>

        {/* Player 2 */}
        <motion.div
          className={`relative p-6 rounded-xl border-2 w-64 transition-all duration-300 ${
            currentPlayer === 2
              ? "neon-box-magenta bg-card"
              : "border-muted bg-muted/20"
          }`}
          whileHover={{ scale: currentPlayer === 2 ? 1.05 : 1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-3 rounded-full ${
                currentPlayer === 2 ? "bg-secondary/20" : "bg-muted"
              }`}
            >
              <User
                className={`w-6 h-6 ${
                  currentPlayer === 2
                    ? "text-secondary"
                    : "text-muted-foreground"
                }`}
              />
            </div>
            <span
              className={`font-game text-xl ${
                currentPlayer === 2
                  ? "neon-text-magenta"
                  : "text-muted-foreground"
              }`}
            >
              Player 2
            </span>
          </div>

          {player2Score !== null ? (
            <div className="flex items-center gap-2 mt-4">
              <Trophy className="w-5 h-5 text-accent" />
              <span className="font-game text-accent">
                {(player2Score / 1000).toFixed(2)}s
              </span>
            </div>
          ) : currentPlayer === 2 ? (
            <span className="text-sm text-secondary animate-pulse-neon">
              Ready to race!
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">Waiting...</span>
          )}

          {currentPlayer === 2 && (
            <motion.div
              className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-secondary"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.div>
      </div>

      {/* Start Button */}
      <motion.button
        onClick={onStartGame}
        className={`mx-auto block px-10 py-4 rounded-xl font-game text-xl transition-all duration-300 border-2 ${
          currentPlayer === 1
            ? "bg-primary/20 border-primary text-primary hover:bg-primary hover:text-primary-foreground neon-box-cyan"
            : "bg-secondary/20 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground neon-box-magenta"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        START PLAYER {currentPlayer}
      </motion.button>

      <p className="text-center text-muted-foreground text-sm font-game">
        Use ← → Arrow Keys to steer • Avoid obstacles • Reach the finish line!
      </p>
    </motion.div>
  );
};

export default PlayerSelect;
