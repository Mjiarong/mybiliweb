import axios from "@/api/utils/axios.js";

// 创建视频
const postVideo = form => axios.post('/videos', form);

// 读视频详情
const getVideo = id => axios.get(`/video/${id}`);

// 读取视频列表
//将函数表达式分配给 const 变量可确保函数定义不变
const getVideos = (start, limit) => axios.get('/videos', {
	params: {
		start,
		limit
	}
});

const getVideosOfUser = username => axios.get(`/videos/${username}`);

const updateVideo = (id, form) => axios.put(`/video/${id}`, form);

const deleteVideo = id => axios.delete(`/video/${id}`);

// 视频点赞
const addVideoLikes = (videoID,userID) => axios.post(`video/likes/add`, {
	video_id: videoID,
	user_id: userID
});

// 查询用户是否已经对视频点赞、收藏等信息
const playInfoQuery = (videoID,userID) => axios.get(`video/playinfo`, {
    params:{
        video_id: videoID,
        user_id: userID
    }
});


export {
	getVideos,
	getVideo,
	postVideo,
	getVideosOfUser,
	updateVideo,
	deleteVideo,
	addVideoLikes,
	playInfoQuery
};