import { motion } from 'framer-motion';

const Loading = ({ message = "Loading game..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-surface to-background">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated dice loading */}
        <div className="flex space-x-2 mb-8">
          {[1, 2, 3].map((dice, index) => (
            <motion.div
              key={dice}
              className="w-12 h-12 bg-gradient-to-br from-accent to-warning rounded-lg shadow-lg"
              animate={{
                rotateX: [0, 360],
                rotateY: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                delay: index * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                {dice}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Loading text */}
        <motion.h2
          className="text-2xl font-righteous text-center gradient-text mb-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.h2>

        {/* Loading bar */}
        <div className="w-64 h-2 bg-surface rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
            animate={{ x: [-256, 256] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Loading;