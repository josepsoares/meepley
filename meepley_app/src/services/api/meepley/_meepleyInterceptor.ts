import axios from "axios";
import { navigate } from "../../../navigation";
import { removeValue } from "../../localStorage";
import authStore from "../../store/authStore";

const _axios = axios.create({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

_axios.interceptors.request.use((config) => {
  const token = authStore.token;

  if (config?.headers && token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }

  return config;
});

_axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (
      error.response.status === 401 &&
      error.response.data.message === "Invalid token"
    ) {
      authStore.token = null;
      authStore.isAuth = false;
      authStore.user = null;
      authStore.userIsInMatchroom = false;

      removeValue("token");
      navigate("Login");
    }

    return Promise.reject(error);
  }
);

export default _axios;
