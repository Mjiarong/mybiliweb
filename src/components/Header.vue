<template>
	<div>
		<el-row class="bar-header" v-bind:class="{'bar-header-shadow':hasShadow}" type="flex" justify="space-around">
			<el-col :span="7">
				<BarHeaderLeft :colorVar="titleColorVar"></BarHeaderLeft>
			</el-col>

			<el-col :span="10">
				<div class="header-mid">
					<el-input class="search-item" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="input">
					</el-input>
				</div>
			</el-col>

			<el-col :span="7">
				<BarHeaderRight :loginVisible.sync="loginDialogVisible" :regVisible.sync="regDialogVisible"
					:colorVar="titleColorVar" :userInfo.sync="userInfo"></BarHeaderRight>
			</el-col>
		</el-row>
		<Login :loginVisible.sync="loginDialogVisible" :regVisible.sync="regDialogVisible" />
	</div>
</template>

<script>
	import Login from '@/views/Login.vue';
	import BarHeaderLeft from '@/components/HeaderBarLeft.vue';
	import BarHeaderRight from '@/components/HeaderBarRight.vue';
	import {
		getInfo
	} from '@/api/user/user.js';
	import {
		getYMDHMS
	} from '@/api/utils/date.js';
	import {
		reSetItem,
		reMoveItem
	} from '@/api/utils/watchStorage.js';
	export default {
		name: 'Header',
		components: {
			Login,
			BarHeaderLeft,
			BarHeaderRight,
		},
		data() {
			return {
				hasShadow: false,
				titleColorVar: "#18191c",
				userInfo: {},
				input: '',
				loginDialogVisible: false,
				loginPopVisible: false,
				regDialogVisible: false,
				userName: window.sessionStorage.getItem('username'),
				headerType: 'LargeHeader',
			};
		},

		methods: {
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
						this.createdDate = getYMDHMS(res.data.created_at);
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
		},


		watch: { // 简单监听
			$route: {
				handler: function(route) {
					if (route.name === 'home') {
						this.titleColorVar = '#ffffff';
						this.hasShadow = false;
					} else {
						this.titleColorVar = '#18191c';
						this.hasShadow = true;
					}
				},
				immediate: true
			}
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
		},
		beforeDestroy() {
			// 移除对 sessionStorage 的监听
			window.removeEventListener("setItem", () => {});
			window.removeEventListener("removeItem", () => {});
		},
	}
</script>

<style lang="scss" scoped>
	.bar-header {
		display: flex;
		box-sizing: border-box;
		border-bottom: none;
		position: absolute;
		width: 100%;
		//overflow: visible;
		min-width: var(--home-container-min-width);
		//min-width: 1220px;
		height: 64px;
		line-height: 1.6;
	}

	.bar-header-shadow {
		box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		position: fixed;
		top: 0;
		z-index: 1002;
		background-color: white;
	}

	.header-mid {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		//min-width: 200px;
	}


	.el-input.search-item {
		width: 80%;
	}

	/deep/.el-input__icon {
		color: #18191C;
	}


	// 改变input里的字体颜色
	/deep/input::-webkit-input-placeholder {
		color: #61666d;
	}

	/deep/.el-input__inner {
		// 设置输入字体的颜色
		color: #61666d;
		background: #e3e5e7;
	}
</style>