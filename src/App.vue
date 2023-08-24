<template>
	<div id="app">
		<el-container class="app-wrapper">
			<el-header class="large-header">
				<LargeHeader />
			</el-header>
			<el-main>
				<router-view v-if="isRouterAlive"></router-view>
			</el-main>
		</el-container>
	</div>
</template>

<script>
	import LargeHeader from '@/components/LargeHeader.vue'; //导入需要使用的组件
	export default {
		name: 'App',
		components: {
			LargeHeader, //相当于'Header':Header的简写
		},
		provide() {
			return {
				routerReload: this.reload
			};
		},
		data() {
			return {
				isRouterAlive: true
			};
		},
		methods: {
			//解决this.$router.push到同一个页面但是参数不同页面不刷新的问题
			//通过v-if去销毁再生成一次dom
			reload() {
				this.isRouterAlive = false;
				this.$nextTick(() => (this.isRouterAlive = true));
			}
		},
	};
</script>


<style>
	html,
	body,
	#app {
		height: 100%;
	}

	.app-wrapper {
		height: 100%;
		font-size: 14px;
		line-height: 1.25;
		text-align: left;
		font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif !important;
		--home-container-min-width: 1120px;

		@media (min-width: 1200px) {
			--home-container-padding: 40px;
		}

		@media (min-width: 1400px) {
			--home-container-padding: 80px;
		}

		@media (min-width: 1600px) {
			--home-container-padding: 120px;
		}

		@media (max-width: 1199.9px) {
			--home-container-padding: 20px;
		}

	}

	.el-header.large-header {
		padding: 0;
		min-height: 64px;
		height: auto !important;
		position: relative;
		margin: 0 auto;
		max-width: 2560px;
		width: 100%;
	}


	.el-main {
		width: 100%;
		height: 100%;
		padding: 0px !important;
		overflow: visible !important;
	}
</style>