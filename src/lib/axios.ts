import axios from "axios";
import { baseApiRoute } from "@/constants";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL + baseApiRoute,
});

export { api };
