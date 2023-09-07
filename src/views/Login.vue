<template>
	<div>
		<el-dialog :visible.sync="loginVisible" :before-close="handleClose" custom-class="logindDalog" append-to-body>
			<div class="logintext">
				<h2>Welcome</h2>
			</div>

			<el-form ref="form" :model="form" :rules="rules" class="loginData">
				<el-form-item label="账号" prop="user_name">
					<el-input v-model="form.user_name" clearable placeholder="请输入账号"
						@keyup.enter.native="submitForm('form')"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="form.password" clearable placeholder="请输入密码" @keyup.enter.native="submitForm('form')"
						show-password></el-input>
					<!--如果用了封装组件的话，比如element，这个时候使用按键修饰符需要加上.native-->
				</el-form-item>
			</el-form>

			<div class="butt">
				<span style="margin: 0px 50px 0px 0px;"><el-button type="primary"
						@click="submitForm('form')">确定</el-button></span>

				<el-radio-group v-model="radio1" @change="changeTheme">
					<el-radio label="登录"></el-radio>
					<el-radio label="注册"></el-radio>
				</el-radio-group>
			</div>

		</el-dialog>

		<el-dialog :visible.sync="regVisible" :before-close="handleRegClose" custom-class="regDalog" append-to-body>
			<div class="logintext">
				<h2>欢迎注册</h2>
			</div>

			<el-form ref="regForm" :model="regForm" :rules="regRules" class="regData">
				<el-form-item label="账号" prop="user_name">
					<el-input v-model="regForm.user_name" clearable placeholder="请输入账号"
						@keyup.enter.native="submitRegForm('regForm')"></el-input>
				</el-form-item>
				<el-form-item label="昵称" prop="nickname">
					<el-input v-model="regForm.nickname" clearable placeholder="请输入昵称"
						@keyup.enter.native="submitRegForm('regForm')"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="regForm.password" clearable placeholder="请输入密码" show-password
						@keyup.enter.native="submitRegForm('regForm')"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="password_confirm">
					<el-input v-model="regForm.password_confirm" clearable placeholder="请确认密码" show-password
						@keyup.enter.native="submitRegForm('regForm')"></el-input>
				</el-form-item>
				<el-form-item label="用户头像">
				</el-form-item>
				<div class="regAvatar">
					<el-upload ref="avatarupload" class="avatar-uploader" action="fakeaction" :http-request="handleAvatarUpload"
						:show-file-list="false" :auto-upload="false" :on-change="onAvatarUploadChange">
						<img v-if="imageUrl" :src="imageUrl" class="avatar">
						<i v-else="imageUrl" class="el-icon-plus avatar-uploader-icon"></i>
						<div class="el-upload__tip" slot="tip">只能上传png/jpeg文件，且不超过500kb</div>
					</el-upload>
				</div>
				<div class="avatar-uploader-btn">
					<el-progress :percentage="this.avatarUploadPercentage"></el-progress>
					<el-button size="small" type="success" class="avatar-uploader-btn"
						@click="handleAvatarUpload">上传头像到服务器</el-button>
				</div>
			</el-form>

			<div class="regButt">
				        <el-button type="primary" style="	margin-right:30px;" @click="submitRegForm('regForm')">提交</el-button>
				        <el-button class="shou" @click="resetForm('regForm')">清空</el-button>
			</div>

			<div class="regButt">
				<el-radio-group v-model="radio1" @change="changeTheme">
					<el-radio label="登录"></el-radio>
					<el-radio label="注册"></el-radio>
				</el-radio-group>
			</div>

		</el-dialog>
	</div>
</template>


<script>
	import * as API from '@/api/login/login.js';
	import {
		mySetItem
	} from '@/api/utils/watchStorage.js';
	import {
		createUid
	} from '@/api/utils/uuid.js';
	import cos from '@/api/upload/cos.js';

	export default {
		name: "login",
		props: {
			loginVisible: {
				type: Boolean,
				default: false,
			},
			regVisible: {
				type: Boolean,
				default: false,
			},

		},

		data() {
			var confirmPassword = (regRules, value, callback) => {
				if (value !== this.regForm.password) {
					callback(new Error('两次输入密码不一致!'))
				} else {
					callback()
				}
			};
			return {
				avatarFiles: {},
				avatarKey: '',
				avatarUploadPercentage: 0,
				radio1: '登录',
				imageUrl: '',
				form: {
					password: "",
					user_name: "",
				},
				regForm: {
					password: "",
					nickname: "",
					user_name: "",
					password_confirm: "",
					avatar: '',
				},
				checked: false,
				rules: {
					user_name: [{
							required: true,
							message: "请输入用户名",
							trigger: "blur"
						},
						{
							min: 5,
							message: "用户名不能小于5个字符",
							trigger: "blur"
						},
						{
							max: 30,
							message: "用户名不能大于30个字符",
							trigger: "blur"
						},
					],
					password: [{
							required: true,
							message: "请输入密码",
							trigger: "blur"
						},
						{
							min: 8,
							message: "密码不能小于8个字符",
							trigger: "blur"
						},
						{
							max: 40,
							message: "密码不能大于40个字符",
							trigger: "blur"
						},
					],
				},
				regRules: {
					user_name: [{
							required: true,
							message: "请输入用户名",
							trigger: "blur"
						},
						{
							min: 5,
							message: "用户名不能小于5个字符",
							trigger: "blur"
						},
						{
							max: 30,
							message: "用户名不能大于30个字符",
							trigger: "blur"
						},
					],
					nickname: [{
							required: true,
							message: "请输入昵称",
							trigger: "blur"
						},
						{
							min: 2,
							message: "昵称不能小于2个字符",
							trigger: "blur"
						},
						{
							max: 30,
							message: "昵称不能大于30个字符",
							trigger: "blur"
						},
					],
					password: [{
							required: true,
							message: "请输入密码",
							trigger: "blur"
						},
						{
							min: 8,
							message: "密码不能小于8个字符",
							trigger: "blur"
						},
						{
							max: 40,
							message: "密码不能大于40个字符",
							trigger: "blur"
						},
					],
					password_confirm: [{
							required: true,
							message: "请输入密码",
							trigger: "blur"
						},
						{
							min: 8,
							message: "密码不能小于8个字符",
							trigger: "blur"
						},
						{
							max: 40,
							message: "密码不能大于40个字符",
							trigger: "blur"
						},
						{
							trigger: 'blur',
							validator: confirmPassword
						},
					],
				},
			};
		},


		methods: {
			submitForm(form) {
				this.$refs[form].validate(async (valid) => {
					if (valid) {
						try {
							let {
								data: res
							} = await API.login(this.form) //注意async放在箭头函数而不是submitForm前
							//如果await后面是一个Promise对象，那么线程就会阻塞等待该异步任务完成，并且接受到了Promise对象的返回结果之后才会执行函数体后面部分的代码段
							// 等拿到返回数据res后再进行处理
							if (res.code != 0) {
								this.$message({
									message: "登录失败",
									type: "error",
									showClose: true,
								});
							} else {
								this.$message({
									message: "登录成功",
									type: "success",
									showClose: true,
								});
								window.sessionStorage.setItem('token', res.msg)
								//window.sessionStorage.setItem('username', res.data.user_name)
								mySetItem('username', res.data.user_name);
								this.$emit('update:loginVisible', false);
							}
						} catch (err) {
							console.log(err)
							this.$message({
								message: "请求出错",
								type: "error",
								showClose: true,
							});
						}
					} else {
						return false;
					}
				});
			},

			submitRegForm(form) {
				this.$refs[form].validate(async (valid) => {
					if (valid) {
						try {
							let {
								data: res
							} = await API.register(this.regForm) //注意async放在箭头函数而不是submitForm前
							if (res.code > 0) {
								this.$message({
									message: "注册失败 " + res.msg,
									type: "error",
									showClose: true,
								});
							} else {
								this.$emit('update:regVisible', false);
								this.$emit('update:loginVisible', true);
								this.$message({
									message: "注册成功，请重新登陆",
									type: "success",
									showClose: true,
									duration: 5000,
								});
							}
						} catch (err) {
							this.$message({
								message: "注册失败",
								type: "error",
								showClose: true,
							});
						}
					} else {
						return false;
					}
				});
			},

			resetForm(formName) {
				this.$refs[formName].resetFields();
			},

			handleClose(done) {
				this.$emit('update:loginVisible', false);
			},

			handleRegClose(done) {
				this.$emit('update:regVisible', false);
			},

			//切换注册登录
			changeTheme(val) {
				if (val === '登录') {
					this.$emit('update:regVisible', false);
					this.$emit('update:loginVisible', true);
				}
				if (val === '注册') {
					this.$emit('update:loginVisible', false);
					this.$emit('update:regVisible', true);
				}
			},

			onAvatarUploadChange(file, fileList) {
				var avatar = file.raw;
				// /console.log(file); //
				//console.log(fileList); //
				//console.log(this.avatarFiles); //
				console.log(avatar.type);
				const isImage = (avatar.type === 'image/png' || avatar.type === 'image/jpeg');
				const isLt500K = file.size / 1024 / 500;
				if (!isImage) {
					this.$message.error('上传头像图片只能是图片!');
					return isImage
				}
				if (!isLt500K) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
					return isLt500K;
				}
				this.avatarFiles = avatar;
				this.imageUrl = URL.createObjectURL(avatar);

				return isImage && isLt500K;
			},

			async avatarUpload() {
				const file = this.avatarFiles;
				let uid = createUid();
				var that = this;
				this.avatarKey = 'userAvatar/' + uid + '-' + this.avatarFiles.name;
				try {
					var data = await cos.uploadFile({
						Bucket: 'mybili-1312334998',
						/* 填写自己的 bucket，必须字段 */
						Region: 'ap-guangzhou',
						/* 存储桶所在地域，必须字段 */
						Key: this.avatarKey,
						/* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
						Body: file, // 上传文件对象
						SliceSize: 1024 * 1024 * 5,
						/* 触发分块上传的阈值，超过5MB 使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
						onProgress: function(progressData) {
							/* 非必须 */
							that.avatarUploadPercentage = progressData.percent * 100;
							//console.log(JSON.stringify(progressData));
						},
					});
					return {
						err: null,
						data: data
					}
				} catch (err) {
					return {
						err: err,
						data: null
					};
				}
			},

			async handleAvatarUpload() {
				// 可以同步拿到请求的返回值,这里举例说明,实际返回的数据格式可以自定义
				var uploadResult = await this.avatarUpload();
				if (uploadResult.err) {
					this.$message({
						message: uploadResult.err,
						type: 'warning'
					});
				} else {
					this.regForm.avatar = this.avatarKey;
					this.$message({
						message: '上传成功',
						type: 'success'
					});
				}
			},
		},

		watch: { // 简单监听
			loginVisible(newVal, oldVal) {
				if (newVal === true) {
					this.radio1 = '登录'
				}
			},
			regVisible(newVal, oldVal) {
				if (newVal === true) {
					this.radio1 = '注册'
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.logintext {
		margin-bottom: 20px;
		line-height: 50px;
		text-align: center;
		font-size: 30px;
		font-weight: bolder;
		color: white;
		text-shadow: 2px 2px 4px #000000;
	}

	.loginData {
		margin: 0 20px;
	}


	.butt {
		margin-top: 10px;
		text-align: center;
	}

	.shou {
		cursor: pointer;
		color: #606266;
	}

	/deep/ .el-dialog.logindDalog {
		width: 600px;
		font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
		font-style: normal;
		font-weight: 500;
		font-size: 14px;
	}

	/deep/ .el-dialog.regDalog {
		width: 600px;
		overflow: hidden;
		font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
		font-style: normal;
		font-weight: 500;
		font-size: 14px;
	}


	.avatar-uploader {
		display: block;
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		width: 400px;
	}

	.avatar-uploader:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 100px;
		height: 100px;
		line-height: 100px;
		text-align: center;
	}

	.avatar {
		width: 100px;
		height: 100px;
		display: block;
	}

	.regAvatar {
		display: block;
		text-align: center;
		margin-top: -20px;
		margin-left: 80px;
		margin-bottom: 20px;
	}

	.avatar-uploader-btn {
		text-align: center;
		margin-top: 0px;
		margin-bottom: 20px;
	}

	.regButt {
		display: block;
		text-align: center;
		margin-bottom: 20px;
	}
</style>