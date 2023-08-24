<template>
	<div class="videoBoxRight">
		<el-row :gutter="20">
			<el-col :span="8" v-for="(item,index) in videos" v-if="index<3">
				<div class="video-card">
					<div class="video-card-image-warp">
						<img class="video-card-image" :src="item.avatar_url">
					</div>
					<div class="video-card-mask" @click="playVideo(item.id)">
						<div class="video-card-stats">
							<div class="video-card-stats-left">
								<span class="video-card-stats-item">
									<i class="el-icon-video-play"></i>
									{{item.view}}
								</span>
								<span class="video-card-stats-item">
									<i class="el-icon-chat-dot-square"></i>
									{{item.comments_num}}
								</span>
							</div>
							<span class="video-card-stats-duration">
								{{formatDuration(item.duration)}}
							</span>
						</div>
					</div>
					<div class="video-card-info">
						<h3 class="video-card-info-tit">
							{{item.title}}
						</h3>
						<div class="video-card-info-bottom">
							<el-button class="upname" type="text" icon="el-icon-user">
								{{item.user.nickname}}·{{ $moment.unix(item.created_at).format("YYYY-MM-DD")}}</el-button>
						</div>
					</div>
				</div>
			</el-col>
			<el-col :span="8" v-for="(item,index) in videos" v-if="index>2&&index<6">
				<div class="video-card">
					<div class="video-card-image-warp">
						<img class="video-card-image" :src="item.avatar_url">
					</div>
					<div class="video-card-mask" @click="playVideo(item.id)">
						<div class="video-card-stats">
							<div class="video-card-stats-left">
								<span class="video-card-stats-item">
									<i class="el-icon-video-play"></i>
									{{item.view}}
								</span>
								<span class="video-card-stats-item">
									<i class="el-icon-chat-dot-square"></i>
									{{item.comments_num}}
								</span>
							</div>
							<span class="video-card-stats-duration">
								{{formatDuration(item.duration)}}
							</span>
						</div>
					</div>
					<div class="video-card-info">
						<h3 class="video-card-info-tit">
							{{item.title}}
						</h3>
						<div class="video-card-info-bottom">
							<el-button class="upname" type="text" icon="el-icon-user">
								{{item.user.nickname}}·{{ $moment.unix(item.created_at).format("YYYY-MM-DD")}}</el-button>
						</div>
					</div>
				</div>
			</el-col>
		</el-row>

	</div>
</template>

<script>
	import {
		formatSeconds
	} from '@/api/utils/time.js';

	export default {
		name: 'videoBoxRight',
		props: {
			videos: Array,
		},
		data() {
			return {
				video: [{
					id: 0,
					title: "",
					info: "",
					avatar: " ",
					created_at: 1685072257,
					title: "",
					url: "",
					user: {
						id: 0,
						user_name: "",
						nickname: "2",
						status: "",
						avatar: "",
						created_at: 0,
					},
					view: 0,
				}],
			};
		},
		methods: {
			playVideo(id) {
				console.log(typeof id);
				let routeData = this.$router.resolve({
					name: "showVideo",
					params: {
						videoID: id
					}
				});
				window.open(routeData.href, '_blank');
			},

			formatDuration(value) {
				return formatSeconds(value);
			},
		}
	}
</script>

<style lang="scss">
	.video-card {
		width: 100%;

		position: relative;
		--title-font-size: 15px;
		--title-line-height: 22px;
		--title-padding-right: 16px;


		--subtitle-font-size: 13px;
		--subtitle-line-height: 17px;
		--info-margin-top: 8px;
		--avatar-size: 36px;
		--avatar-margin-right: 8px;
		--icon-size: 18px;
		--follow-icon-font-size: 12px;
		--follow-icon-line-height: 17px
	}

	.video-card-image-warp {
		aspect-ratio: 48/31;
		width: 100%;
	}

	.video-card-image {
		width: 100%;
		height: 100%;
		border-radius: 3px;
		cursor: pointer;
		//aspect-ratio: 8/5;
	}

	.video-card-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		aspect-ratio: 48/31;
		opacity: 1;
		transition: all .2s linear .2s;
		font-size: var(--subtitle-font-size);
		line-height: var(--icon-size);
		font-weight: 400;
		font-style: normal;
		cursor: pointer;
	}

	.video-card-stats {
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 2;
		box-sizing: border-box;
		padding: 16px 8px 6px;
		width: 100%;
		height: 38px;
		border-bottom-right-radius: 6px;
		border-bottom-left-radius: 6px;
		background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .8) 100%);
		color: #fff;
		font-size: var(--subtitle-font-size);
		line-height: var(--icon-size);
		opacity: 1;
		display: -webkit-flex;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.video-card-stats-left {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.video-card-stats-item {
		margin-right: 12px;
		align-items: flex-start;
		justify-content: center;
	}


	.video-card-info {
		margin-top: 5px;
	}

	.video-card-info-tit {
		border: 0;
		margin: 0;
		padding: 0;

		font-style: normal;
		transition: color .2s linear;
		cursor: pointer;
		font-weight: 500;

		padding-right: var(--title-padding-right);
		color: #18191c;
		font-size: var(--title-font-size);
		line-height: var(--title-line-height);
		height: calc(2 * var(--title-line-height));

		text-align: left;
		overflow: hidden; //溢出内容隐藏
		text-overflow: ellipsis; //文本溢出部分用省略号表示
		display: -webkit-box; //将对象作为弹性伸缩盒子模型显示。
		-webkit-box-orient: vertical; //盒子中内容竖直排列
		-webkit-line-clamp: 2; //行数
		line-clamp: 2;

	}

	.video-card-info-bottom .el-button {
		padding: 0;
		margin: 2px 0;
		height: 20px;
		font-size: 13px;
		display: block;
		color: #9499a0;
	}

	.upname:hover {
		//filter: brightness(1.3);
	}
</style>