import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "No Game Active", 
  message = "Start a new game to begin playing!", 
  actionText = "Start Game",
  onAction 
}) => {
return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-surface to-background p-8">
      <motion.div
        className="text-center max-w-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Animated game pieces */}
        <div className="relative mb-8">
<motion.div
            className="w-32 h-32 mx-auto bg-gradient-to-br from-primary via-secondary to-accent rounded-full shadow-ludo-lg border-4 border-white"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1] 
            }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
<div className="absolute inset-4 bg-cardBg rounded-full flex items-center justify-center border-2 border-gray-200">
              <ApperIcon name="Gamepad2" size={48} className="text-warning" />
            </div>
          </motion.div>

          {/* Floating dice */}
          {[...Array(4)].map((_, index) => (
<motion.div
              key={index}
              className="absolute w-8 h-8 bg-white rounded-lg shadow-ludo border-2 border-warning"
              style={{
                top: `${20 + index * 10}%`,
                left: `${20 + index * 15}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                delay: index * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
<div className="w-full h-full flex items-center justify-center text-gray-800 font-bold text-xs">
                ⚂
              </div>
            </motion.div>
          ))}
        </div>

{/* Empty state text */}
        <h2 className="text-4xl font-fredoka gradient-text mb-4 drop-shadow-lg">
          {title}
        </h2>
<p className="text-gray-700 text-lg mb-8 leading-relaxed font-medium">
          {message}
        </p>

        {/* Action button */}
        {onAction && (
          <motion.button
onClick={onAction}
            className="group bg-gradient-to-r from-primary via-secondary to-accent px-12 py-4 rounded-2xl text-white font-bold text-xl shadow-ludo-lg hover:shadow-2xl transition-all duration-300 border-2 border-white"
            whileHover={{ 
              scale: 1.05, 
              y: -3,
              boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-3">
              <ApperIcon name="Play" size={24} />
              <span>{actionText}</span>
            </div>
          </motion.button>
        )}

        {/* Background decoration */}
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary rounded-full blur-3xl" />
          <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-accent rounded-full blur-3xl" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Empty;