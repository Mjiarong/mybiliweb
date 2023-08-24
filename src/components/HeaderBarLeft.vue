<template>
	<div class="bar-header-left-container" :style="styleVar">
		<el-row class="bar-header-left" type="flex" justify="space-around">
			<el-col :span="4">
				<div class="left-menu-item">
					<span><svg-icon icon-class="xiaodianshi" className="iconSmall"></svg-icon>
					</span>
					<el-link :underline="false" class="single-left-item" @click="backToMain()">首页</el-link>
				</div>
			</el-col>

			<el-col :span="3">
				<div class="left-menu-item">
					<el-link :underline="false" class="single-left-item">番剧</el-link>
				</div>
			</el-col>

			<el-col :span="3">
				<div class="left-menu-item">
					<el-link :underline="false" class="single-left-item">直播</el-link>
				</div>
			</el-col>


			<el-col :span="5">
				<div class="left-menu-item">
					<el-link :underline="false" class="single-left-item">游戏中心</el-link>
				</div>
			</el-col>


			<el-col :span="4">
				<div class="left-menu-item">
					<el-link :underline="false" class="single-left-item">会员购</el-link>
				</div>
			</el-col>


			<el-col :span="3">
				<div class="left-menu-item">
					<el-link :underline="false" class="single-left-item">漫画</el-link>
				</div>
			</el-col>


			<el-col :span="3">
				<div class="left-menu-item">
					<el-link :underline="false" class="single-left-item">赛事</el-link>
				</div>
			</el-col>
		</el-row>
	</div>

</template>

<script>
	export default {
		name: 'barHeaderLeft',
		props: {
			colorVar: {
				type: String,
				default: '',
			},
		},
		computed: {
			styleVar() {
				return {
					'--titleColor': this.colorVar
				}
			}
		},
		methods: {
			backToMain() {
				this.$router.push("/");
			},
		},
	}
</script>

<style scoped>
	.bar-header-left-container {
		display: flex;
		position: relative;
		flex-direction: row;
		height: 100%;
		line-height: 1.25;
		background: transparent;
		padding: 0;
	/* 	min-width: 400px; */
		color: var(--titleColor);
	}

	.bar-header-left {
		width: 100%;
	}

	.left-menu-item {
		display: flex;
		height: 64px;
		line-height: 64px;
		font-size: 13.5px;
		/*上下,左右内边距*/
		padding: 0px;
		list-style: none;
		cursor: pointer;
		position: relative;
		justify-content: center;
	}

	.el-link.single-left-item {
		color: var(--color1);
	}
</style>