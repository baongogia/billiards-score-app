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

export interface MatchDetails {
  _id: string;
  status: string;
  mode_game: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  _id: string;
  teamName: string;
  members: TeamMember[]; // Change this line from string[] to TeamMember[]
  match: MatchDetails;
  result: TeamResult;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TeamResponse {
  statusCode: number;
  message: string;
  data: Team[];
}

export const fetchTeamMatch = async (matchId: string): Promise<Team[]> => {
  const response = await api.get<TeamResponse>(`/v1/teams/match/${matchId}`);
  console.log("GET detail match success");
  return response.data.data;
};

export const fetchUserMatchHistory = async (userId: string): Promise<Team[]> => {
  const response = await api.get<TeamResponse>(`/v1/teams/match/member/${userId}`);
  console.log("GET match by UserID success");
  return response.data.data;
};