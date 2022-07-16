import axios from 'axios';

// 读视频详情
const postUploadToken = (fileName,type) => axios.post('/api/v1/upload/token', { filename: fileName ,type:type}).then(res => res.data);

export default postUploadToken;