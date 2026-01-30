import { useState } from "react";
import { motion } from "framer-motion";
import GameTitle from "@/components/game/GameTitle";
import PlayerSelect from "@/components/game/PlayerSelect";
import RaceTrack from "@/components/game/RaceTrack";
import Scoreboard from "@/components/game/Scoreboard";

type GameState = "select" | "playing" | "results";

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("select");
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [player1Score, setPlayer1Score] = useState<number | null>(null);
  const [player2Score, setPlayer2Score] = useState<number | null>(null);

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
    setGameState("select");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
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
            onStartGame={handleStartGame}
          />
        )}

        {gameState === "playing" && (
          <RaceTrack player={currentPlayer} onGameEnd={handleGameEnd} />
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
