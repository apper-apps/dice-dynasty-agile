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
              className="w-12 h-12 bg-white rounded-lg shadow-ludo border-2 border-gray-300"
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
<div className="w-full h-full flex items-center justify-center text-gray-800 font-bold text-lg">
                {dice}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Loading text */}
<motion.h2
          className="text-2xl font-fredoka text-center gradient-text mb-4 drop-shadow-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.h2>

{/* Loading bar */}
        <div className="w-64 h-3 bg-cardBg rounded-full overflow-hidden border border-gray-300">
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