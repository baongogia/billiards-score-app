import axios from "axios";

// Tạo instance Axios với baseURL
const api = axios.create({
  baseURL: import.meta.env.VITE_HOST_API,
});

// Hàm lấy cookie theo tên
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

// Axios Interceptor để xử lý token
api.interceptors.request.use(
  async function (config) {
    let token = localStorage.getItem("token") || getCookie("token");
    const refreshToken = getCookie("refreshToken");

    if (token) {
      try {
        // Giải mã JWT để lấy thời gian hết hạn
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));
        const currentDate = Math.floor(Date.now() / 1000);
        const expDate = payload.exp;
        const timeLeft = expDate - currentDate;

        // Nếu token hết hạn trong vòng 8 phút, refresh token
        if (timeLeft > 0 && timeLeft < 8 * 60) {
          console.log("Token gần hết hạn, đang refresh...");
          try {
            const res = await axios.post(
              `${import.meta.env.VITE_HOST_API}/v1/auth/refresh-token`,
              { refreshToken }
            );

            // Cập nhật token mới vào cookie
            document.cookie = `token=${res.data.accessToken}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; secure; SameSite=Strict`;
            document.cookie = `refreshToken=${res.data.refreshToken}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; secure; SameSite=Strict`;

            // Gán token mới cho request
            token = res.data.token;
          } catch (error) {
            console.error("Lỗi refresh token:", error);
            document.cookie =
              "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie =
              "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/login"; // Chuyển về trang đăng nhập
            return Promise.reject(error);
          }
        }
      } catch (error) {
        console.error("Lỗi giải mã JWT:", error);
      }
    }

    // Gán token vào headers nếu có
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Thêm X-Tenant-ID
    config.headers["X-Tenant-ID"] = "ITC";

    // Nếu là GET và không phải là v1/stores/search, thêm limit=1000 vào query params
    if (config.method?.toUpperCase() === "GET" && config.url !== "v1/stores/search" && config.url !== "v1/stores/search") {
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