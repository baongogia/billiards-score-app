import api from "../api";

export const login = (email: string, password: string) => {
  return api.post("/v1/auth/login", { email, password });
};

export const findUser = (id: string) => {
  return api.get(`/v1/users/${id}`);
};
