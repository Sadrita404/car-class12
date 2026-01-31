import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import GameTitle from "@/components/game/GameTitle";
import PlayerSelect from "@/components/game/PlayerSelect";
import RaceTrack from "@/components/game/RaceTrack";
import Scoreboard from "@/components/game/Scoreboard";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

type GameState = "select" | "playing" | "results";

const Index = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>("select");
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [player1Score, setPlayer1Score] = useState<number | null>(null);
  const [player2Score, setPlayer2Score] = useState<number | null>(null);
  const [trackLength, setTrackLength] = useState<50 | 100>(50);

  const handleStartGame = () => {
    setGameState("playing");
  };

  const handleGameEnd = (time: number) => {
    if (currentPlayer === 1) {
      setPlayer1Score(time);
      setCurrentPlayer(2);
      setGameState("select");
    } else {
      setPlayer2Score(time);
      setGameState("results");
    }
  };

  const handlePlayAgain = () => {
    setPlayer1Score(null);
    setPlayer2Score(null);
    setCurrentPlayer(1);
    setTrackLength(50);
    setGameState("select");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden">
      <ThemeToggle />
      
      {/* About Button - Fixed Left Side */}
      <motion.div
        className="fixed left-4 top-1/2 -translate-y-1/2 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={() => navigate("/about")}
          variant="outline"
          className="flex flex-col items-center gap-2 py-4 px-3 h-auto border-2 border-primary/50 bg-card/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all shadow-lg"
          style={{ boxShadow: "0 4px 20px hsl(0 85% 55% / 0.3)" }}
        >
          <Info className="h-6 w-6" />
          <span className="text-sm font-bold writing-mode-vertical" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
            ABOUT
          </span>
        </Button>
      </motion.div>
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        {/* Geometric accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/20" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-primary/20" />
        
        {/* Subtle red glow */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <GameTitle />

        {gameState === "select" && (
          <PlayerSelect
            currentPlayer={currentPlayer}
            player1Score={player1Score}
            player2Score={player2Score}
            trackLength={trackLength}
            onTrackLengthChange={currentPlayer === 1 ? setTrackLength : undefined}
            onStartGame={handleStartGame}
          />
        )}

        {gameState === "playing" && (
          <RaceTrack player={currentPlayer} trackLength={trackLength} onGameEnd={handleGameEnd} />
        )}

        {gameState === "results" && player1Score !== null && player2Score !== null && (
          <Scoreboard
            player1Score={player1Score}
            player2Score={player2Score}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Index;
