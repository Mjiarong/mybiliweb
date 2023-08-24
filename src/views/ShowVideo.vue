<template>
	<el-row :gutter="20" class="video-container" type="flex" justify="center">
		<el-col :xs="17" :sm="17" :md="17" :lg="17" :xl="15">
			<div class="left-container">
				<div class="video-info">
					<h2>{{video.title}}</h2>
					<span class="view-item">
						<i class="el-icon-video-play"></i>
						{{video.view}}
					</span>
					<span class="view-item">
						<i class="el-icon-chat-dot-square"></i>
						{{video.comments_num}}
					</span>
					<span class="view-item">
						{{ $moment.unix(video.created_at).format("YYYY-MM-DD HH:mm:ss")}}
					</span>
					<span class="view-item">
						<i class="el-icon-warning"></i>
						未经作者授权，禁止转载
					</span>
				</div>
				<div class="player-wrap" @keyup="keyup($event)">
					<video-player ref="videoPlayer" class="video-player-box vjs-big-play-centered" :options="playerOptions">
					</video-player>
				</div>
				<div class="video-toolbar-container">
					<el-button type="text" icon="el-icon-thumb" class="video-toolbar-left-item" :style="colorStyleLike"
						@click="addLikes(video.id,userInfo.id);">{{likeNums}}</el-button>
					<el-button type="text" icon="el-icon-star-on" class="video-toolbar-left-item" :style="colorStyle"
						@click="">{{collectNums}}</el-button>
					<el-button type="text" icon="el-icon-share" class="video-toolbar-left-item" :style="colorStyle"
						@click="">{{transmitNums}}</el-button>
				</div>
				<div class="desc-info">
					{{video.info}}
				</div>

				<div class="comment">
					<VideoComment :commentVideoID="videoID" :userInfo="userInfo"></VideoComment>
				</div>

			</div>
		</el-col>
		<el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
			<div class="right-container">

				<div class="up-info-container">
					<div class=" up-info-left">
						<el-avatar :size="48" :src="upInfo.avatar" class="user-avatar"></el-avatar>
					</div>
					<div class="up-info-right">
						<div class="up-info-detail">
							<span class="up-name">
								{{upInfo.nickname}}
							</span>
							<span class="send-msg">
								<i class="el-icon-s-promotion"></i>
								发消息
							</span>
							<div class="up-description">
								这个up主很懒，什么描述都没有写。
							</div>
						</div>
						<div class="up-info-btn-panel">
							<el-button class="default-btn new-charge-btn" plain icon="el-icon-s-opportunity">
								充电</el-button>
							<el-button class="default-btn follow-btn" type="primary" icon="el-icon-plus">
								关注</el-button>
						</div>
					</div>
				</div>

				<div class="rec-list">
					<el-divider></el-divider>
					<el-card class="box-card">
						<div class="video-page-card-small" v-for="video in videos" :key="video.id">
							<div class="card-box">
								<div class="pic-box" @click="playVideo(video.id)">
									<img class="b-img-inner" :src="video.avatar_url">
								</div>
								<div class="info">
									<el-button class="video-title" type="text" @click="playVideo(video.id)">{{video.title}}</el-button>
									<el-button class="upname" type="text" icon="el-icon-user">
										{{video.user.nickname}}</el-button>
									<div class="playinfo">
										<span class="playinfo-items" style="margin-right: 10px;">
											<i class="el-icon-video-play"></i>
											{{video.view}}
										</span>
										<span class="playinfo-item">
											<i class="el-icon-chat-dot-square"></i>
											{{video.comments_num}}
										</span>
									</div>
								</div>
							</div>
						</div>
					</el-card>
				</div>

			</div>
		</el-col>
		<Login :loginVisible.sync="loginDialogVisible" :regVisible.sync="regDialogVisible" />
	</el-row>
</template>

<script>
	import Login from '@/views/Login.vue';
	import 'video.js/dist/video-js.css';
	import VideoComment from '@/components/VideoComment.vue';
	import {
		videoPlayer
	} from 'vue-video-player';
	import {
		getInfo
	} from '@/api/user/user.js';
	import * as API from '@/api/video/video.js';

	export default {
		name: 'ShowVideo',
		components: {
			VideoComment,
			videoPlayer,
			Login,
		},
		props: ['videoID'],
		inject: ["routerReload"],
		data() {
			return {
				loginDialogVisible: false,
				regDialogVisible: false,
				textarea: '',
				video: {},
				videos: [],
				total: 0,
				likeNums: 0,
				collectNums: 20,
				transmitNums: 30,
				start: 0,
				limit: 6,
				userInfo: {},
				playInfo: {},
				upInfo: {}, //视频up主的信息
				playerOptions: {
					playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
					autoplay: false,
					language: "zh-CN",
					width: "1280px",
					height: "720px",
					preload: 'none', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。
					aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。
					fluid: true, // 是否流体从而按比例缩放以适应其容器。
					sources: [{
						type: "video/mp4",
						src: '',
						//src: "https://mybili-1312334998.cos.ap-guangzhou.myqcloud.com/video/loading/%E6%AD%A3%E5%9C%A8%E5%8A%A0%E8%BD%BD%E4%B8%AD.mp4",
					}],
					poster: '', //封面地址
					controls: true, // 是否显示操作条
					controlBar: {
						volumeControl: true, // 声音控制键
						// 播放的操作
						timeDivider: true, // 时间分割线
						durationDisplay: true, // 总时间
						remainingTimeDisplay: false,
						fullscreenToggle: true, //全屏按钮
					}
				},
			};
		},

		computed: {
			colorStyleLike() {
				return {
					'--buttonColor': this.colorVarLike
				}
			},
			colorVarLike() {
				if (this.playInfo.Liked) {
					return '#00aeec'
				} else {
					return '#61666d'
				}
			},
			colorStyle() {
				return {
					'--buttonColor': this.colorVar
				}
			},
			colorVar() {
				return '#61666d'
			},
		},
		methods: {
			async loadVideoInfo() {
				try {
					let {
						data: res
					} = await API.getVideo(this.videoID)
					if (res.code != 0) {
						this.$message({
							message: "获取数据失败",
							type: "error",
							showClose: true,
						});
					} else {
						this.video = res.data;
						this.playerOptions.sources[0].src = res.data.video_url;
						this.playerOptions.poster = res.data.avatar_url;
						this.likeNums = res.data.likes_num;
						this.upInfo = res.data.user;
					}
				} catch (err) {
					this.$message({
						message: "请求出错",
						type: "error",
						showClose: true,
					});
				}

				try {
					let {
						data: res
					} = await API.getVideos(this.start, this.limit)
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

			// 获取个人设置
			async loadUserInfo() {
				var username = window.sessionStorage.getItem('username')
				if (!username) {
					return false
				}
				try {
					let {
						data: res
					} = await getInfo(username)
					if (res.code != 0) {
						this.$message({
							message: "获取个人信息失败",
							type: "error",
							showClose: true,
						});
					} else {
						this.userInfo = res.data;
						this.queryPlayInfo(this.videoID, this.userInfo.id)
					}
				} catch (err) {
					console.log(err)
					this.$message({
						message: "请求出错",
						type: "error",
						showClose: true,
					});
				}
			},

			async addLikes(videoID, userID) {
				//没有登录便按下点赞，弹出登录框
				if (JSON.stringify(this.userInfo) === '{}') {
					this.loginDialogVisible = true
					return
				}
				try {
					let res = await API.addVideoLikes(videoID, userID)
					if (res.data.code != 0) {} else {
						if (this.playInfo.Liked) {
							this.likeNums -= 1; //说明用户取消点赞了
						} else {
							this.likeNums += 1;
						}
						this.queryPlayInfo(videoID, userID)
					}
				} catch (err) {}
			},

			async queryPlayInfo(videoID, userID) {
				try {
					let res = await API.playInfoQuery(parseInt(videoID), userID)
					if (res.data.code != 0) {} else {
						this.playInfo = res.data.data;
					}
				} catch (err) {}
			},

			playVideo(id) {
				this.$router.push({
					name: 'showVideo',
					params: {
						videoID: id
					}
				});
				this.routerReload();
			},

			keyup(key) {
				console.log('videoPlayer', this.$refs.videoPlayer)
				var vol = 0.1 //1代表100%音量，每次增减0.1
				var time = 10 //单位秒，每次增减10秒
				// 按向上键
				if (key.keyCode == 38) {
					this.$refs.videoPlayer.player.cache_.lastVolume !== 1 ?
						(this.$refs.videoPlayer.player.cache_.lastVolume += vol) :
						1
					this.$refs.videoPlayer.player.volume(
						this.$refs.videoPlayer.player.cache_.lastVolume
					)
				}
				// 按向下键
				if (key.keyCode == 40) {
					this.$refs.videoPlayer.player.cache_.lastVolume !== 0 ?
						(this.$refs.videoPlayer.player.cache_.lastVolume -= vol) :
						1
					this.$refs.videoPlayer.player.volume(
						this.$refs.videoPlayer.player.cache_.lastVolume
					)
				}
				// 按左键
				if (key.keyCode == 37) {
					this.$refs.videoPlayer.player.cache_.currentTime !== 0 ?
						(this.$refs.videoPlayer.player.cache_.currentTime -= time) :
						1
					this.$refs.videoPlayer.player.currentTime(
						this.$refs.videoPlayer.player.cache_.currentTime
					)
				}
				// 按右键
				if (key.keyCode == 39) {
					this.$refs.videoPlayer.player.cache_.currentTime !==
						this.$refs.videoPlayer.player.cache_.duration ?
						(this.$refs.videoPlayer.player.cache_.currentTime += time) :
						1
					this.$refs.videoPlayer.player.currentTime(
						this.$refs.videoPlayer.player.cache_.currentTime
					)
				}
			},
		},
		created() {
			window.addEventListener('setItem', () => {
				this.userName = sessionStorage.getItem('username');
				if (this.userName) {
					this.loadUserInfo();
				}
			});
			window.addEventListener('removeItem', () => {
				this.userName = sessionStorage.getItem('username');
				this.userInfo = {};
			});
			this.loadUserInfo();
			this.loadVideoInfo();
		},
	};
</script>

<style scoped lang="scss">
	.video-container {
		max-width: 2540px;
		min-width: 1440px;
		margin: 0 !important;
		padding: 0 10px;
		font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;
		font-weight: 400;
		-webkit-font-smoothing: antialiased;
		z-index: 1000;
	}

	.left-container {
		line-height: 1.6;
	}

	.video-info {
		font-size: 12px;
		color: #999;
	}

	.video-info h2 {
		font-size: clamp(20px, calc(18px + 0.2vw), 22px);
		font-weight: 500;
		color: #18191C;
		margin-bottom: 6px;
		margin-top: 0;
		//overflow: hidden;
		white-space: nowrap; //设置文本不换行
		text-overflow: ellipsis; //设置标签超出部分自动隐藏
	}

	.view-item {
		text-overflow: ellipsis;
		white-space: nowrap;
		//overflow: hidden;
		display: inline-flex;
		flex-shrink: 0;
		margin-right: 12px;
		font-size: clamp(13px, calc(13px + 0.05vw), 14px);
		color: #9499A0;
		align-items: center;
		//height: 24px;
		position: relative;
	}

	.player-wrap {
		margin-top: 10px;
	}

	.desc-info {
		margin: 16px 0;
		position: relative;
		font-size: clamp(15px, calc(15px + 0.6vw), 16px);
		color: #18191C;
	}

	.video-toolbar-container {
		display: flex;
		align-items: center;
		//justify-content: space-between;
		padding-top: 16px;
		padding-bottom: 12px;
		line-height: 28px;
		border-bottom: 1px solid #E3E5E7;
	}


	.video-toolbar-left-item {
		position: relative;
		padding: 0;
		display: -ms-flexbox;
		display: flex;
		-ms-flex-align: center;
		align-items: center;
		width: 92px;
		white-space: nowrap;
		transition: all .3s;
		font-size: 22px;
		font-size: clamp(18px, calc(17px + 0.2vw), 22px);
		/* 	color: #61666d; */
		color: var(--buttonColor);
		font-weight: 500;
	}




	.right-container {
		display: block;
	}

	.up-panel-container {
		display: block;
	}

	.up-info-container {
		display: flex;
		line-height: 1.5;
		align-items: center; //使子元素垂直居中
	}

	.up-info-left {
		display: block;
		border-radius: 50%;
		position: relative;
		margin-left: 12px;
		width: 48px;
		height: 48px;
		flex-shrink: 0;
	}

	.up-info-right {
		display: block;
		margin-left: 12px;
		flex: 1;
	}

	.up-info-detail {
		margin-bottom: 5px;
	}

	.up-name {
		color: #FB7299;
		font-weight: 500;
		position: relative;
		white-space: nowrap;
		text-overflow: ellipsis;
		//overflow: hidden;
		margin-right: 12px;
		font-size: clamp(15px, calc(15px + 0.06vw), 16px);

	}

	.send-msg {
		color: #61666D;
		font-size: clamp(13px, calc(13px + 0.06vw), 14px);
		transition: color 0.3s;
		flex-shrink: 0;
	}

	.up-description {
		display: block;
		margin-top: 2px;
		font-size: 13px;
		font-size: clamp(13px, calc(13px + 0.06vw), 14px);
		line-height: 16px;
		height: 16px;
		color: #9499A0;
		//overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.up-info-btn-panel {
		display: block;
		margin-top: 5px;
		//min-width: 305px;
	}

	.default-btn {
		box-sizing: border-box;
		padding: 0;
		line-height: 30px;
		height: 30px;
		border-radius: 6px;
		font-size: 14px;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		background: #C9CCD0;
		position: relative;
		transition: 0.3s all;
	}

	.new-charge-btn {
		background-color: transparent;
		border: 1px solid #FF6699;
		margin-right: 12px;
		flex-shrink: 0;
		width: calc(40% - 12px);
		color: #FF6699;
	}

	.follow-btn {
		background: #00AEEC;
		color: #ffffff;
		flex: 1 1 auto;
		width: 60%;
		//min-width: 150px;
	}

	.rec-list {
		margin-top: 18px;
		display: block;
	}

	.video-page-card-small {
		display: block;
		margin-bottom: 12px;
	}

	.video-page-card-small .card-box {
		display: flex;
	}

	.pic-box {
		position: relative;
		width: 40%;
		aspect-ratio: 16/10; //长宽比
		border-radius: 6px;
		background: #C9CCD0;
		flex: 0 0 auto;
		cursor: pointer;
	}

	.b-img-inner {
		width: 100%;
		height: 100%;
		display: inline-block;
		vertical-align: middle;
	}

	.info {
		margin-left: 10px;
		flex: 1;
		font-size: 13px;
		line-height: 15px;
		display: block;
	}

	.video-title {
		color: #18191C;
		display: block;
		line-height: 19px;
		//overflow: hidden;
		padding: 0;
		font-size: clamp(15px, calc(14px + 0.06vw), 16px);
		//font-size:16px;
		text-overflow: ellipsis; //设置标签超出部分自动隐藏
	}

	.el-button+.el-button {
		margin-left: 0 !important;
	}

	.upname {
		padding: 0;
		margin: 2px 0;
		height: 20px;
		display: block;
		font-size: 13px;
		color: #9499A0;
		display: block;
	}

	.playinfo {
		color: #9499A0;
		display: inline-flex;
		align-items: center;
		font-size: 13px;
		height: 20px;
		border: 1px solid #ffffff;
	}
</style>