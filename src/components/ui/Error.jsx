import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-surface to-background p-8">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Error icon */}
        <motion.div
          className="mx-auto w-24 h-24 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center mb-6 shadow-2xl"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, -5, 5, 0] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <ApperIcon name="AlertTriangle" size={40} className="text-white" />
        </motion.div>

        {/* Error message */}
        <h2 className="text-3xl font-righteous text-white mb-4">
          Oops! Game Error
        </h2>
        
        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          {message}
        </p>

        {/* Retry button */}
        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="group bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-xl text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name="RotateCcw" size={20} />
              <span>Try Again</span>
            </div>
          </motion.button>
        )}

        {/* Background decoration */}
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent rounded-full blur-3xl" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Error;