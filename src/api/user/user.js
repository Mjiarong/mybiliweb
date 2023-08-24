import axios from "@/api/utils/axios.js";



// 读视频详情
export const getInfo = name => axios.get(`/user/${name}`);