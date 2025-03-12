import api from "../../api";

export interface MatchData {
  _id: string;
  status: string;
  mode_game: string;
  pooltable: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchMatches = async (): Promise<MatchData[]> => {
  try {
    const response = await api.get<{ data: MatchData[] }>("v1/matches");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
};