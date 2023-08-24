<template>
	<div>
		<HeaderBar />
		<template v-if="this.headerType === 'LargeHeader'">
			<HeaderBanner />
			<HeaderChannel />
		</template>
	</div>
</template>

<script>
	import HeaderBar from '@/components/Header.vue'; //导入需要使用的组件
	import HeaderBanner from '@/components/HeaderBanner.vue';
	import HeaderChannel from '@/components/HeaderChannel.vue';

	export default {
		name: 'LargeHeader',
		data() {
			return {
				headerType: 'LargeHeader',
			};

		},

		components: {
			HeaderBar, //相当于'HeaderBar':HeaderBar的简写
			HeaderBanner,
			HeaderChannel,
		},

		watch: { // 简单监听
			$route: {
				handler: function(route) {
					if (route.name === 'home') {
						this.headerType = 'LargeHeader';
					} else {
						this.headerType = 'simpleHeader';
					}
				},
				immediate: true
			}
		},
	};
</script>

<style>

</style>