import api from '../../api';

export interface TeamMember {
  _id: string;
  name: string;
}

export interface TeamResult {
  score: number;
  foulCount: number;
  strokes: number;
}

export interface Team {
  _id: string;
  members: TeamMember[];
  match: {
    _id: string;
    mode_game: string;
  };
  result: TeamResult;
  createdAt: string;
  updatedAt: string;
}

export interface TeamResponse {
  statusCode: number;
  message: string;
  data: Team[];
}

export const fetchTeamMatch = async (matchId: string): Promise<Team[]> => {
  const response = await api.get<TeamResponse>(`/v1/teams/match/${matchId}`);
  return response.data.data;
};