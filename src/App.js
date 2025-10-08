import React, { useState, useEffect, useCallback } from 'react';

// --- KONSTANTE IGRE ---
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_DROP_TIME = 1000; // Početna brzina: 1000ms (1 sekunda)
const BLOCK_SIZE = '1.5rem'; // Veličina bloka u Tailwind stilu

// Tetris figure (Tetrominos)
const TETROMINOS = [
  // 0: Prazan blok
  { shape: [[0]], color: 'bg-gray-900', border: 'border-gray-800' },
  // I
  { shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], color: 'bg-cyan-400', border: 'border-cyan-200' },
  // J
  { shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]], color: 'bg-blue-600', border: 'border-blue-300' },
  // L
  { shape: [[0, 0, 1], [1, 1, 1], [0, 0, 0]], color: 'bg-orange-500', border: 'border-orange-200' },
  // O
  { shape: [[1, 1], [1, 1]], color: 'bg-yellow-400', border: 'border-yellow-200' },
  // S
  { shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], color: 'bg-green-500', border: 'border-green-200' },
  // T
  { shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]], color: 'bg-purple-600', border: 'border-purple-300' },
  // Z
  { shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], color: 'bg-red-500', border: 'border-red-300' },
];

// Pomoćna funkcija za generiranje novog praznog polja
const initBoard = () =>
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

// Pomoćna funkcija za generiranje nasumične figure
const randomTetromino = () => {
  const rand = Math.floor(Math.random() * (TETROMINOS.length - 1)) + 1;
  return {
    id: rand, // <<--- DODANO: Trajno pohranjivanje ID-a figure
    shape: TETROMINOS[rand].shape,
    color: TETROMINOS[rand].color,
    border: TETROMINOS[rand].border,
    pos: { x: BOARD_WIDTH / 2 - 2, y: 0 },
    collided: false,
  };
};

// Pomoćna funkcija za provjeru kolizije
const checkCollision = (piece, board, { x: moveX, y: moveY }) => {
  for (let y = 0; y < piece.shape.length; y += 1) {
    for (let x = 0; x < piece.shape[y].length; x += 1) {
      // 1. Provjeri je li dio figure
      if (piece.shape[y][x] !== 0) {
        // 2. Provjeri je li unutar dimenzija igrališta
        const nextX = x + piece.pos.x + moveX;
        const nextY = y + piece.pos.y + moveY;

        if (
          !board[nextY] || // Izašla iz vertikalnog okvira (pod)
          board[nextY][nextX] === undefined || // Izašla iz horizontalnog okvira (zidovi)
          board[nextY][nextX] !== 0 // Sudarila se s drugim blokom
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

// Pomoćna funkcija za rotiranje figure
const rotate = (matrix, dir) => {
  // Transpozicija matrice (zamjena redova i kolona)
  const rotatedMatrix = matrix.map((_, index) =>
    matrix.map(col => col[index])
  );
  // Obrtanje redova za rotaciju u smjeru kazaljke na satu (dir > 0)
  if (dir > 0) return rotatedMatrix.map(row => row.reverse());
  // Obrtanje kolona za rotaciju suprotno smjeru kazaljke na satu (dir < 0)
  return rotatedMatrix.reverse();
};


// --- GLAVNA KOMPONENTA APLIKACIJE ---
const App = () => {
  const [board, setBoard] = useState(initBoard());
  const [piece, setPiece] = useState(randomTetromino());
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [rows, setRows] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dropTime, setDropTime] = useState(INITIAL_DROP_TIME);

  // Funkcija za čišćenje popunjenih redova
  const clearRows = useCallback((newBoard) => {
    let linesCleared = 0;
    const newGrid = newBoard.reduce((ack, row) => {
      // Ako red nema nula (tj. popunjen je)
      if (row.every(cell => cell !== 0)) {
        linesCleared++;
        // Ne dodajemo red, pa će na kraju biti prazan red na vrhu
        return ack;
      }
      ack.push(row);
      return ack;
    }, []);

    // Dodaj prazne redove na vrh
    for (let i = 0; i < linesCleared; i++) {
      newGrid.unshift(Array(BOARD_WIDTH).fill(0));
    }
    
    // Ažuriraj rezultat i redove
    if (linesCleared > 0) {
      setScore(prev => prev + linesCleared * 10 * level);
      setRows(prev => prev + linesCleared);
      
      // Povećaj brzinu i nivo svakih 10 očišćenih redova
      if (rows + linesCleared >= level * 10) {
        setLevel(prev => prev + 1);
        setDropTime(INITIAL_DROP_TIME / (level + 1) + 200);
      }
    }
    
    return newGrid;
  }, [level, rows]);

  // Funkcija koja fiksira figuru na ploču
  const mergePiece = useCallback(() => {
    // 1. Kreiraj novu kopiju ploče
    let newBoard = board.map(row => row.map(cell => cell));

    // 2. Prebaci figuru na ploču
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          // Koristimo piece.id (koji je index 1-7), a ne tražimo index ponovo
          newBoard[y + piece.pos.y][x + piece.pos.x] = piece.id;
        }
      });
    });
    
    // 3. Očisti redove i ažuriraj ploču
    newBoard = clearRows(newBoard);

    // 4. Generiši novu figuru
    const newPiece = randomTetromino();
    
    // 5. Provjeri Game Over: ako se nova figura odmah sudari
    if (checkCollision(newPiece, newBoard, { x: 0, y: 0 })) {
      setIsGameOver(true);
      setDropTime(null);
    }
    
    setBoard(newBoard);
    setPiece(newPiece);
  }, [board, piece, clearRows]);


  // Funkcija za pomicanje figure
  const movePiece = useCallback((dirX, dirY) => {
    // Provjeri koliziju prije pomicanja
    if (!checkCollision(piece, board, { x: dirX, y: dirY })) {
      setPiece(prev => ({
        ...prev,
        pos: { x: prev.pos.x + dirX, y: prev.pos.y + dirY },
      }));
    } else if (dirY > 0) {
      // Ako ne može ići dole, fiksiraj je na ploču
      mergePiece();
    }
  }, [piece, board, mergePiece]);

  // Rotacija figure
  const rotatePiece = useCallback((dir) => {
    const clonedPiece = JSON.parse(JSON.stringify(piece));
    clonedPiece.shape = rotate(clonedPiece.shape, dir);
    
    // Pojednostavljena provjera rotacije na zidovima (Wall Kick)
    // Ovdje je bitno da piece.id ostaje isti, samo se shape mijenja
    const offset = clonedPiece.pos.x - (checkCollision(clonedPiece, board, { x: 0, y: 0 }) ? 1 : 0);
    if (offset) {
      clonedPiece.pos.x += offset;
    }
    
    if (!checkCollision(clonedPiece, board, { x: 0, y: 0 })) {
      setPiece(clonedPiece);
    }
  }, [piece, board]);


  // Handler za kontrole s tastature
  const handleKeydown = useCallback(({ keyCode }) => {
    
    // --- POPRAVKA PAUZE/NASTAVKA ---
    // Ako je P, uvijek promijeni stanje pauze i završi funkciju
    if (keyCode === 80) {
        setIsPaused(prev => !prev);
        return;
    }

    // Blokiraj sve ostale kontrole ako je igra gotova ili pauzirana
    if (isGameOver || isPaused) return;

    // Lijeva strelica
    if (keyCode === 37) {
      movePiece(-1, 0);
    } 
    // Desna strelica
    else if (keyCode === 39) {
      movePiece(1, 0);
    } 
    // Donja strelica (Soft Drop)
    else if (keyCode === 40) {
      movePiece(0, 1);
    } 
    // Gornja strelica ili W (Rotacija)
    else if (keyCode === 38 || keyCode === 87) {
      rotatePiece(1);
    }
    // Uklonjen stari else if (keyCode === 80) blok
  }, [movePiece, rotatePiece, isGameOver, isPaused]);
  
  // Prvo pokretanje i slušanje događaja s tastature
  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);


  // Petlja igre (Automatsko spuštanje figure)
  useEffect(() => {
    if (isGameOver || isPaused) return;

    const interval = setInterval(() => {
      movePiece(0, 1);
    }, dropTime);

    return () => clearInterval(interval);
  }, [dropTime, isGameOver, isPaused, movePiece]);


  // Funkcija koja kombinuje statičku ploču i trenutnu figuru za renderovanje
  const renderBoard = () => {
    // Kopija ploče
    // Pristup TETROMINOS[cell] je siguran jer je 'cell' index 0-7
    const newBoard = board.map(row => row.map(cell => ({ type: cell, color: TETROMINOS[cell].color, border: TETROMINOS[cell].border })));

    // Dodaj trenutnu figuru u kopiju
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const blockType = piece.id; // Koristimo pohranjeni ID
          newBoard[y + piece.pos.y][x + piece.pos.x] = {
            type: blockType,
            color: piece.color,
            border: piece.border,
          };
        }
      });
    });

    return newBoard;
  };
  
  // --- KOMPONENTA JEDNOG BLOKA ---
  const Cell = ({ cell }) => (
    <div 
      className={`
        w-6 h-6 sm:w-8 sm:h-8 border-2 rounded-sm
        ${cell.color} ${cell.border} 
        ${cell.type === 0 ? 'bg-gray-900 border-gray-800' : 'shadow-xl'}
      `}
      style={{
        width: BLOCK_SIZE,
        height: BLOCK_SIZE,
      }}
    />
  );
  
  // --- KOMPONENTA PLOČE (GRID) ---
  const Board = () => (
    <div
      className="bg-gray-900 border-4 border-gray-700 shadow-xl"
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
        gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
        width: `calc(${BOARD_WIDTH} * ${BLOCK_SIZE})`,
        height: `calc(${BOARD_HEIGHT} * ${BLOCK_SIZE})`,
        margin: 'auto',
      }}
    >
      {renderBoard().map((row, y) =>
        row.map((cell, x) => (
          <Cell key={x} cell={cell} />
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4 font-sans text-white">
      {/* Tailwind CSS se sada učitava u index.html */}
      <h1 className="text-4xl font-extrabold text-white mb-6 tracking-wider shadow-lg p-2 rounded-lg bg-gray-900">
        REACT TETRIS
      </h1>
      
      <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-12">

        {/* Informacije / Statistika */}
        <div className="w-full max-w-xs p-6 bg-gray-700 rounded-lg shadow-2xl space-y-4 order-2 lg:order-1">
          <h2 className="text-2xl font-bold text-center border-b-2 border-gray-600 pb-2 mb-4 text-cyan-400">Statistika</h2>
          <div className="flex justify-between text-lg font-medium">
            <span>Bodovi:</span>
            <span className="text-yellow-400">{score}</span>
          </div>
          <div className="flex justify-between text-lg font-medium">
            <span>Nivo:</span>
            <span className="text-green-400">{level}</span>
          </div>
          <div className="flex justify-between text-lg font-medium">
            <span>Redova:</span>
            <span className="text-red-400">{rows}</span>
          </div>
          <p className="text-xs text-gray-400 pt-4 border-t border-gray-600">
            Kontrole: ← → (Pomak), ↓ (Spusti), ↑/W (Rotacija), **P (Pauza/Nastavak)**.
          </p>
        </div>

        {/* Ploča za igru */}
        <div className="order-1 lg:order-2 relative">
          <Board />

          {/* Overlay za Game Over */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center rounded-lg">
              <span className="text-4xl font-bold text-red-500 mb-4">GAME OVER!</span>
              <span className="text-2xl text-white mb-6">Bodovi: {score}</span>
              <button
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition transform hover:scale-105"
                onClick={() => {
                  setBoard(initBoard());
                  setPiece(randomTetromino());
                  setScore(0);
                  setLevel(1);
                  setRows(0);
                  setIsGameOver(false);
                  setDropTime(INITIAL_DROP_TIME);
                }}
              >
                Pokušaj ponovo
              </button>
            </div>
          )}

          {/* Overlay za Pauzu */}
          {!isGameOver && isPaused && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center rounded-lg">
                <span className="text-4xl font-bold text-yellow-400 mb-4">PAUZA</span>
                <span className="text-xl text-white">Pritisnite 'P' za nastavak</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
