/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

const socket: Socket = io(import.meta.env.VITE_HOST_API, {
  autoConnect: false,
});
if (!socket.connected) {
  socket.connect();
}
interface RoomUpdateData {
  players: string[];
}

export const useSocket = () => {
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      toast.success("Connected to the socket server!");
    });

    socket.on("room_update", (data: RoomUpdateData) => {
      setPlayers(data.players);
    });

    return () => {
      socket.off("room_update");
    };
  }, []);
  useEffect(() => {
    socket.on("connect", () => {
      toast.success("Connected to the socket server!");
    });

    socket.on("room_update", (data: any) => {
      setPlayers(data.players);
    });

    return () => {
      socket.off("room_update");
    };
  }, []);

  // Hàm gửi yêu cầu tạo phòng
  const createMatchAcc = (pooltable: string, mode_game: string) => {
    socket.emit("createRoom", {
      pooltable, // ID của bảng pooltable
      mode_game, // Chế độ game (ví dụ: 8-ball)
    });
  };

  // Hàm rời phòng
  const leaveRoom = (roomId: string) => {
    socket.emit("leave_room", { roomId });
  };

  // Hàm kết thúc trận
  const endMatch = (roomId: string) => {
    socket.emit("end_match", { roomId });
  };

  return { socket, createMatchAcc, leaveRoom, endMatch, players };
};
