<template>
	<div class="post-video">
		<el-tabs type="border-card">
			<el-tab-pane label="视频投稿">
				<el-form ref="form" :model="form" :rules="rules" label-width="80px">
					<el-form-item label="视频文件" prop="url">
						<el-upload ref="video-upload" :limit='1' class="video-uploader" :drag='true' action="fakeaction"
							:auto-upload="false" :http-request="handleVideoUpload" :on-change="onVideoUploadChange">
							<i class="el-icon-upload"></i>
							<div class="el-upload__text">将视频文件拖到此处，或<em>点击上传</em></div>
							<div class="el-upload__tip" slot="tip">只能上传mp4文件，且不超过500mb</div>
						</el-upload>
						<el-progress :percentage="this.videoUploadPercentage"></el-progress>
						<el-button style="margin-left: 10px;" size="small" type="success"
							@click="handleVideoUpload">修改视频</el-button>
					</el-form-item>

					<el-form-item label="标题" prop="title">
						<el-input v-model="form.title"></el-input>
					</el-form-item>

					<el-form-item label="简介" prop="info">
						<el-input type="textarea" v-model="form.info"></el-input>
					</el-form-item>

					<el-form-item label="视频封面" prop="avatar">
						<el-upload ref="avatarupload" class="avatar-uploader" action="fakeaction" :http-request="handleAvatarUpload"
							:show-file-list="false" :auto-upload="false" :on-change="onAvatarUploadChange">
							<img v-if="imageUrl" :src="imageUrl" class="avatar">
							<i v-else="imageUrl" class="el-icon-plus avatar-uploader-icon"></i>
							<div class="el-upload__tip" slot="tip">只能上传png/jpeg文件，且不超过2mb</div>
						</el-upload>
						<el-progress :percentage="this.avatarUploadPercentage"></el-progress>
						<el-button style="margin-left: 10px;" size="small" type="success"
							@click="handleAvatarUpload">修改封面</el-button>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="onSubmit">立即投稿</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="音频投稿">音频投稿</el-tab-pane>
			<el-tab-pane label="互动视频投稿">互动视频投稿</el-tab-pane>
			<el-tab-pane label="贴纸投稿">贴纸投稿</el-tab-pane>
		</el-tabs>

	</div>
</template>

<script>
	import * as API from '@/api/video/video.js';
	import uplpadAPI from '@/api/upload/upload.js';
	import cos from '@/api/upload/cos.js';
	import {
		createUid
	} from '@/api/utils/uuid.js';
	import {
		formatSeconds
	} from '@/api/utils/time.js';

	export default {
		name: 'VideoUpload',
		data() {
			return {
				type: '',
				videoItem: {},
				imageUrl: '',
				dialogImageUrl: '',
				dialogVisible: false,
				avatarFiles: {},
				videoFiles: {},
				avatarKey: '',
				videoKey: '',
				durationValue: 0,
				avatarUploadPercentage: 0,
				videoUploadPercentage: 0,
				form: {
					title: '',
					info: '',
					video_key: '',
					avatar_key: '',
					duration: 0,
					creator: 0,
				},
				rules: {
					title: [{
						required: true,
						message: "请输入视频标题",
						trigger: "blur"
					}, ],
					avatar: [{
						required: true,
						message: "请上传你的头像",
						trigger: "blur"
					}, ],
					url: [{
						required: true,
						message: "请上传视频",
						trigger: "blur"
					}, ],
					info: [{
							required: true,
							message: "请输入视频描述",
							trigger: "blur"
						},
						{
							min: 4,
							message: "视频描述不能少于4个字符",
							trigger: "blur"
						},
						{
							max: 100,
							message: "视频描述不能大于30个字符",
							trigger: "blur"
						},
					],
				},
			};
		},

		methods: {
			onVideoUploadChange(file, fileList) {
				var video = file.raw;
				console.log(file); //
				//console.log(fileList); //
				//console.log(this.avatarFiles); //
				console.log(video);
				console.log(video.type);
				const isVideo = (video.type === 'video/mp4');
				const isLt100M = video.size / 1024 / 1024 < 100;
				if (!isVideo) {
					this.$message.error('上传的视频文件不符合格式限制!');
					return isVideo;
				}
				if (!isLt100M) {
					this.$message.error('上传视频大小不能超过 100MB!');
					return isLt100M;
				}

				let url = URL.createObjectURL(video)
				var audioElement = new Audio(url)
				let that = this;
				audioElement.addEventListener('loadedmetadata', function() {
					that.durationValue = audioElement.duration; //duration就是当前视频长度
					//console.log(duration); //单位：秒
					//console.log(formatSeconds(duration)); // 01:40:00
				})
				this.videoFiles = video;
				return isVideo && isLt100M;
			},

			async videoUpload() {
				const file = this.videoFiles;
				let uid = createUid();
				let that = this;
				this.videoKey = 'video/' + uid + '-' + this.videoFiles.name;
				try {
					var data = await cos.uploadFile({
						Bucket: 'mybili-1312334998',
						/* 填写自己的 bucket，必须字段 */
						Region: 'ap-guangzhou',
						/* 存储桶所在地域，必须字段 */
						Key: this.videoKey,
						/* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
						Body: file, // 上传文件对象
						SliceSize: 1024 * 1024 * 5,
						/* 触发分块上传的阈值，超过5MB 使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
						onProgress: function(progressData) {
							/* 上传文件的进度回调函数，回调参数为进度对象 progressData,非必须 */
							that.videoUploadPercentage = progressData.percent * 100;
							//console.log(JSON.stringify(progressData));
						},
					});
					return {
						err: null,
						data: data
					}
				} catch (err) {
					return {
						err: err,
						data: null
					};
				}
			},

			async deleteVideo(video) {
				try {
					var data = await cos.deleteObject({
						Bucket: 'mybili-1312334998',
						/* 填写自己的 bucket，必须字段 */
						Region: 'ap-guangzhou',
						/* 存储桶所在地域，必须字段 */
						Key: video,
						/* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
					});
					return {
						err: null,
						data: data
					}
				} catch (err) {
					return {
						err: err,
						data: null
					};
				}
			},
			
			async handleVideoUpload() {
				if (this.form.video_key) { //要先删除旧视频再上传新的视频
					var deleteResult = await this.deleteVideo(this.form.video_key);
					if (deleteResult.err) {
						this.$message({
							message: deleteResult.err,
							type: 'warning'
						});
					} 
				}
				// 可以同步拿到请求的返回值,这里举例说明,实际返回的数据格式可以自定义
				var uploadResult = await this.videoUpload();
				if (uploadResult.err) {
					this.$message({
						message: uploadResult.err,
						type: 'warning'
					});
				} else {
					console.log(this.videoKey);
					var username = window.sessionStorage.getItem('username')
					if (!username) {
						return false
					}
					this.form.creator = username;
					this.form.duration = this.durationValue;
					this.form.video_key = this.videoKey;
					this.$message({
						message: '上传成功',
						type: 'success'
					});
				}
			},

			onAvatarUploadChange(file, fileList) {
				var avatar = file.raw;
				// /console.log(file); //
				//console.log(fileList); //
				//console.log(this.avatarFiles); //
				//console.log(avatar.type);
				const isImage = (avatar.type === 'image/png' || avatar.type === 'image/jpeg');
				const isLt2M = avatar.size / 1024 / 1024 < 2;
				if (!isImage) {
					this.$message.error('上传头像图片只能是图片!');
					return isImage
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
					return isLt2M;
				}
				this.avatarFiles = avatar;
				this.imageUrl = URL.createObjectURL(avatar);

				return isImage && isLt2M;
			},

			async avatarUpload() {
				const file = this.avatarFiles;
				let uid = createUid();
				this.avatarKey = 'avatar/' + uid + '-' + this.avatarFiles.name;
				var that = this;
				try {
					var data = await cos.uploadFile({
						Bucket: 'mybili-1312334998',
						/* 填写自己的 bucket，必须字段 */
						Region: 'ap-guangzhou',
						/* 存储桶所在地域，必须字段 */
						Key: this.avatarKey,
						/* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
						Body: file, // 上传文件对象
						SliceSize: 1024 * 1024 * 5,
						/* 触发分块上传的阈值，超过5MB 使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
						onProgress: function(progressData) {
							/* 非必须 */
							that.avatarUploadPercentage = progressData.percent * 100;
							//console.log(JSON.stringify(progressData));
						},
					});
					return {
						err: null,
						data: data
					}
				} catch (err) {
					return {
						err: err,
						data: null
					};
				}
			},


			async deleteAvatar(avatar) {
				try {
					var data = await cos.deleteObject({
						Bucket: 'mybili-1312334998',
						/* 填写自己的 bucket，必须字段 */
						Region: 'ap-guangzhou',
						/* 存储桶所在地域，必须字段 */
						Key: avatar,
						/* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
					});
					return {
						err: null,
						data: data
					}
				} catch (err) {
					return {
						err: err,
						data: null
					};
				}
			},

			async handleAvatarUpload() {
				if (this.form.avatar_key) { //要先删除旧封面再上传新的封面
					var deleteAvatarResult = await this.deleteAvatar(this.form.avatar_key);
					if (deleteAvatarResult.err) {
						this.$message({
							message: deleteAvatarResult.err,
							type: 'warning'
						});
					} 
				}
				// 可以同步拿到请求的返回值,这里举例说明,实际返回的数据格式可以自定义
				var uploadResult = await this.avatarUpload();
				if (uploadResult.err) {
					this.$message({
						message: uploadResult.err,
						type: 'warning'
					});
				} else {
					this.form.avatar_key = this.avatarKey;
					this.$message({
						message: '上传成功',
						type: 'success'
					});
				}
			},

			async onSubmit() {
				const isReady = (this.form.avatar_key && this.form.video_key);
				if (!isReady) {
					this.$message.error('请先上传头像或视频文件到服务器！');
					return isReady
				}
				try {
					let res = {};
					if (this.type === 'edit') {
						res = await API.updateVideo(this.videoItem.id, this.form) //注意async放在箭头函数而不是submitForm前
					} else {
						res = await API.postVideo(this.form) //注意async放在箭头函数而不是submitForm前
					}
					if (res.data.code != 0) {
						this.$notify.error({
							title: '投稿失败',
							message: res.msg,
						});
					} else {
						this.$notify({
							title: '投稿成功',
							type: 'success',
						});
					}
				} catch (err) {
					this.$notify.error({
						title: '网路错误，或者服务器宕机',
						message: err,
					});
				}
			},
		},

		created() {
			this.type = this.$route.query.type;
			if (this.type === 'edit') {
				this.videoItem = this.$route.query.videoItem;
				console.log(this.videoItem);
				this.form.title = this.videoItem.title;
				this.form.info = this.videoItem.info;
				this.imageUrl = this.videoItem.avatar_url;
				this.form.avatar_key = this.videoItem.avatar_key;
				this.form.video_key = this.videoItem.video_key;
				this.form.duration = this.videoItem.duration;
			}



		}
	};
</script>


<style scoped>
	.post-video {
		height: 100%;
	}

	.el-tab-pane {
		color: black;
	}

	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>