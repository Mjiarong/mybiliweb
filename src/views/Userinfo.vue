<template>
	<div class="about">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>用户信息</span>
				<el-button style="float: right; padding: 3px 0" type="text" @click="logout()">登出</el-button>
			</div>
			<div class="text item">
				<p>{{'用户账号：' + userInfo.user_name}}</p>
				<p>{{'用户昵称：' + userInfo.nickname}}</p>
				<p>{{'注册时间：' + createdDate}}</p>
			</div>
		</el-card>
	</div>

</template>

<script>
	import {
		getInfo
	} from '@/api/user/user.js';
	import {
		getYMDHMS
	} from '@/api/utils/date.js';

	export default {

		data() {
			return {
				userInfo: {
					id: 1,
					nickname: '',
					user_name: '',
					created_at: 0,
					status: '',
				},
				createdDate: '',
			}
		},

		methods: {
			// 获取个人设置
			async load() {
				try {
					var username = window.sessionStorage.getItem('username')
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

			logout() {
				window.sessionStorage.removeItem('token')
				window.sessionStorage.removeItem('username')
				this.$router.push("/login")
			},
		},

		/*
		//设置组件路由守卫
		beforeRouteEnter(to, from, next) {
			const userToken = window.sessionStorage.getItem('token')
			if (!userToken) {
				// 注意，在路由进入之前，组件实例还未渲染，所以无法获取this实例，只能通过vm来访问组件实例
				next(vm => {
					vm.$router.push("/login");
					//vm.$router.go(0)
					//vm.$router.replace(from.path);//返回之前页面
					vm.$message.warning({
						showClose: false,
						message: '请先登录'
					});
				})
			} else {
				next()
			}
		},*/

		beforeMount() {
			this.load();
		},

	}
</script>

<style scoped>
	.box-card {
		width: 50%;
		height: 250px;
		margin: 1% auto;
	}
</style>