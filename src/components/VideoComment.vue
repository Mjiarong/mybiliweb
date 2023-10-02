<template>
	<div class="comment-container">
		<div class="reply-header">
			<span class="nav-title-text">评论</span>
			<span class="total-reply">{{totalComment}}条</span>
			<el-radio class="nav-sort-hot" v-model="radio" label="1">最新</el-radio>
			<el-radio class="nav-sort-hot" v-model="radio" label="2">最热</el-radio>
		</div>
		<div class="reply-warp">
			<div class="mian-reply-box" v-if="JSON.stringify(this.userInfo) === '{}'">
				<div class="reply-box-avatar">
					<el-avatar :size="38" :src="userInfo.avatar" class="user-avatar"></el-avatar>
				</div>
				<div class="reply-box-warp">
					<el-input type="textarea" :rows="2" placeholder="请先登录后发表评论" v-model="rootTextarea" :disabled="true">
					</el-input>
				</div>
				<div class="reply-box-send">
					<el-button type="primary" @click="loginDialogVisible = true">登录</el-button>
				</div>
			</div>
			<div class="mian-reply-box" v-else>
				<div class="reply-box-avatar">
					<el-avatar :size="38" :src="userInfo.avatar" class="user-avatar"></el-avatar>
				</div>
				<div class="reply-box-warp">
					<el-input type="textarea" :rows="2" placeholder="与其赞同别人的话语，不如自己畅所欲言。" v-model="rootTextarea">
					</el-input>
				</div>
				<div class="reply-box-send">
					<el-button type="primary" @click="submitRootComment()">发布</el-button>
				</div>
			</div>

			<div class="infinite-list-wrapper" v-if="allComments.items!=null" v-infinite-scroll="load"
				infinite-scroll-disabled="disabled" style="overflow:auto">
				<div v-for="(item,index)  in allComments.items.slice(0, this.count * this.loadStep)" class="reply-item">
					<div class="root-reply-container">
						<div class="root-reply-avatar">
							<el-avatar :size="38" :src="item.user_avatar_url" class="user-avatar"></el-avatar>
						</div>
						<div class="root-reply-content">
							<div class="user-info">
								<span class="user-name">{{item.nickname}}</span>
							</div>
							<div class="reply-content-container">
								<span class="reply-content">{{item.content}}</span>
							</div>
							<div class="reply-info">
								<span class="reply-time"> {{ $moment.unix(item.created_at).format("YYYY-MM-DD HH:mm:ss")}}</span>
								<el-button type="text" icon="el-icon-top" class="reply-btns"
									:style="{color: item.liked == true ? '#00aeec' : '#61666d'}"
									@click="addLikes(item.id,userInfo.id,index,-1)">{{item.likes}}</el-button>
								<el-button type="text" icon="el-icon-bottom" class="reply-btns"
									:style="{color: item.disliked == true ? '#00aeec' : '#61666d'}"
									@click="addDislikes(item.id,userInfo.id,index,-1)"></el-button>
								<el-button type="text" class="reply-btns"
									@click="showReplyBox(item.id,item.nickname);repUserFlag = false;">回复</el-button>

								<el-dropdown trigger="click" @command="handleCommand" class="sub-reply-operation-warp">
									<span class="el-dropdown-link">
										<i class="el-icon-arrow-down el-icon--right"></i>
									</span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item v-if="userInfo.id==item.user_id"
											:command="deleteReplyCommand('handleDeleteReply', item.id)">删除评论</el-dropdown-item>
										<el-dropdown-item v-else
											:command="reportReplyCommand('handleReportReply', item.id)">举报评论</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</div>
						</div>
					</div>


					<div v-if="item.children">
						<div class="sub-reply-container"
							v-for="(subRep,subIndex) in item.children.slice((allComments.currentPage[index] - 1) * pagesize, allComments.currentPage[index] * pagesize)">
							<div class="sub-reply-avatar">
								<el-avatar :size="24" :src="subRep.user_avatar_url" class="user-avatar"></el-avatar>
							</div>

							<div class="sub-reply-content-container">
								<div class="sub-reply-content">
									<span class="sub-user-info">{{subRep.nickname}}</span>
									<span class="sub-reply-user-info"
										v-if="subRep.reply_user_name">{{'回复 @'+subRep.reply_user_name+' : '}}</span>
									<span class="sub-content">{{subRep.content}}</span>
								</div>

								<div class="sub-reply-info">
									<span class="reply-time">
										{{ $moment.unix(subRep.created_at).format("YYYY-MM-DD HH:mm:ss")}}</span>
									<el-button type="text" icon="el-icon-top" class="reply-btns"
										:style="{color: subRep.liked == true ? '#00aeec' : '#61666d'}"
										@click="addLikes(subRep.id,userInfo.id,index,subIndex+(allComments.currentPage[index] - 1) * pagesize)">{{subRep.likes}}</el-button>
									<el-button type="text" icon="el-icon-bottom" class="reply-btns"
										:style="{color: subRep.disliked == true ? '#00aeec' : '#61666d'}"
										@click="addDislikes(subRep.id,userInfo.id,index,subIndex+(allComments.currentPage[index] - 1) * pagesize)"></el-button>
									<el-button type="text" class="reply-btns"
										@click="showReplyBox(item.id,subRep.nickname);repUserFlag = true;">回复</el-button>

									<el-dropdown trigger="click" @command="handleCommand" class="sub-reply-operation-warp">
										<span class="el-dropdown-link">
											<i class="el-icon-arrow-down el-icon--right"></i>
										</span>
										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item v-if="userInfo.id==subRep.user_id"
												:command="deleteReplyCommand('handleDeleteReply', subRep.id)">删除评论</el-dropdown-item>
											<el-dropdown-item v-else
												:command="reportReplyCommand('handleReportReply', subRep.id)">举报评论</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
								</div>

							</div>
						</div>
					</div>


					<el-pagination v-if="item.children" @current-change="handlePageChange(item)"
						:current-page.sync="allComments.currentPage[index]" :page-sizes="[5, 10, 15, 20]" :page-size="pagesize"
						hide-on-single-page layout="total, prev, pager, next" :total="item.children_num">
					</el-pagination>

					<div class="reply-box-container" v-if="repTextVisible&&currentRepTextID===item.id">
						<div class="reply-box-avatar">
							<el-avatar :size="38" :src="userInfo.avatar" class="user-avatar"></el-avatar>
						</div>
						<div class="reply-box-warp">
							<el-input type="textarea" ref="replyBox" :rows="2" :placeholder="'回复 @'+placeholderText+':'"
								v-model="subTextarea">
							</el-input>
						</div>
						<div class="reply-box-send">
							<el-button type="primary" @click="submitSubComment(item.id)">发布</el-button>
						</div>
					</div>

					<el-divider></el-divider>

				</div>
				<div v-if="loading" class="loading-btns">加载中...</div>
				<div v-if="noMore" class="loading-btns">没有更多评论了</div>
			</div>

		</div>
		<Login :loginVisible.sync="loginDialogVisible" :regVisible.sync="regDialogVisible" />
	</div>
</template>

<script>
	import Login from '@/views/Login.vue';
	import {
		getYMDHMS
	} from '@/api/utils/date.js';
	import {
		postComment,
		getComments,
		addCommentLikes,
		addCommentDislikes,
		deleteComment,
	} from '@/api/video/comment.js';
	export default {
		name: 'VideoComment',
		props: ['commentVideoID', 'userInfo'],
		components: {
			Login,
		},
		data() {
			return {
				radio: 1,
				userName: window.sessionStorage.getItem('username'),
				rootTextarea: '',
				subTextarea: '',
				placeholderText: '与其赞同别人的话语，不如自己畅所欲言',
				loginDialogVisible: false,
				regDialogVisible: false,
				repTextVisible: false,
				currentRepTextID: 0,
				repUserFlag: false,
				count: 0,
				loading: false,
				comment: {
					content: '',
					user_id: 0,
					user_name: '',
					nickname: '',
					user_avatar_url: '',
					video_id: 0,
					parent_id: 0,
					reply_user_name: '',
					likes: 0,
					children: [],
				}, //存放要上传提交的评论
				allComments: {
					/* id: 0,
					content: "",
					user_id: 0,
					user_name: "",
					nickname: "",
					user_avatar_url: "",
					video_id: 0,
					parent_id: 0,
					reply_user_name: "",
					created_at: 0,
					likes: 0,
					children: [],
					children_num: 0,
					currentPage: 0, */
					items: [{}], //存放从后端接收的评论
					currentPage: [], //每个根评论当前显示的子页码
				},
				totalComment: 0, //该视频的总评论条数
				comments: [], //当前显示的根评论
				list: [],
				totalPages: 0, //取后端返回内容的总页数
				loadStep: 2, //每次滚动读取的评论页数
				subtotal: 0, //子评论总数
				pagesize: 5, //每一页显示子评论数
			};
		},

		computed: {
			noMore() {
				return this.count * this.loadStep >= this.totalPages
			},
			disabled() {
				return this.loading || this.noMore
			},
			userinfo() {
				return this.userInfo
			},
		},

		methods: {
			load() {
				this.loading = true
				setTimeout(() => {
					this.count += 1; //评论页数+1
					this.loading = false; //此时评论页数+1，查询下一页数据
				}, 1000)
			},

			showReplyBox(id, repName) {
				//没有登录便按下回复，弹出登录框
				if (JSON.stringify(this.userInfo) === '{}') {
					this.loginDialogVisible = true
				} else {
					this.placeholderText = repName
					if (this.currentRepTextID === id) //同一个回复按钮点了两次
					{
						this.repTextVisible = !this.repTextVisible
					} else {
						this.repTextVisible = true
						this.currentRepTextID = id
					}
					if (this.repTextVisible) {
						this.$nextTick(() => {
							this.$refs.replyBox[0].focus(); //激活元素
						})
					}
				}
			},

			//删除视频评论
			async handleDeleteReply(id) {
				try {
					let {
						data: res
					} = await deleteComment(id, this.commentVideoID);
					if (res.code != 0) {
						this.$message({
							message: "删除评论失败",
							type: "error",
							showClose: true,
						});
					} else {
						this.$notify({
							title: '删除评论成功',
							type: 'success',
						});
						this.loadVideoComments();
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

			handleReportReply(id) {
				if (JSON.stringify(this.userInfo) === '{}') {
					this.loginDialogVisible = true
					return
				}
			},

			deleteReplyCommand(methodName, value) {
				return {
					methodName: methodName,
					value: value,
				};
			},

			reportReplyCommand(methodName, value) {
				return {
					methodName: methodName,
					value: value,
				};
			},

			handleCommand(command) {
				if (command.methodName == "handleDeleteReply") {
					//这里就是你要进行的操作了
					this.handleDeleteReply(command.value);
				} else if (command.methodName == "handleReportReply") {
					this.handleReportReply(command.value);
				}
			},

			// 获取视频评论列表
			async loadVideoComments() {
				try {
					let {
						data: res
					} = await getComments(this.commentVideoID, this.userInfo.id);
					if (res.code != 0) {
						this.$message({
							message: "获取个人信息失败",
							type: "error",
							showClose: true,
						});
					} else {
						if (res.data.items != null) {
							this.allComments.items = res.data.items;
							this.allComments.currentPage = new Array(this.allComments.items.length).fill(1);
							this.totalPages = this.allComments.items.length;
							this.totalComment = res.data.total
						}
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

			async submitRootComment() {
				if (!this.rootTextarea) {
					this.$message({
						message: "你还没有评论！",
						type: "error",
						showClose: true,
					})
				}
				this.comment.content = this.rootTextarea;
				this.comment.user_id = this.userInfo.id;
				this.comment.user_name = this.userInfo.user_name;
				this.comment.nickname = this.userInfo.nickname;
				this.comment.user_avatar_key = this.userInfo.avatar_key;
				this.comment.video_id = Number(this.commentVideoID);
				this.comment.parent_id = 0;
				this.comment.reply_user_name = '';
				try {
					let res = await postComment(this.comment)
					if (res.data.code != 0) {
						this.$notify.error({
							title: '评论失败',
							message: res.msg,
						});
					} else {
						this.$notify({
							title: '评论成功',
							type: 'success',
						});
						this.loadVideoComments();
						this.rootTextarea = '';
					}
				} catch (err) {
					this.$notify.error({
						title: '网路错误，或者服务器宕机',
						message: err,
					});
				}
			},

			async submitSubComment(id) {
				if (!this.subTextarea) {
					this.$message({
						message: "你还没有评论！",
						type: "error",
						showClose: true,
					})
				}
				this.comment.content = this.subTextarea;
				this.comment.user_id = this.userInfo.id;
				this.comment.user_name = this.userInfo.user_name;
				this.comment.nickname = this.userInfo.nickname;
				this.comment.user_avatar_key = this.userInfo.avatar_key;
				this.comment.video_id = Number(this.commentVideoID);
				this.comment.parent_id = id;
				if (this.repUserFlag) {
					this.comment.reply_user_name = this.placeholderText;
				}
				try {
					let res = await postComment(this.comment)
					if (res.data.code != 0) {
						this.$notify.error({
							title: '评论失败',
							message: res.msg,
						});
					} else {
						this.$notify({
							title: '评论成功',
							type: 'success',
						});
						this.loadVideoComments();
						this.subTextarea = '';
					}
				} catch (err) {
					this.$notify.error({
						title: '网路错误，或者服务器宕机',
						message: err,
					});
				}
			},

			async addLikes(commentID, userID, rootIndex, subIndex) {
				//没有登录便按下点赞，弹出登录框
				if (JSON.stringify(this.userInfo) === '{}') {
					this.loginDialogVisible = true
					return
				}
				try {
					let res = await addCommentLikes(commentID, userID)
					if (res.data.code != 0) {} else { //更新本地的点赞显示
						if (subIndex < 0) {
							this.allComments.items[rootIndex].liked = !this.allComments.items[rootIndex].liked;
							this.allComments.items[rootIndex].liked ? (this.allComments.items[rootIndex].likes += 1, this.allComments
								.items[rootIndex].disliked = false) : (this
								.allComments.items[rootIndex].likes -= 1);
						} else {
							this.allComments.items[rootIndex].children[subIndex].liked = !this.allComments.items[rootIndex].children[
								subIndex].liked;
							this.allComments.items[rootIndex].children[subIndex].liked ? (this.allComments.items[rootIndex].children[
									subIndex].likes += 1, this.allComments
								.items[rootIndex].children[subIndex].disliked = false) : (this.allComments.items[rootIndex].children[
									subIndex].likes -=
								1);
						}
					}
				} catch (err) {}
			},

			async addDislikes(commentID, userID, rootIndex, subIndex) {
				if (JSON.stringify(this.userInfo) === '{}') {
					this.loginDialogVisible = true
					return
				}
				try {
					let res = await addCommentDislikes(commentID, userID)
					if (res.data.code != 0) {} else { //更新本地的点赞数和图标颜色
						if (subIndex < 0) { //根评论
							this.allComments.items[rootIndex].disliked = !this.allComments.items[rootIndex].disliked;
							this.allComments.items[rootIndex].disliked ? (this.allComments.items[rootIndex].dislikes += 1) :
								(this.allComments.items[rootIndex].dislikes -= 1);
							if (this.allComments.items[rootIndex].liked) {
								this.allComments.items[rootIndex].liked = false;
								this.allComments.items[rootIndex].likes -= 1
							}
						} else {//子评论
							this.allComments.items[rootIndex].children[subIndex].disliked = !this.allComments.items[rootIndex]
								.children[subIndex].disliked;
							this.allComments.items[rootIndex].children[subIndex].disliked ? (this.allComments.items[rootIndex]
								.children[subIndex].dislikes += 1) : (this.allComments.items[rootIndex].children[subIndex]
								.dislikes -= 1);
							if (this.allComments.items[rootIndex].children[subIndex].liked) {
								this.allComments.items[rootIndex].children[subIndex].liked = false;
								this.allComments.items[rootIndex].children[subIndex].likes -= 1
							}
						}
					}
				} catch (err) {}
			},

			handlePageChange(item) {},

		},

		watch: { // 监听
			userInfo(curVal, oldVal) {
				if (curVal) {
					this.loadVideoComments();
				}
			},
		},

		created() {
			this.loadVideoComments();
		},

	}
</script>

<style scoped>
	.reply-header {
		display: block;
		margin-bottom: 2vh;
	}

	.nav-title-text {
		color: #18191c;
		font-weight: 500;
		font-size: clamp(20px, calc(17px + 0.3vw), 24px);
	}

	.total-reply {
		margin: 0 36px 0 6px;
		font-weight: normal;
		color: #9499a0;
		font-size: clamp(13px, calc(13px + 0.06vw), 14px);
	}

	.nav-sort-hot::v-deep .el-radio__label {
		font-size: clamp(13px, calc(11px + 0.2vw), 16px);
	}

	.mian-reply-box {
		display: flex;
		height: 50px;
	}

	.reply-box-avatar {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80px;
		height: 100%;
	}

	.reply-box-warp {
		font-size: 12px;
		line-height: 1.5;
		color: #222;
		background-color: #fff;
		width: 85%;
	}


	.reply-box-send {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		margin-left: 10px;
		border-radius: 4px;
	}

	.reply-box-send .el-button {
		font-size: 16px;
		height: 100%;
	}

	.reply-item {
		height: auto;
		display: block;
		--avatar-width: 80px;
		--sub-avatar-width: 30px;
	}

	.root-reply-container {
		padding-top: 20px;
		display: flex;
		height: auto;
	}

	.root-reply-avatar {
		display: flex;
		justify-content: center;
		align-items: center;
		width: var(--avatar-width);
		height: 50px;
	}

	.root-reply-content {
		display: block;
		width: 100%;
		height: auto;
	}

	.content-warp {
		display: block;
		width: 100%;
		height: auto;
	}

	.user-info {
		margin-top: 0;
	}

	.user-name {
		color: #FB7299;
		cursor: pointer;
		font-size: clamp(13px, calc(13px + 0.06vw), 14px);
	}

	.reply-content-container {
		margin-top: 2px;
		margin-bottom: 2px;
	}

	.reply-content {
		font-weight: 400;
		color: #18191c;
		font-size: clamp(15px, calc(14px + 0.1vw), 16px);
	}

	.reply-info {
		display: flex;
		align-items: center;
		position: relative;
		margin-top: 2px;
		font-size: 13px;
		color: #9499a0;
	}

	.el-button.reply-btns {
		position: relative;
		padding: 0;
		transition: all .3s;
		color: #9499a0;
		margin-left: 15px;
		border: 0px;
		font-size: 13px;
	}

	.reply-btn {
		position: relative;
		padding: 0;
		transition: all .3s;
		color: #9499a0;
		margin-left: 15px;
		border: 0px;
		font-size: 13px;
	}

	.sub-reply-container {
		padding-top: 8px;
		padding-bottom: 8px;
		display: flex;
		height: auto;
		width: auto;
		margin-left: var(--avatar-width);
	}

	.sub-reply-avatar {
		display: flex;
		justify-content: center;
		align-items: center;
		width: var(--sub-avatar-width);
		height: var(--sub-avatar-width);
	}

	.sub-reply-content-container {
		display: block;
		height: auto;
		width: 100%;
	}

	.sub-reply-content {
		align-items: baseline;
		display: flex;
		height: auto;
	}

	.sub-user-info {
		color: #FB7299;
		cursor: pointer;
		font-size: clamp(13px, calc(13px + 0.06vw), 14px);
		margin-right: 9px;
	}

	.sub-content {
		font-weight: 400;
		color: #18191c;
		font-size: clamp(15px, calc(14px + 0.1vw), 16px);
	}

	.sub-reply-info {
		display: flex;
		align-items: center;
		position: relative;
		margin-top: 2px;
		font-size: 13px;
		color: #9499a0;
	}

	.sub-reply-user-info {
		color: #008ac5;
		font-weight: 400;
		cursor: pointer;
		font-size: clamp(15px, calc(14px + 0.1vw), 16px);
	}

	.sub-reply-operation-warp {
		margin-left: auto;
	}

	.loading-btns {
		margin-top: 5px;
		color: #9499a0;
		text-align: center;
	}

	.reply-box-container {
		display: flex;
		margin-bottom: 10px;
		margin-left: var(--avatar-width);
	}



	.infinite-list-wrapper {
		display: flex;
		flex-direction: column;
	}

	.el-divider--horizontal {
		display: block;
		height: 1px;
		width: auto;
		margin-top: 10px;
		margin-bottom: 0;
		margin-left: var(--avatar-width);
	}

	.el-pagination {
		margin-left: var(--avatar-width);
		color: #18191c;
		font-weight: 400;
		box-sizing: border-box;
		-webkit-font-smoothing: antialiased;
	}
</style>