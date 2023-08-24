<template>
	<div class="upload-manage">
		<el-tabs type="border-card">
			<el-tab-pane label="视频管理">

				<div class="article-list_wrap" v-for="video in videos" :key="video.id">
					<div class="article-card">
						<div class="pic-box" @click="playVideo(video.id)">
							<img class="b-img-inner" :src="video.avatar_url">
						</div>

						<div class="meta-wrp">
							<div class="meta-title" @click="playVideo(video.id)">{{video.title}}</div>
							<div class="meta-date">
								{{ $moment.unix(video.created_at).format("YYYY-MM-DD HH:mm:ss")}}
							</div>
							<div class="meta-footer">
								<span class="playinfo-items" style="margin-right: 10px;">
									<i class="el-icon-video-play"></i>
									{{video.view}}
								</span>
								<span class="playinfo-item">
									<i class="el-icon-chat-dot-square"></i>
									508
								</span>
							</div>
						</div>

						<div class="manage-btn">
							<el-button size="medium" icon="el-icon-edit"  @click="goToUpdateideo(video)">编辑</el-button>
							<el-button size="medium" icon="el-icon-delete" @click="handleVideoDelete(video)">删除</el-button>
						</div>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="音频管理">音频管理</el-tab-pane>
			<el-tab-pane label="互动视频管理">互动视频管理</el-tab-pane>
			<el-tab-pane label="贴纸管理">贴纸管理</el-tab-pane>
		</el-tabs>

	</div>
</template>

<script>
	import * as API from '@/api/video/video.js';
	import cos from '@/api/upload/cos.js';
	export default {
		name: 'UploadManage',
		data() {
			return {
				videos: [],
				total: 0,
			};
		},

		methods: {
			async loadVideoOfUser() {
				var username = window.sessionStorage.getItem('username')
				if (!username) {
					return false
				}
				try {
					let {
						data: res
					} = await API.getVideosOfUser(username)
					if (res.code != 0) {
						this.$message({
							message: "获取视频列表失败",
							type: "error",
							showClose: true,
						});
					} else {
						this.videos = res.data.items;
						this.total = res.data.total;
					}
				} catch (err) {
					this.$message({
						message: "请求出错",
						type: "error",
						showClose: true,
					});
				}
			},

			playVideo(id) {
				let routeData = this.$router.resolve({
					name: "showVideo",
					params: {
						videoID: id
					}
				});
				window.open(routeData.href, '_blank');
			},


			async deleteVideo(video) {
				try {
					var data = await cos.deleteObject({
						Bucket: 'mybili-1312334998',
						/* 填写自己的 bucket，必须字段 */
						Region: 'ap-guangzhou',
						/* 存储桶所在地域，必须字段 */
						Key: video.video_key,
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
			
			async deleteAvatar(video) {
				try {
					var data = await cos.deleteObject({
						Bucket: 'mybili-1312334998',
						/* 填写自己的 bucket，必须字段 */
						Region: 'ap-guangzhou',
						/* 存储桶所在地域，必须字段 */
						Key: video.avatar_key,
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

			async handleVideoDelete(video) {
				var deleteAvatarResult = await this.deleteAvatar(video);
				if (deleteAvatarResult.err) {
					this.$message({
						message: deleteAvatarResult.err,
						type: 'warning'
					});
				} 
				
				var deleteResult = await this.deleteVideo(video);
				if (deleteResult.err) {
					this.$message({
						message: deleteResult.err,
						type: 'warning'
					});
				} 

				try {
					let {
						data: res
					} = await API.deleteVideo(video.id) //注意async放在箭头函数而不是submitForm前
					//如果await后面是一个Promise对象，那么线程就会阻塞等待该异步任务完成，并且接受到了Promise对象的返回结果之后才会执行函数体后面部分的代码段
					// 等拿到返回数据res后再进行处理
					if (res.code != 0) {
						this.$notify.error({
							title: '删除视频失败',
							message: res.msg,
						});
					} else {
						this.loadVideoOfUser();
						this.$notify({
							title: '删除视频成功',
							type: 'success',
						});
					}
				} catch (err) {
					this.$notify.error({
						title: '网路错误，或者服务器宕机',
						message: err,
					});
				}

				// try {
				// 	let {
				// 		data: res
				// 	} = await API.deleteVideosOfUser(username)
				// 	if (res.code != 0) {
				// 		this.$message({
				// 			message: "获取视频列表失败",
				// 			type: "error",
				// 			showClose: true,
				// 		});
				// 	} else {
				// 		this.videos = res.data.items;
				// 		this.total = res.data.total;
				// 	}
				// } catch (err) {
				// 	this.$message({
				// 		message: "请求出错",
				// 		type: "error",
				// 		showClose: true,
				// 	});
				// }
			},
			goToUpdateideo(video){
				 this.$router.push({path: '/postvideo/upload', query: {type: 'edit',videoItem: video}})
			},

		},



		created() {
			this.loadVideoOfUser();
		},
	}
</script>

<style lang="scss">
	.article-list_wrap {
		height: 146px;
	}

	.article-card {
		position: relative;
		width: 100%;
		min-height: 140px;
		border-radius: 4px;
		background: #fff;
		padding: 24px 0;
		margin-bottom: 0;
		display: flex;
	}

	.pic-box {
		cursor: pointer;
		width: 154px;
		height: 96px;
		margin-right: 24px
	}

	.b-img-inner {
		width: 100%;
		height: 100%;
		display: inline-block;
		vertical-align: middle;
	}

	.meta-wrp {
		width: calc(100% - 178px - 200px);
		height: 100%;
		position: relative;
		color: #999;
		font-size: 16px;
	}

	.meta-title {
		color: #18191C;
		cursor: pointer;
		transition: .1s;
		display: block;
		height: 24px;
		line-height: 24px;
		padding: 0;
		text-overflow: ellipsis; //设置标签超出部分自动隐藏
	}

	.meta-title:hover {
		color: #afdaee;
	}

	.meta-date {
		padding: 16px 0 20px 0;
		font-size: 14px;
		color: #505050;
		line-height: 16px;
	}

	.meta-footer {
		font-size: 13px;
		color: #99a2aa;
	}

	.manage-btn {
		width: 200px;
		height: 96px;
		display: flex;
		justify-content: center;
		/*水平方向的居中*/
		align-items: center;
		/*垂直方向的居中*/
	}
</style>