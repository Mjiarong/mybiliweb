import axios from "@/api/utils/axios.js";

// 用户登录
export const login = form => axios.post('/user/login', form);

// 用户注册
export const register = form => axios.post('/user/register', form);


/*
export const login = form =>{
	return http({
		method: 'POST',
		url: `/user/login`,
		params:{
				password:form.password,
				user_name:form.user_name,
		}
	}).then(res => res.data)
}

export const register = form =>{
	return http({
		method: 'POST',
		url: `/user/register`,
		params:{
			password:form.password,
			password_confirm: form.password_confirm,
			user_name:form.user_name,
			nickname: form.nickname,
		}
	}).then(res => res.data)
}

// 封装http请求，返回promise, 用于调用getHistoryData函数后作不同处理
export function login (form) {
  return new Promise((resolve, reject) => {
	http({
		method: 'POST',
		url: `/user/login`,
		params:{
				password:form.password,
				user_name:form.user_name,
		}
	}).then((res) => {
	  resolve(res)
	}).catch((err) => {
	  reject(err)
	})
  })
}

export function register (form) {
  return new Promise((resolve, reject) => {
	http({
		method: 'POST',
		url: `/user/register`,
		params:{
			password:form.password,
			password_confirm: form.password_confirm,
			user_name:form.user_name,
			nickname: form.nickname,
		}
	}).then((res) => {
	  resolve(res)
	}).catch((err) => {
	  reject(err)
	})
  })
}
*/