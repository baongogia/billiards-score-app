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
    console.log("Get match success");
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw new Error("Failed to fetch matches");
  }
};

export const fetchMatchById = async (id: string): Promise<{match:MatchData}> => {
  try {
    const response = await api.get(`v1/matches/${id}`);
    console.log("Get match by id success");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching match:", error);
    throw error;
  }
};

export const createMatch = async (
  matchData: Partial<MatchData>
): Promise<MatchData> => {
  try {
    const response = await api.post<{ data: MatchData }>(
      "v1/matches",
      matchData
    );
    console.log("Create match success");
    return response.data.data;
  } catch (error) {
    console.error("Error creating match:", error);
    throw error;
  }
};

export const updateMatch = async (
  id: string,
  matchData: Partial<MatchData>
): Promise<MatchData> => {
  try {
    const response = await api.put<{ data: MatchData }>(
      `v1/matches/${id}`,
      matchData
    );
    console.log("Update match success");
    return response.data.data;
  } catch (error) {
    console.error("Error updating match:", error);
    throw error;
  }
};

export const deleteMatch = async (id: string): Promise<void> => {
  try {
    await api.delete(`v1/matches/${id}`);
    console.log("Delete match success");
  } catch (error) {
    console.error("Error deleting match:", error);
    throw error;
  }
};

// Create a new match
export const createNewMatch = (
  status: string,
  mode_game: string,
  pooltable: string
) => {
  return api.post("/v1/matches", { status, mode_game, pooltable });
};
// Get table by id
export const getTableById = (id: string) => {
  return api.get(`/v1/pooltables/${id}`);
};
