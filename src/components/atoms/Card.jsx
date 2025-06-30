import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  ...props 
}) => {
  const baseClasses = "rounded-2xl shadow-lg transition-all duration-300";
  
  const variants = {
    default: "bg-surface border border-gray-700",
    gradient: "bg-gradient-to-br from-surface to-gray-800 border border-gray-600",
    glass: "bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20",
    primary: "bg-gradient-to-br from-primary to-secondary text-white",
    accent: "bg-gradient-to-br from-accent to-warning text-white"
  };

  const hoverClasses = hover ? "hover:shadow-xl hover:scale-105" : "";
  
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