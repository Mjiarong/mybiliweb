import axios from "@/api/utils/axios.js";

// const customConfig = {
// 	headers: {
// 		'Content-Type': 'application/json'
// 	}
// };

// 创建视频评论
const postComment = data => axios.post('/comment', data);

// 获取视频评论列表
/* const getComments = id => axios.get(`/comment/${id}`); */
const getComments = (videoID, userID) => axios.get(`/comment`, {
	params: {
		video_id: videoID,
		user_id: userID,
	}
});

// 删除视频评论
const deleteComment = (commentID, videoID) => axios.delete(`/comment`, {
	params: {
		comment_id: commentID,
		video_id: videoID,
	}
});


// 评论点赞
const addCommentLikes = (commentID, userID) => axios.post(`comment/likes/`, {
	comment_id: commentID,
	user_id: userID
});

// 评论点踩
const addCommentDislikes = (commentID, userID) => axios.post(`comment/dislikes/`, {
	comment_id: commentID,
	user_id: userID
});


export {
	postComment,
	getComments,
	addCommentLikes,
	addCommentDislikes,
	deleteComment
};