import { motion } from "framer-motion";

const GameTitle = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center mb-8"
    >
      <h1 className="font-pixel text-4xl md:text-6xl neon-text-cyan mb-4 tracking-wider">
        NEON
      </h1>
      <h2 className="font-pixel text-3xl md:text-5xl neon-text-magenta tracking-widest">
        RACER
      </h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-lg text-muted-foreground font-game"
      >
        Two Player Racing Challenge
      </motion.p>
    </motion.div>
  );
};

export default GameTitle;
