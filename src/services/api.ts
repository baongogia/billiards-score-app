import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_HOST_API,
});

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

api.interceptors.request.use(
  async function (config) {
    const token = getCookie("token");
    const refreshToken = getCookie("refreshToken");
    if (token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));
      const currentDate = Math.floor(Date.now() / 1000);
      const expDate = payload.exp;
      const timeLeft = expDate - currentDate;
      const timeLeftInMinutes = Math.floor(timeLeft / 60);
      if (timeLeftInMinutes > 0 && timeLeftInMinutes < 8) {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_HOST_API}/v1/auth/refresh-token`,
            { refreshToken: refreshToken }
          );
          document.cookie = `token=${res.data.accessToken}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; secure; SameSite=Strict`;
          document.cookie = `refreshToken=${res.data.refreshToken}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; secure; SameSite=Strict`;
        } catch (error) {
          console.log("Error: " + error);
        }
      }
    }
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["X-Tenant-ID"] = "ITC";
    if (config.method?.toUpperCase() === "GET") {
      config.params = {
        ...config.params,
        limit: 1000,
      };
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export default api;
