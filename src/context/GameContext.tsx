import { createContext, useContext, useState, ReactNode } from "react";

// Định nghĩa kiểu dữ liệu cho game
interface GameState {
  playerName: string; // Tên của người chơi chính (Host)
  partnerName: string; // Tên của người chơi thứ hai (Guest)
  mode: string;
  gameType: string;
  firstTurn: string;
  timeLimit: number;
  tableId?: string;
  setGameState: (newState: Partial<GameState>) => void;
}

// Khởi tạo giá trị mặc định
const defaultGameState: GameState = {
  playerName: "",
  partnerName: "",
  mode: "",
  gameType: "",
  firstTurn: "",
  timeLimit: 60,
  tableId: undefined,
  setGameState: () => {},
};

// Tạo context
const GameContext = createContext<GameState>(defaultGameState);

// Tạo provider để bao bọc ứng dụng
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);

  // Hàm cập nhật state
  const updateGameState = (newState: Partial<GameState>) => {
    setGameState((prevState) => ({ ...prevState, ...newState }));
  };

  return (
    <GameContext.Provider
      value={{ ...gameState, setGameState: updateGameState }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Hook dùng để lấy dữ liệu từ context
export const useGame = () => {
  return useContext(GameContext);
};
