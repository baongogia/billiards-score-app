import api from "../../api";

export interface MatchData {
  match: any;
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
    console.log("Get matches success");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
};

export const fetchMatchById = async (id: string): Promise<MatchData> => {
  try {
    const response = await api.get<{ data: { match: MatchData } }>(`v1/matches/${id}`);
    return response.data.data.match;
  } catch (error) {
    console.error("Error fetching match:", error);
    throw error;
  }
};

export const createMatch = async (status: string, mode_game: string, pooltable: string): Promise<MatchData> => {
  try {
    const response = await api.post<{ data: MatchData }>("v1/matches", {
      status,
      mode_game,
      pooltable
    });
    return response.data.data;
  } catch (error) {
    console.error("Error creating match:", error);
    throw error;
  }
};

export const updateMatch = async (id: string, matchData: Partial<MatchData>): Promise<MatchData> => {
  try {
    const response = await api.put<{ data: MatchData }>(`v1/matches/${id}`, matchData);
    return response.data.data;
  } catch (error) {
    console.error("Error updating match:", error);
    throw error;
  }
};

export const deleteMatch = async (id: string): Promise<void> => {
  try {
    await api.delete(`v1/matches/${id}`);
  } catch (error) {
    console.error("Error deleting match:", error);
    throw error;
  }
};

export const getTableById = async (id: string) => {
  try {
    const response = await api.get(`v1/tables/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching table by id:", error);
    throw error;
  }
};