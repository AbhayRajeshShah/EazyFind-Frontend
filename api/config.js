import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

export const API = axios.create({
  baseURL: BASE_URL,
});
