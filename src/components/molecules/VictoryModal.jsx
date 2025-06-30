import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const VictoryModal = ({ winner, onNewGame, onMainMenu, isVisible }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (isVisible) {
      // Generate confetti pieces
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        color: ['#6366F1', '#EC4899', '#F59E0B', '#10B981'][Math.floor(Math.random() * 4)],
        rotation: Math.random() * 360,
        delay: Math.random() * 2
      }));
      setConfetti(pieces);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center victory-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Confetti */}
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-3 h-3 confetti"
          style={{
            backgroundColor: piece.color,
            left: piece.x,
            top: piece.y,
          }}
          animate={{
            y: window.innerHeight + 100,
            rotate: piece.rotation + 720,
            x: piece.x + (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: piece.delay,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Modal Content */}
      <motion.div
        className="bg-gradient-to-br from-surface to-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-600 max-w-md w-full mx-4"
        initial={{ scale: 0.7, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          delay: 0.2 
        }}
      >
        {/* Trophy Animation */}
        <motion.div
          className="text-center mb-6"
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        >
          <div className="relative inline-block">
            <ApperIcon 
              name="Trophy" 
              size={80} 
              className="text-accent mx-auto drop-shadow-2xl" 
            />
            
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 30px rgba(245, 158, 11, 0.5)',
                  '0 0 50px rgba(245, 158, 11, 0.8)',
                  '0 0 30px rgba(245, 158, 11, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Victory Text */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-4xl font-righteous gradient-text mb-4">
            Victory!
          </h2>
          
          <motion.div
            className="p-4 rounded-xl border-2 mb-4"
            style={{ 
              borderColor: winner?.color,
              backgroundColor: `${winner?.color}20`
            }}
            animate={{
              boxShadow: [
                `0 0 20px ${winner?.color}40`,
                `0 0 40px ${winner?.color}60`,
                `0 0 20px ${winner?.color}40`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center justify-center">
              <div 
                className="w-8 h-8 rounded-full mr-3 shadow-lg"
                style={{ backgroundColor: winner?.color }}
              />
              <div>
                <div className="text-xl font-bold text-white">
                  {winner?.name}
                </div>
                <div className="text-gray-300">
                  {winner?.isAI ? `AI Player (${winner.difficulty})` : 'Human Player'}
                </div>
              </div>
            </div>
          </motion.div>

          <p className="text-gray-300 text-lg">
            Congratulations! All pieces have reached home safely.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            icon="RotateCcw"
            onClick={onNewGame}
            className="w-full bg-gradient-to-r from-primary to-secondary"
            size="lg"
          >
            Play Again
          </Button>
          
          <Button
            variant="outline"
            icon="Home"
            onClick={onMainMenu}
            className="w-full"
          >
            Main Menu
          </Button>
        </motion.div>

        {/* Celebration particles */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-accent rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 3,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default VictoryModal;