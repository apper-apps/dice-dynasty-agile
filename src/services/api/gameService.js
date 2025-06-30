import gameData from '../mockData/gameData.json';

class GameService {
  constructor() {
    this.gameState = this.getInitialGameState();
  }

  // Initialize new game state
  getInitialGameState() {
    return {
      Id: 1,
      players: [],
      currentPlayerIndex: 0,
      diceValue: 0,
      isRolling: false,
      gameStatus: 'setup', // setup, playing, finished
      turnCount: 0,
      winner: null,
      pieces: {},
      boardPositions: Array(72).fill(null),
      lastMove: null
    };
  }

  // Setup new game with selected players
  async setupGame(playerConfigs) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const players = playerConfigs.map((config, index) => ({
          ...gameData.players[index],
          ...config,
          pieces: this.initializePieces(index + 1)
        }));

        this.gameState = {
          ...this.getInitialGameState(),
          players,
          gameStatus: 'playing',
          pieces: this.createPiecesMap(players)
        };

        resolve(this.gameState);
      }, 300);
    });
  }

  // Initialize pieces for a player
  initializePieces(playerId) {
    const playerData = gameData.players[playerId - 1];
    return playerData.homePositions.map((pos, index) => ({
      Id: `${playerId}-${index + 1}`,
      playerId,
      position: -1, // -1 means in home base
      boardPosition: pos,
      isHome: false,
      isSafe: false,
      canMove: false
    }));
  }

  // Create pieces map for quick lookup
  createPiecesMap(players) {
    const piecesMap = {};
    players.forEach(player => {
      player.pieces.forEach(piece => {
        piecesMap[piece.Id] = piece;
      });
    });
    return piecesMap;
  }

  // Roll dice
  async rollDice() {
    return new Promise((resolve) => {
      this.gameState.isRolling = true;
      
      // Simulate dice roll animation time
      setTimeout(() => {
        const diceValue = Math.floor(Math.random() * 6) + 1;
        this.gameState.diceValue = diceValue;
        this.gameState.isRolling = false;
        
        // Update movable pieces
        this.updateMovablePieces(diceValue);
        
        resolve({
          diceValue,
          gameState: this.gameState
        });
      }, 800);
    });
  }

  // Update which pieces can move
  updateMovablePieces(diceValue) {
    const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
    
    currentPlayer.pieces.forEach(piece => {
      piece.canMove = this.canPieceMove(piece, diceValue);
    });
  }

  // Check if piece can move
  canPieceMove(piece, diceValue) {
    // If piece is in home base, need 6 to start
    if (piece.position === -1) {
      return diceValue === 6;
    }

    // If piece is on main path or home column
    const newPosition = this.calculateNewPosition(piece, diceValue);
    return newPosition !== null;
  }

  // Calculate new position for piece
  calculateNewPosition(piece, diceValue) {
    const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
    const playerData = gameData.players[currentPlayer.Id - 1];

    // If piece is in home base
    if (piece.position === -1) {
      if (diceValue === 6) {
        return playerData.startPosition;
      }
      return null;
    }

    // If piece is in home column
    if (piece.position >= 52) {
      const homeColumnIndex = piece.position - 52;
      const playerHomeStart = (currentPlayer.Id - 1) * 5;
      
      if (homeColumnIndex >= playerHomeStart && homeColumnIndex < playerHomeStart + 5) {
        const newHomePosition = homeColumnIndex + diceValue;
        if (newHomePosition < playerHomeStart + 5) {
          return 52 + newHomePosition;
        }
        // Exact landing on home
        if (newHomePosition === playerHomeStart + 5) {
          return 'home';
        }
      }
      return null;
    }

    // Check if piece should enter home column
    const distanceToHome = this.getDistanceToHomeColumn(piece.position, currentPlayer.Id);
    if (distanceToHome <= diceValue) {
      const homeColumnPosition = diceValue - distanceToHome;
      const playerHomeStart = (currentPlayer.Id - 1) * 5;
      
      if (homeColumnPosition < 5) {
        return 52 + playerHomeStart + homeColumnPosition;
      }
      return null;
    }

    // Regular movement on main path
    return (piece.position + diceValue) % 52;
  }

  // Get distance to home column entry
  getDistanceToHomeColumn(currentPosition, playerId) {
    const playerData = gameData.players[playerId - 1];
    const homeEntry = (playerData.startPosition + 51) % 52;
    
    if (currentPosition <= homeEntry) {
      return homeEntry - currentPosition + 1;
    } else {
      return (52 - currentPosition) + homeEntry + 1;
    }
  }

  // Move piece
  async movePiece(pieceId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const piece = this.gameState.pieces[pieceId];
        const diceValue = this.gameState.diceValue;
        const newPosition = this.calculateNewPosition(piece, diceValue);

        if (newPosition === null) {
          resolve({ success: false, message: "Invalid move" });
          return;
        }

        // Check for captures
        const capturedPiece = this.checkForCaptures(newPosition);
        
        // Update piece position
        const oldPosition = piece.position;
        piece.position = newPosition === 'home' ? 'home' : newPosition;
        piece.isHome = newPosition === 'home';
        piece.isSafe = this.isSafePosition(newPosition);

        // Clear old board position
        if (oldPosition >= 0 && oldPosition < 52) {
          this.gameState.boardPositions[oldPosition] = null;
        }

        // Set new board position
        if (typeof newPosition === 'number' && newPosition >= 0 && newPosition < 52) {
          this.gameState.boardPositions[newPosition] = pieceId;
        }

        // Handle captures
        if (capturedPiece) {
          this.sendPieceHome(capturedPiece);
        }

        // Check win condition
        const winner = this.checkWinCondition();
        if (winner) {
          this.gameState.gameStatus = 'finished';
          this.gameState.winner = winner;
        }

        // Next turn (unless rolled 6 or captured)
        const shouldGetExtraTurn = diceValue === 6 || capturedPiece;
        if (!shouldGetExtraTurn && this.gameState.gameStatus === 'playing') {
          this.nextTurn();
        }

        // Clear movable pieces
        this.clearMovablePieces();

        resolve({
          success: true,
          gameState: this.gameState,
          captured: capturedPiece,
          winner
        });
      }, 400);
    });
  }

  // Check for piece captures
  checkForCaptures(position) {
    if (typeof position !== 'number' || position < 0 || position >= 52) {
      return null;
    }

    const occupyingPieceId = this.gameState.boardPositions[position];
    if (!occupyingPieceId) return null;

    const occupyingPiece = this.gameState.pieces[occupyingPieceId];
    const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];

    // Can't capture own pieces
    if (occupyingPiece.playerId === currentPlayer.Id) {
      return null;
    }

    // Can't capture on safe positions
    if (this.isSafePosition(position)) {
      return null;
    }

    return occupyingPiece;
  }

  // Check if position is safe
  isSafePosition(position) {
    return gameData.boardLayout.safeZones.includes(position) ||
           gameData.boardLayout.starPositions.includes(position);
  }

  // Send piece back to home base
  sendPieceHome(piece) {
    const playerData = gameData.players[piece.playerId - 1];
    const homePosition = playerData.homePositions.find(pos => {
      return !Object.values(this.gameState.pieces).some(p => 
        p.boardPosition === pos && p.position === -1
      );
    });

    // Clear board position
    if (piece.position >= 0 && piece.position < 52) {
      this.gameState.boardPositions[piece.position] = null;
    }

    piece.position = -1;
    piece.boardPosition = homePosition;
    piece.isHome = false;
    piece.isSafe = false;
  }

  // Check win condition
  checkWinCondition() {
    for (const player of this.gameState.players) {
      const allPiecesHome = player.pieces.every(piece => piece.isHome);
      if (allPiecesHome) {
        return player;
      }
    }
    return null;
  }

// Move to next turn
  nextTurn() {
    this.gameState.currentPlayerIndex = 
      (this.gameState.currentPlayerIndex + 1) % this.gameState.players.length;
    this.gameState.turnCount++;
    this.gameState.diceValue = 0;
    this.gameState.isRolling = false;
  }

  // Clear movable pieces
  clearMovablePieces() {
    Object.values(this.gameState.pieces).forEach(piece => {
      piece.canMove = false;
    });
  }

  // AI move logic
  async makeAIMove() {
    const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
    if (!currentPlayer.isAI) return;

    // Wait for AI thinking time
    await new Promise(resolve => setTimeout(resolve, currentPlayer.thinkTime || 1500));

    // Roll dice first
    await this.rollDice();

    // Wait a bit more
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find movable pieces
    const movablePieces = currentPlayer.pieces.filter(piece => piece.canMove);
    
    if (movablePieces.length === 0) {
      // No moves available, next turn
      this.nextTurn();
      return;
    }

    // AI strategy
    let selectedPiece;
    switch (currentPlayer.difficulty) {
      case 'easy':
        selectedPiece = movablePieces[Math.floor(Math.random() * movablePieces.length)];
        break;
      case 'medium':
        selectedPiece = this.chooseMediumAIMove(movablePieces);
        break;
      case 'hard':
        selectedPiece = this.chooseHardAIMove(movablePieces);
        break;
      default:
        selectedPiece = movablePieces[0];
    }

    // Make the move
    await this.movePiece(selectedPiece.Id);
  }

  // Medium AI strategy
  chooseMediumAIMove(movablePieces) {
    // Prefer pieces that can capture
    const capturePieces = movablePieces.filter(piece => {
      const newPos = this.calculateNewPosition(piece, this.gameState.diceValue);
      return this.checkForCaptures(newPos) !== null;
    });

    if (capturePieces.length > 0) {
      return capturePieces[0];
    }

    // Prefer pieces closer to home
    return movablePieces.reduce((best, current) => {
      return current.position > best.position ? current : best;
    });
  }

  // Hard AI strategy
  chooseHardAIMove(movablePieces) {
    // Prioritize: captures > pieces near home > pieces out of base
    const capturePieces = movablePieces.filter(piece => {
      const newPos = this.calculateNewPosition(piece, this.gameState.diceValue);
      return this.checkForCaptures(newPos) !== null;
    });

    if (capturePieces.length > 0) {
      return capturePieces[0];
    }

    // Pieces that can enter home column
    const homeColumnPieces = movablePieces.filter(piece => {
      const newPos = this.calculateNewPosition(piece, this.gameState.diceValue);
      return typeof newPos === 'number' && newPos >= 52;
    });

    if (homeColumnPieces.length > 0) {
      return homeColumnPieces[0];
    }

    // Advanced pieces
    const advancedPieces = movablePieces.filter(piece => piece.position > 0);
    if (advancedPieces.length > 0) {
      return advancedPieces.reduce((best, current) => {
        return current.position > best.position ? current : best;
      });
    }

    return movablePieces[0];
  }

  // Get current game state
  async getGameState() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.gameState);
      }, 100);
    });
  }

  // Reset game
  async resetGame() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.gameState = this.getInitialGameState();
        resolve(this.gameState);
      }, 200);
    });
  }

  // Get game data
  async getGameData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(gameData);
      }, 100);
    });
  }
}

export default new GameService();