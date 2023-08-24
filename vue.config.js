const {
	defineConfig
} = require('@vue/cli-service')
const path = require('path')

function resolve(dir) {
	return path.join(__dirname, dir)
}

module.exports = defineConfig({
	transpileDependencies: true,
	lintOnSave: false,
	devServer: { //通过devServer节点对webpack-dev-serve插件进行更多的配置
		open: true, //初次打包完成后自动打开浏览器
		host: 'localhost', //实时打包使用的主机
		proxy: {
			'^/api': {
				target: 'http://localhost:3000',
				ws: true,
				changeOrigin: true,
			},
		},
	},
	configureWebpack: {
		resolve: {
			alias: {
				// 配置alias别名,配置@作为src根路径
				'@': resolve('src'),
			},
		},
	},
	chainWebpack: config => {
		config.module
			.rule('svg')
			.exclude.add(resolve('src/icons')) //对应下面配置svg的路径
			.end();

		config.module
			.rule('icons')
			.test(/\.svg$/)
			.include.add(resolve('src/icons')) //对应下面配置svg的路径
			.end()
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({


				symbolId: 'icon-[name]'
			});
	},
})