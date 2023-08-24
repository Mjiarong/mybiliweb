import axios from "@/api/utils/axios.js";

// 读取视频排行榜
const getDailyRank =() => axios.get('/rank/daily');

export default getDailyRank;