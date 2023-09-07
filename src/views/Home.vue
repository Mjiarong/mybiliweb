<template>
	<div class="home-container">
		<el-row :gutter="20">
			<el-col class="carousel-container" :span="10">
				<el-carousel>
					<el-carousel-item v-for="(item,index) in carouselData" v-if="index<4">
						<img class="carousel-video-avatar" :src="item.avatar_url" @click="playVideo(item.id)">
						<h3 class="small">{{ item.title }}</h3>
					</el-carousel-item>
				</el-carousel>
			</el-col>
			<el-col class="video-card-container" :span="14">
				<videoBoxRight :videos="videos"></videoBoxRight>
			</el-col>
		</el-row>
		<div class="feed-roll-btn">
			<i class="el-icon-refresh-right"></i>
			<div class="feed-roll-btn-text" @click="loadVideoList()">换一换</div>
		</div>
	</div>

	<!-- 
		<el-aside width="300">
			<h1><i class="el-icon-top"></i>每日热门</h1>
			<el-table :data="rankData" stripe style="width: 100%" @cell-click="cellHandleclick">
				<el-table-column type="index" label="排名" width="80">
				</el-table-column>
				<el-table-column prop="title" label="视频" width="220">
				</el-table-column>
			</el-table>
		</el-aside>
-->



</template>

<script>
	import * as API from '@/api/video/video.js';
	import uplpadAPI from '@/api/rank/rank.js';
	import videoBoxRight from '@/components/HomeVideoBoxRight.vue';


	export default {
		name: 'home',
		data() {
			return {
				videos: [{
					id: 0,
					title: "",
					info: "",
					avatar_url: "",
					video_url: "",
					created_at: 0,
					title: "",
					user: {
						id: 0,
						user_name: "",
						nickname: "",
						status: "",
						avatar: "",
						created_at: 0,
					},
					view: 0,
				}],
				carouselData: [], //存放走马灯数据
				start: 0,
				limit: 6,
				total: 0,
				rankData: [],
			};
		},

		components: {
			videoBoxRight
		},

		methods: {
			async loadVideoList() {
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
						if (this.carouselData.length === 0) {//走马灯的数据加载一次即可，刷新无须修改
							this.carouselData = res.data.items;
						}
					}
				} catch (err) {
					this.$message({
						message: "请求出错",
						type: "error",
						showClose: true,
					});
				}

				/*
								try {
									let {
										data: res
									} = await uplpadAPI()
									if (res.code != 0) {
										this.$message({
											message: "获取排行榜数据失败",
											type: "error",
											showClose: true,
										});
									} else {
										this.rankData = res.data;
									}
								} catch (err) {
									this.$message({
										message: "获取排行榜数据请求出错",
										type: "error",
										showClose: true,
									});
								}
								*/
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
			cellHandleclick(row, column, cell, event) {
				this.playVideo(row.id);
			},
		},
		created() {
			this.loadVideoList();
		},
	};
</script>

<style scoped lang="scss">
	.home-container {
		position: relative;
		min-width: var(--home-container-min-width);
		padding-left: var(--home-container-padding);
		padding-right: var(--home-container-padding);
		font-family: PingFang SC,
			HarmonyOS_Regular,
			Helvetica Neue,
			Microsoft YaHei,
			sans-serif !important;
	}

	.carousel-container {
		//min-width: 536px;
	}

	.el-carousel--horizontal {
		//min-height: calc(516px/7*5);
		//min-width: 516px;
		aspect-ratio: 7/5;
		height: 100%;
		border-radius: 5px;
	}

	.el-carousel /deep/ .el-carousel__container {
		height: 100%;
		//min-height: calc(516px/7*5);
	}

	.el-carousel__item h3 {
		color: white;
		font-size: clamp(18px, calc(14px + 0.390625vw), 20px);
		margin: 0;
		align-items: center;
		position: absolute;
		bottom: 10%;
		left: 5%;
	}

	.carousel-video-avatar {
		width: 100%;
		height: 100%;
		background-size: cover;
		z-index: -1;
		background-attachment: fixed;
		background-repeat: no-repeat;
		cursor: pointer;
	}

	.video-card-container {
		//min-width: 600px;
	}


	.feed-roll-btn-text {
		width: 20px;
		line-height: 23px;
		//对文字对象宽度设置只能排下一个文字的宽度距离，
		//使其文字自动换行，就形成了竖立排版需求。
		font-weight: 500;
		text-align: center;
		margin: 0 auto
	}


	.feed-roll-btn:hover {
		background-color: gainsboro;
	}

	.feed-roll-btn {
		position: absolute;
		right: calc(var(--home-container-padding) - 40px);
		top: 0;
		cursor: pointer;
		width: 40px;
		transform: translate(10px);
		border: 2px solid #e3e5e7;
		border-radius: 8px;
		text-align: center;
	}
</style>