import api from "../api";

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
