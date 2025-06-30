import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  ...props 
}) => {
const baseClasses = "rounded-2xl shadow-ludo transition-all duration-300 border-2";
  
  const variants = {
    default: "bg-cardBg border-gray-300",
    gradient: "bg-gradient-to-br from-cardBg to-surface border-warning",
    glass: "bg-cardBg bg-opacity-90 backdrop-blur-lg border-white border-opacity-60",
    primary: "bg-gradient-to-br from-primary to-ludoRed text-white border-white",
    accent: "bg-gradient-to-br from-accent to-ludoGreen text-white border-white",
    ludo: "bg-cardBg border-warning shadow-ludo-lg"
  };

  const hoverClasses = hover ? "hover:shadow-ludo-lg hover:scale-105 hover:border-opacity-80" : "";
  
  const classes = `${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`;

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;