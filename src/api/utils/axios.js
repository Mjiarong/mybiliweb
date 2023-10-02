import axios from "axios";

let http = axios.create({
	baseURL: process.env.VUE_APP_BASE_API, //配置默认的地址
	withCredentials: true, //将会默认携带认证给后端
	timeout: 1000 * 10, //请求超时设置,如果超过了10秒,那么就会进入reject
});

http.interceptors.request.use(
	//axios的请求拦截器，它可以拦截所有的请求，为所有的请求添加逻辑
	//拦截了请求后，如果不放行，那么所有的请求会一直被拦截，因此需要return不需要拦截的请求。
	function(config) {
		let postWhiteList = [
			"/user/login",
			"/user/register",
		]; //将不需要拦截的请求拿出来
		let getWhiteList = [
			//"/video",
			//"/videos",
			//"/videos/:username",
			//"/videos/:id",
			//"/video/playinfo",
			"/rank/daily",
			"/comment",
			"/upload/token",
			"/upload/credentials",
			"/comment",
		];

		//console.log(config); //打印的是，被拦截了的请求的相关的东西
		//console.log(config.url); //打印的是拦截的请求的接口，类似于：/users/login
		//console.log(config.method);
		if (config.method === 'post' && postWhiteList.includes(config.url)) {
			//如果当前的请求地址中，包含在不需要拦截请求地址中，那么就放行
			return config;
		} else if (config.method === 'get' && (getWhiteList.includes(config.url) || config.url.includes("/video"))) {
			return config;
		} else {
			console.log(config.url); 
			console.log(config.url.includes("/video"));
			//如果是需要被拦截的请求
			let token = window.sessionStorage.getItem("token") || ""; //将登录成功后，在后端中返回来的token从本地存储取出来
			config.headers["Authorization"] = token; //给需要拦截的请求中请求头添加token。config.headers["authorization"]是一个固定的写法
			return config; //添加后，放行
		}
	}
);

//对外暴露
export default http;