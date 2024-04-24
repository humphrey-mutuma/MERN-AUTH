import { axiosInstance } from "@/src/app/lib/axios-instance";

export const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);
