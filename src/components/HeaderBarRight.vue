<template>
	<div class="bar-header-right-container" :style="styleVar">
		<template v-if="JSON.stringify(this.userInfo) !== '{}'">
			<el-row class="bar-header-right" type="flex" justify="space-around">
				<el-col class="right-entry-item-container" :span="4">
					<el-popover popper-class="avatar-popover" placement="bottom" trigger="hover">
						<div class="avatar-panel-popover">
							<div class="nickname-item">
								<p>{{userInfo.nickname}}</p>
							</div>
							<el-row :gutter="5">
								<el-col :span="8">
									<div>
										<el-statistic :value="50" title="关注"> </el-statistic>
									</div>
								</el-col>
								<el-col :span="8">
									<div>
										<el-statistic title="粉丝">
											<template slot="formatter"> 20 </template>
										</el-statistic>
									</div>
								</el-col>
								<el-col :span="8">
									<div>
										<el-statistic title="动态">
											<template slot="formatter"> 5 </template>
										</el-statistic>
									</div>
								</el-col>
							</el-row>
							<div class="transition-item">
								<div class="single-link-item">
									<el-link icon="el-icon-user" href="https://account.bilibili.com/account/home" :underline="false"
										target="_blank">个人中心
										<i class="el-icon-arrow-right el-icon--right"></i>
									</el-link>
								</div>
								<div class="single-link-item">
									<el-link icon="el-icon-folder-opened" href="https://account.bilibili.com/account/home"
										:underline="false" target="_blank">投稿管理
										<i class="el-icon-arrow-right el-icon--right"></i>
									</el-link>
								</div>
								<div class="single-link-item">
									<el-link icon="el-icon-star-off" href="https://account.bilibili.com/account/home" :underline="false"
										target="_blank">推荐服务
										<i class="el-icon-arrow-right el-icon--right"></i>
									</el-link>
								</div>
								<el-divider></el-divider>
								<div class="single-link-item">
									<el-link icon="el-icon-delete" :underline="false" target="_blank" @click="logout()">退出登陆
										<i class="el-icon-arrow-right" el-icon--right></i>
									</el-link>
								</div>
							</div>
						</div>
						<div class="right-entry-item" slot="reference">
							<el-avatar :size="36" :src="userInfo.avatar" class="user-avatar"></el-avatar>
						</div>
					</el-popover>
				</el-col>
				<el-col class="right-entry-item-container" :span="3">
					<div class="right-entry-item">
						<i class="el-icon-message right-entry-icon"></i>
						<div class="right-entry-text">消息</div>
					</div>
				</el-col>
				<el-col class="right-entry-item-container" :span="3">
					<li class="right-entry-item">
						<i class="el-icon-news right-entry-icon"></i>
						<div class="right-entry-text">动态</div>
					</li>
				</el-col>
				<el-col class="right-entry-item-container" :span="3">
					<li class="right-entry-item">
						<i class="el-icon-star-off right-entry-icon"></i>
						<div class="right-entry-text">收藏</div>
					</li>
				</el-col>
				<el-col class="right-entry-item-container" :span="3">
					<li class="right-entry-item">
						<i class="el-icon-time right-entry-icon"></i>
						<div class="right-entry-text">历史</div>
					</li>
				</el-col>
				<el-col class="right-entry-item-container" :span="7">
					<div class="right-entry-item">
						<el-button type="danger" size="small" icon="el-icon-upload" @click="goToPostVideo()"><span
								class="header-upload-entry-text">投稿</span></el-button>
					</div>
				</el-col>
			</el-row>
		</template>
		<template v-else>
			<el-row class="bar-header-right">
				<el-col class="right-entry-item-container" :span="4">
					<el-popover popper-class="v-popover-content" placement="bottom" trigger="hover" v-model="loginPopVisible">
						<div class="login-panel-popover-big">
							<p class="title">登录后你可以：</p>
							<div class="login-tip-content">
								<div class="login-tip-content-item"> <svg-icon icon-class="login-tip-content-1"
										className="iconMedium"></svg-icon><span class="lt-text">免费看高清视频</span></div>
								<div class="login-tip-content-item"><svg-icon icon-class="login-tip-content-2"
										className="iconMedium"></svg-icon><span class="lt-text">多端同步播放记录</span></div>
								<div class="login-tip-content-item"><svg-icon icon-class="login-tip-content-3"
										className="iconMedium"></svg-icon><span class="lt-text">发表弹幕/评论</span></div>
								<div class="login-tip-content-item"><svg-icon icon-class="login-tip-content-4"
										className="iconMedium"></svg-icon><span class="lt-text">热门番剧影视看不停</span></div>
							</div>
							<div class="login-btn"><el-button type="primary" style="width:100%;margin-bottom:14px;"
									@click="showLoginDialog();loginPopVisible = false" round>立即登录</el-button></div>
							<div class="register-tip"> 首次使用? <span class="register-exper">
									<el-button type="text"
										@click="showRegDialog();closeLoginDialog();loginPopVisible = false">点我注册</el-button>
								</span></div>
						</div>
						<div class="right-entry-item" slot="reference">
							<div class="header-login-entry">登录</div>
						</div>
					</el-popover>
				</el-col>
				<el-col class="right-entry-item-container" :span="3">
					<el-popover placement="bottom" trigger="hover">
						<div class="login-panel-popover">
							<p class="right-entry-popover-tips">登录后即可查看消息记录</p>
							<el-button class="right-entry-popover-btn" type="primary" @click="showLoginDialog();">立即登录</el-button>
						</div>
						<div class="right-entry-item" slot="reference">
							<i class="el-icon-message"></i>
							<div class="right-entry-text">消息</div>
						</div>
					</el-popover>
				</el-col>
				<el-col class="right-entry-item-container" :span="3">
					<el-popover placement="bottom" trigger="hover">
						<div class="login-panel-popover">
							<p class="right-entry-popover-tips">登录后即可查看关注动态</p>
							<el-button class="right-entry-popover-btn" type="primary" @click="showLoginDialog();">立即登录</el-button>
						</div>
						<div class="right-entry-item" slot="reference">
							<i class="el-icon-news"></i>
							<div class="right-entry-text">动态</div>
						</div>
					</el-popover>
				</el-col>
				<el-col class="right-entry-item-container" :span="3">
					<el-popover placement="bottom" trigger="hover">
						<div class="login-panel-popover">
							<p class="right-entry-popover-tips">登录后即可查看我的收藏</p>
							<el-button class="right-entry-popover-btn" type="primary" @click="showLoginDialog();">立即登录</el-button>
						</div>
						<div class="right-entry-item" slot="reference">
							<i class="el-icon-star-off"></i>
							<div class="right-entry-text">收藏</div>
						</div>
					</el-popover>
				</el-col>
				<el-col class="right-entry-item-container" :span="3">
					<el-popover placement="bottom" trigger="hover">
						<div class="login-panel-popover">
							<p class="right-entry-popover-tips">登录后即可查看历史记录</p>
							<el-button class="right-entry-popover-btn" type="primary" @click="showLoginDialog();">立即登录</el-button>
						</div>
						<div class="right-entry-item" slot="reference">
							<i class="el-icon-time"></i>
							<div class="right-entry-text">历史</div>
						</div>
					</el-popover>
				</el-col>
				<el-col class="right-entry-item-container" :span="7">
					<el-button type="danger" size="small" icon="el-icon-upload" @click="goToPostVideo()">
						<span class="header-upload-entry-text">投稿</span></el-button>
				</el-col>
			</el-row>
		</template>
	</div>
</template>

<script>
	import {
		myRemoveItem
	} from '@/api/utils/watchStorage.js';

	export default {
		name: 'barHeaderRight',
		data() {
			return {
				loginPopVisible: false,
			};
		},
		props: {
			colorVar: {
				type: String,
				default: '',
			},
			loginVisible: {
				type: Boolean,
				default: false,
			},
			regVisible: {
				type: Boolean,
				default: false,
			},
			userName: {
				type: String,
			},
			userInfo: {
				type: Object,
			}
		},
		computed: {
			styleVar() {
				return {
					'--titleColor': this.colorVar
				}
			}
		},

		methods: {
			showLoginDialog() {
				this.$emit('update:loginVisible', true);
			},

			closeLoginDialog() {
				this.$emit('update:loginVisible', false);
			},
			showRegDialog() {
				this.$emit('update:regVisible', true);
			},

			closeRegDialog() {
				this.$emit('update:regVisible', false);
			},
			goToPostVideo() {
				this.$router.push("/postvideo");
			},
			logout() {
				//window.sessionStorage.removeItem('token')
				myRemoveItem('username');
			},
		},
	}
</script>

<style>
	.bar-header-right-container {
		position: relative;
		display: flex;
		flex-direction: row;
		height: 100%;
		background: transparent;
		padding: 0;
		/* min-width: 400px; */
		color: var(--titleColor);
	}

	.bar-header-right {
		width: 100%;
	}

	.user-avatar:hover {
		z-index: 2300;
		transform: scale(1.5) translateY(5px) translate(0px);
	}




	.el-popover.avatar-popover {
		background-color: #ffffff;
		border-radius: 8px;
		border: 1px solid #e3e5e7;
		color: #18191c;
		box-sizing: border-box;
		padding: 0px;
		font-family: inherit;
		font-size: 100%;
		font-weight: 400;
		font-style: normal;
		line-height: 1.25;
		margin-top: -10px;
	}

	.avatar-panel-popover {
		border-radius: 8px;
		background-color: #ffffff;
		box-sizing: border-box;
		padding: 0 24px 18px;
		width: 300px;
	}

	.el-popover.v-popover-content {
		font-size: 14px;
		font-weight: 600;
		font-style: normal;
		line-height: 20px;
	}

	.nickname-item {
		display: flex;
		justify-content: center;
		margin-bottom: 2px;
		font-size: 18px;
		font-weight: 500;
	}


	.transition-item {
		display: block;
		text-align: center;
		font-family: PingFang SC, HarmonyOS_Medium, Helvetica Neue, Microsoft YaHei, sans-serif;
		font-size: 15px;
		font-weight: 500;
		font-style: normal;
		line-height: 1.25;
		margin-top: 10px;
	}

	.single-link-item {
		text-align: center;
		transition: background-color .3s linear;
		cursor: pointer;
		border-radius: 8px;
		padding: 10px 14px;
		display: block;
		color: #61666d;
		font-size: 15px;
		font-weight: 500;
	}


	.single-logout-item {
		transition: background-color .3s linear;
		cursor: pointer;
		border-radius: 8px;
		padding: 10px 14px;
		display: block;
		color: #61666d;
	}

	.el-divider {
		margin: 2px;
		height: 1.5px;
	}

	.transition-item .single-link-item:hover {
		background-color: #e3e5e7;
	}

	.transition-item .single-logout-item:hover {
		background-color: #e3e5e7;
	}





	.right-entry-item-container {
		color: var(--titleColor);
		align-items: center;
		text-align: center;
		cursor: pointer;
		height: 64px;

		/* 父元素设置为浮动布局 */
		display: flex;
		/* 父元素下的子元素位于主轴上的位置为：center */
		justify-content: center;
		/* 父元素下的子元素位于交叉轴上的位置为：center */
		align-items: center;
	}

	.header-login-entry {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		color: #fff;
		background: #00AEEC;
		letter-spacing: 0;
		font-size: 14px;
		line-height: 36px;
		font-weight: 500;
		min-width: 25px;
		font-family: inherit;
	}

	.login-panel-popover-big {
		padding: 5px 5px;
		width: 360px;
		border-radius: 8px;
		text-align: left;
	}

	.login-tip-content {
		display: flex;
		flex-wrap: wrap;
		margin-left: 6px;
		color: #18191C;
		font-size: 14px;
		line-height: 14px;
		word-break: keep-all;
	}

	.login-tip-content.login-tip-content>* {
		display: flex;
		align-items: center;
		margin-bottom: 14px;
		width: 50%;
		height: 26px;
	}

	.right-entry-item {
		display: block;
		font-size: 20px;
		line-height: 1.25;
	}

	.right-entry-text {
		font-weight: 600;
		font-style: normal;
		font-size: 13px;
	}

	.login-panel-popover {
		width: 320px;
		border-radius: 8px;
		text-align: left;
		padding-left: 20px;
		padding-right: 20px;
	}

	.right-entry-popover-tips {
		text-align: center;
		width: 320px;
		color: gray;
	}

	.right-entry-popover-btn {
		width: 320px;
		margin-left: 20px;
	}


	.el-icon-upload {
		font-size: 20px;
		color: white;
	}

	.header-upload-entry-text {
		font-size: 15px;
		font-weight: 500;
	}
</style>