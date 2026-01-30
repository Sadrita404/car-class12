import { motion } from "framer-motion";

const GameTitle = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center mb-8"
    >
      <div className="relative inline-block">
        <h1 className="font-title text-6xl md:text-8xl text-valorant tracking-widest">
          VELOCITY
        </h1>
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>
      <h2 className="font-title text-4xl md:text-6xl text-foreground tracking-[0.3em] mt-2">
        RUSH
      </h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-lg text-muted-foreground font-game uppercase tracking-wide"
      >
        Two Player Racing Challenge
      </motion.p>
    </motion.div>
  );
};

export default GameTitle;
