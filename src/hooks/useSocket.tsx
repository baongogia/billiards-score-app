/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("wss://swd392sp25.com:8000", {
  auth: {
    token: localStorage.getItem("token"),
  },
});

export const useSocket = () => {
  useEffect(() => {
    // Lắng nghe sự kiện kết nối
    socket.on("connect", () => {
      toast.success("Connected to the socket server!");
    });

    // Cleanup khi component unmounts để tránh rò rỉ bộ nhớ
    return () => {
      socket.off("connect");
    };
  }, []);

  const createMatchAccount = (pooltable: string) => {
    socket.emit("createRoom", { pooltable });

    socket.on("roomCreated", (data: any) => {
      const { roomId, matchId } = data;
      toast.success(
        `Room created successfully! Room ID: ${roomId}, Match ID: ${matchId}`
      );
    });
  };
  return { socket, createMatchAccount };
};
