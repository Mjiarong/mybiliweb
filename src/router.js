import Vue from 'vue';
import Router from 'vue-router';



//获取原型对象上的push函数
const originalPush = Router.prototype.push
//修改原型对象中的push方法
//解决vue-router在3.0版本以上重复点菜单报错问题
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

//把Router安装为Vue项目的插件
Vue.use(Router);

// 页面路由组件
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import About from '@/views/About.vue';
import PostVideo from '@/views/PostVideo.vue';
import Register from '@/views/Register.vue';
import ShowVideo from '@/views/ShowVideo.vue';
import Userinfo from '@/views/Userinfo.vue';
import VideoUpload from '@/views/VideoUpload.vue';
import UploadManage from '@/views/UploadManage.vue';


//创建路由实例对象
const router = new Router({
	routes: [{
			path: '/',
			name: 'home',
			component: Home,
		},
		{
			path: '/postvideo',
			name: 'postVideo',
			component: PostVideo,
			redirect: "/postvideo/upload", //当网址为/postvideo时重定向到/home/home2
			children: [{
					path: "/postvideo/upload",
					name: "upload",
					component: VideoUpload,
				},
				{
					path: "/postvideo/upload-manage",
					name: "upload-manage",
					component: UploadManage,
				},
			]
		},
		{
			path: '/video/:videoID', 
			name: 'showVideo',
			component: ShowVideo,
			props: true,//动态路由获取参数
		},
		{
			path: '/about',
			name: 'about',
			component: About,
		},
		{
			path: '/login',
			name: 'login',
			component: Login,
		},
		{
			path: '/register',
			name: 'register',
			component: Register,
		},
		{
			path: '/userinfo',
			name: 'userinfo',
			component: Userinfo,
		},
	],
});


router.beforeEach((to, from, next) => {
	//to 表示将要访问的路由的信息对象
	//from 表示将要离开的路由的信息对象
	//next 表示放行的意思
	const pathArr = ['/userinfo', '/postvideo','/postvideo/upload','/postvideo/upload-manage']
	if (to.path === '/login') {
		const userToken = window.sessionStorage.getItem('token')
		if (userToken) {
			alert('你已经登陆');
		} else {
			next()
		}
	} else if (pathArr.indexOf(to.path) !== -1) {
		const userToken = window.sessionStorage.getItem('token')
		if (userToken) {
			next()
		} else {
			//next('/login')
			alert('请登陆后再操作');
		}
	} else {
		next()
	}
})

export default router