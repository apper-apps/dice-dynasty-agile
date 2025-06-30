import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const PlayerSetup = ({ onStartGame }) => {
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState([
    { Id: 1, name: 'Player 1', color: '#6366F1', colorName: 'Blue', isAI: false, difficulty: 'none' },
    { Id: 2, name: 'Player 2', color: '#EC4899', colorName: 'Pink', isAI: false, difficulty: 'none' }
  ]);

  const availableColors = [
    { color: '#6366F1', name: 'Blue' },
    { color: '#EC4899', name: 'Pink' },
    { color: '#10B981', name: 'Green' },
    { color: '#F59E0B', name: 'Yellow' }
  ];

  const aiDifficulties = [
    { value: 'easy', label: 'Easy', description: 'Makes random moves' },
    { value: 'medium', label: 'Medium', description: 'Balanced strategy' },
    { value: 'hard', label: 'Hard', description: 'Aggressive play' }
  ];

  const updatePlayerCount = (count) => {
    setPlayerCount(count);
    const newPlayers = [...players];
    
    if (count > players.length) {
      // Add new players
      for (let i = players.length; i < count; i++) {
        newPlayers.push({
          Id: i + 1,
          name: `Player ${i + 1}`,
          color: availableColors[i].color,
          colorName: availableColors[i].name,
          isAI: i > 1, // Make 3rd and 4th players AI by default
          difficulty: 'medium'
        });
      }
    } else {
      // Remove excess players
      newPlayers.splice(count);
    }
    
    setPlayers(newPlayers);
  };

  const updatePlayer = (index, field, value) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setPlayers(newPlayers);
  };

  const handleStartGame = () => {
    onStartGame(players);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background flex items-center justify-center p-4">
      <motion.div
        className="max-w-4xl w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card variant="gradient" className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1 
              className="text-5xl font-righteous gradient-text mb-4"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Dice Dynasty
            </motion.h1>
            <p className="text-gray-300 text-lg">
              Set up your game and choose your champions
            </p>
          </div>

          {/* Player Count Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <ApperIcon name="Users" size={24} className="mr-2 text-accent" />
              Number of Players
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[2, 3, 4].map((count) => (
                <motion.button
                  key={count}
                  onClick={() => updatePlayerCount(count)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    playerCount === count
                      ? 'border-primary bg-primary bg-opacity-20 text-primary'
                      : 'border-gray-600 hover:border-gray-500 text-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-2xl font-bold mb-1">{count}</div>
                  <div className="text-sm">Players</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Player Configuration */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <ApperIcon name="Settings" size={24} className="mr-2 text-accent" />
              Player Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {players.map((player, index) => (
                <motion.div
                  key={player.Id}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Player header */}
                  <div className="flex items-center mb-4">
                    <div 
                      className="w-8 h-8 rounded-full mr-3 shadow-lg"
                      style={{ backgroundColor: player.color }}
                    />
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                      className="bg-gray-700 text-white px-3 py-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={`Player ${index + 1}`}
                    />
                  </div>

                  {/* Player type toggle */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Player Type</span>
                      <motion.button
                        onClick={() => updatePlayer(index, 'isAI', !player.isAI)}
                        className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                          player.isAI ? 'bg-accent' : 'bg-gray-600'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                          animate={{
                            x: player.isAI ? 32 : 4
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      </motion.button>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {player.isAI ? 'AI Player' : 'Human Player'}
                    </div>
                  </div>

                  {/* AI Difficulty */}
                  {player.isAI && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-gray-300 mb-2">
                        AI Difficulty
                      </label>
                      <select
                        value={player.difficulty}
                        onChange={(e) => updatePlayer(index, 'difficulty', e.target.value)}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {aiDifficulties.map((diff) => (
                          <option key={diff.value} value={diff.value}>
                            {diff.label} - {diff.description}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Start Game Button */}
          <div className="text-center">
            <Button
              size="xl"
              icon="Play"
              onClick={handleStartGame}
              className="bg-gradient-to-r from-primary via-secondary to-accent text-white font-bold text-xl px-12 py-4"
            >
              Start Game
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default PlayerSetup;