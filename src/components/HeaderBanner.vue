<template>
	<div class="background">
		<img :src="imgSrc" class="banner-img" />
	</div>
</template>

<script>
	export default {
		data() {
			return {
				imgSrc: require('@/assets/banner.webp')
			}
		}
	}
</script>

<style>
	.background {
		margin: 0 auto;
		min-width: calc(var(--home-container-min-width) + 80px);
		min-height: 155px;
		height: 9.375vw;
		max-height: 240px;
		width: 100%;
		/**宽高100%是为了图片铺满屏幕 */
		z-index: -1;
		position: relative;
		background-position: center 0;
		background-size: cover;
		background-repeat: no-repeat;
	}

	.banner-img {
		position: absolute;
		object-fit: cover;/*该属性会对图片保留原始比列，多余的会被裁剪。*/
		line-height: 1;
		width: 100%;
		height: 100%;
		vertical-align: middle;
	}
</style>