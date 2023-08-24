<template>
	<div class="registerbody">
		<div class="registerdata">

			<div class="registertext">
				<h2>欢迎注册</h2>
			</div>

			<div class="formdata">
				<el-form ref="form" :model="form" :rules="rules">
					<el-form-item label="账号" prop="user_name">
						<el-input v-model="form.user_name" clearable placeholder="请输入账号"
							@keyup.enter.native="submitForm('form')"></el-input>
					</el-form-item>
					<el-form-item label="昵称" prop="nickname">
						<el-input v-model="form.nickname" clearable placeholder="请输入昵称"
							@keyup.enter.native="submitForm('form')"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input v-model="form.password" clearable placeholder="请输入密码" show-password
							@keyup.enter.native="submitForm('form')"></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="password_confirm">
						<el-input v-model="form.password_confirm" clearable placeholder="请确认密码" show-password
							@keyup.enter.native="submitForm('form')"></el-input>
					</el-form-item>
				</el-form>
			</div>

			<div class="butt">
				<el-button type="primary" @click="submitForm('form')">提交</el-button>
				<el-button class="shou" @click="resetForm('form')">撤销</el-button>
			</div>

		</div>
	</div>
</template>
</template>

<script>
	import * as API from '../api/login/login.js';

	export default {
		name: "login",
		data() {
			return {
				form: {
					password: "",
					nickname: "",
					user_name: "",
					password_confirm: "",
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
							} = await API.register(this.form) //注意async放在箭头函数而不是submitForm前
							if (res.code > 0) {
								this.$message({
									message: "注册失败 " + res.msg,
									type: "error",
									showClose: true,
								});
							} else {
								this.$message({
									message: "注册成功，请重新登陆",
									type: "success",
									showClose: true,
									duration: 5000,
								});
								this.$router.push("/login");
							}
						} catch (err) {
							console.log(err)
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
		},
	};
</script>

<style scoped>

</style>