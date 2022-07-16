<template>
	<div class="post-video">
		<h2>欢迎投稿：</h2>
		<el-form ref="form" :model="form" label-width="80px">
			<el-form-item label="标题">
				<el-input v-model="form.title"></el-input>
			</el-form-item>

			<el-form-item label="描述">
				<el-input type="textarea" v-model="form.info"></el-input>
			</el-form-item>

			<el-form-item label="视频封面">
				<el-upload 
					class="avatar-uploader" 
					action="fakeaction" 
					ref="upload" 
					:on-success="handleAvatarSuccess"
					:before-upload="beforeAvatarUpload"
					:http-request="fnAvatarUpload" 
					:show-file-list="false"
				>
					<img v-if="imageUrl" :src="imageUrl" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					<div class="el-upload__tip" slot="tip">只能上传png/jpeg文件，且不超过500kb</div>
				</el-upload>
			</el-form-item>

			<el-form-item>
				<el-upload
					class="video-uploader"
					drag
					action="fakeaction" 
					multiple
					:on-success="handleVideoSuccess"
					:before-upload="beforeVideoUpload"
					:http-request="fnVideoUpload" 
					:on-progress="handleProgress"
					>
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
					<div class="el-upload__tip" slot="tip">只能上传mp4文件，且不超过500mb</div>
				</el-upload>
			</el-form-item>
			
			<el-form-item>
				<el-button type="primary" @click="onSubmit">立即创建</el-button>
			</el-form-item>

		</el-form>
	</div>
</template>

<script>
	import * as API from '../api/video/video.js';
	import uplpadAPI from '../api/upload/upload.js';

	export default {
		name: 'PostVideo',
		data() {
			return {
				imageUrl: '',
				dialogImageUrl: '',
				dialogVisible: false,
				form: {
					title: '',
					info: '',
					url: '',
					avatar: '',
				},
			};
		},
		
		methods: {
			handleAvatarSuccess(res) {
				this.imageUrl = res.data.signedGetURL;
				this.form.avatar = res.data.key;
				console.log('成功');
			},
			
			beforeAvatarUpload(file) {
				const isImage = (file.type === 'image/png' || file.type === 'image/jpeg');
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isImage) {
					this.$message.error('上传头像图片只能是图片!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isImage && isLt2M;
			},
			
			fnAvatarUpload(option) {
				var type = 'avatar'
				uplpadAPI(option.file.name,type).then((res) => {
				/* 获取到 Url 后，前端可以这样 ajax 上传 */
				console.log(option.file,2021);
				var xhr = new XMLHttpRequest();
				xhr.open('PUT', res.data.signedPutURL, true); 
				xhr.onload = function (e) {
					console.log('上传成功', xhr.status, xhr.statusText);
					option.onSuccess(res)
					/* 通过手动抛出 options.onSuccess(res) 来调用 handleAvatarSuccess 函数，拿到图片地址*/
				};
				xhr.onerror = function (e) {
					console.log('上传出错', xhr.status, xhr.statusText);
				};
				xhr.send(option.file); 
					
				}).catch((error) => {
					this.$notify.error({
						title: '网路错误，或者服务器宕机',
						message: error,
					});
				});
			},
			

			handleVideoSuccess(res) {
				this.form.url = res.data.key;
				        if (this.videoUploadPercent === 100) {
				
				          this.videoUploadPercent = 0
				        }
				console.log('成功');
			},
			beforeVideoUpload(file) {
				const isVideo = (file.type === 'video/mp4' || file.type === 'image/jpeg');
				const isLt64M = file.size / 1024 / 1024 < 64;
				if (!isVideo) {
					this.$message.error('上传的视频文件不符合格式限制!');
				}
				if (!isLt64M) {
					this.$message.error('上传视频大小不能超过 64MB!');
				}
				return isVideo && isLt64M;
			},
			fnVideoUpload(option) {
				var type = 'video'
				uplpadAPI(option.file.name,type).then((res) => {
				/* 获取到 Url 后，前端可以这样 ajax 上传 */
				var xhr = new XMLHttpRequest();
				xhr.open('PUT', res.data.signedPutURL, true); 
				xhr.onload = function (e) {
					console.log('上传成功', xhr.status, xhr.statusText);
					option.onSuccess(res)
				};
				xhr.onerror = function (e) {
					console.log('上传出错', xhr.status, xhr.statusText);
				};
				xhr.send(option.file); 
					
				}).catch((error) => {
					this.$notify.error({
						title: '网路错误，或者服务器宕机',
						message: error,
					});
				});
			},
			handleProgress(event,file,fileList){
			   this.percentage = parseInt((event.loaded / event.total *100).toFixed(0))
			},


			
			onSubmit() {
				API.postVideo(this.form).then((res) => {
					if (res.status > 0) {
						this.$notify.error({
							title: '投稿失败',
							message: res.msg,
						});
					} else {
						this.$notify({
							title: '投稿成功',
							message: `您投稿的ID为${res.data.id}`,
							type: 'success',
						});
					}
				}).catch((error) => {
					this.$notify.error({
						title: '网路错误，或者服务器宕机',
						message: error,
					});
				});
			},
		},
		components: {},
	};
</script>


<style>
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