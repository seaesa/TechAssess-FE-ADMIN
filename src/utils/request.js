import { env } from "@/config/env";
import axios from "axios";

const token = localStorage.getItem("accessToken");
const request = axios.create({
  baseURL: env.SERVER_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
export default request;
