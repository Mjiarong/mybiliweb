<template>
	<div class="header-channel">
		<el-row class="header-channel-row" type="flex" justify="space-between" align="middle">
			
			<el-col :span="4">
				<el-row class="channel-icons" type="flex" justify="space-between">
					<el-col :span="6">
						<a class="channel-icons-item" href="">

							<div class="icon-bg icon-bg-dynamic">
								<i class="el-icon-news"></i>
							</div>
							<span class="icon-title">动态</span>
						</a>
					</el-col>
					<el-col :span="6">
						<a class="channel-icons-item" href="">
							<div class="icon-bg icon-bg-dynamic">
								<i class="el-icon-s-data"></i>
							</div>
							<span class="icon-title">热门</span>
						</a>
					</el-col>
					<el-col :span="6">
						<a class="channel-icons-item" href="">
							<div class="icon-bg icon-bg-dynamic">
								<i class="el-icon-files"></i>
							</div>
							<span class="icon-title">频道</span>
						</a>
					</el-col>
				</el-row>
			</el-col>

			<el-col :span="15">
				<div class="channel-btns">
					<el-button class="channel-btn" size="mini" type="info" plain>番剧</el-button>
					<el-button class="channel-btn" size="mini" type="info" plain>电影</el-button>
					<el-button class="channel-btn" size="mini" type="info" plain>国创</el-button>
					<el-button class="channel-btn" size="mini" type="info" plain>电视剧</el-button>
					<el-button class="channel-btn" size="mini" type="info" plain>综艺</el-button>
					<el-button class="channel-btn" size="mini" type="info" plain>纪录片</el-button>
					<el-button class="channel-btn" size="mini" type="info" plain>动画</el-button>
					<el-button class="channel-btn" size="mini" type="info" plain>游戏</el-button>
					<el-button class="channel-btn" size="mini" type="info" plain>鬼畜</el-button>
					<el-button class="channel-btn" size="mini" type="info" plain>音乐</el-button>
				</div>
				<div class="channel-btns">
					<el-button class="channel-btn" size="mini" type="info" plain>舞蹈</el-button>
					<el-button class="channel-btn" size="mini" type="info" plain>影视</el-button>
					<el-button class="channel-btn" size="mini" type="info" plain>娱乐</el-button>
					<el-button class="channel-btn" size="mini" type="info" plain>知识</el-button>
					<el-button class="channel-btn" size="mini" type="info" plain>科技</el-button>
					<el-button class="channel-btn" size="mini" type="info" plain>资讯</el-button>
					<el-button class="channel-btn" size="mini" type="info" plain>美食</el-button>
					<el-button class="channel-btn" size="mini" type="info" plain>生活</el-button>
					<el-button class="channel-btn" size="mini" type="info" plain>汽车</el-button>
					<el-button class="channel-btn" size="mini" type="info" plain>运动</el-button>
				</div>
			</el-col>
			
			<el-col :span="5">
				<el-row class="channel-links-right" type="flex" justify="space-between">
					<el-col :span="8">
						<el-link class="channel-link-item" icon="el-icon-s-order" :underline="false">专栏</el-link>
					</el-col>
					<el-col :span="8">
						<el-link class="channel-link-item" icon="el-icon-s-flag" :underline="false">活动</el-link>
					</el-col>
					<el-col :span="8">
						<el-link class="channel-link-item" icon="el-icon-s-comment" :underline="false">社区中心</el-link>
					</el-col>
				</el-row>
				<el-row class="channel-links-right" type="flex" justify="space-between" :underline="false">
					<el-col :span="8">
						<el-link class="channel-link-item" icon="el-icon-video-camera-solid" :underline="false">直播</el-link>
					</el-col>
					<el-col :span="8">
						<el-link class="channel-link-item" icon="el-icon-s-opportunity" :underline="false">课堂</el-link>
					</el-col>
					<el-col :span="8">
						<el-link class="channel-link-item" icon="el-icon-s-marketing" :underline="false">新歌热榜</el-link>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
	</div>
</template>

<script>

</script>

<style scoped lang="scss">
	.header-channel {
		padding-left: var(--home-container-padding);
		padding-right: var(--home-container-padding);
		height: 110px;
	}

	.header-channel-row {
		min-width: var(--home-container-min-width);
		//margin: 0 6%;
	}

	.el-row {
		margin-bottom: 20px;
		height: 100%;

		//:last-child 选择器匹配属于其父元素的最后一个子元素的每个元素。
		//& 表示嵌套的上一级，这是sass的语法
		&:last-child {
			margin-bottom: 0;
		}
	}

	.el-col {
		border-radius: 4px;
	}

	.channel-icons {
		//min-width: 130px;
	}


	.icon-bg {
		display: flex;
		align-items: center;
		justify-content: center;
		width: calc(35px + 0.390625vw);
		height: calc(35px + 0.390625vw);
		border-radius: 50%;
		transition: background .3s;
	}


	.icon-bg-dynamic {
		background: #ff9212;
	}

	.el-icon-news {
		font-size: clamp(16px, calc(14px + 0.390625vw), 20px);
		color: #fff;
	}

	.el-icon-s-data {
		font-size: clamp(16px, calc(14px + 0.390625vw), 20px);
		color: #fff;
	}

	.el-icon-files {
		font-size: clamp(16px, calc(14px + 0.390625vw), 20px);
		color: #fff;
	}

	.icon-title {
		width: calc(35px + 0.390625vw);
		text-align: center;
		font-weight: 400;
		font-style: normal;
		font-size: clamp(12px, calc(8px + 0.390625vw), 14px);
	}

	.channel-icons-item {
		position: relative;
		display: flex;
		flex-direction: column;
		color: #18191c;
		text-decoration: none;
		background-color: transparent;
	}

	.channel-btn {
		width: 8.5%;
		height: 45%;
		text-align: center;
		font-size: clamp(12px, calc(8px + 0.390625vw), 14px);
		font-weight: 400;
		border: 1px solid #f1f2f3;
		border-radius: 6px;
		background-color: #f6f7f8;
		color: #61666d;
		margin: auto;
	}

	.channel-btns {
		width: 100%;
		margin: 5px 0;
	}


	.el-link.channel-link-item {
		width: 100%;
		font-size: clamp(12px, calc(9px + 0.36vw), 16px);
		font-weight: 500;
	}


	.channel-links-right {
		margin:auto;
	}
</style>