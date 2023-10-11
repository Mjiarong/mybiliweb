<template>
	<div class="cc-container">
		<div class="cc-nav-container">
			<el-menu router :default-active="this.$router.path" class="el-menu-postvideo">
				<el-menu-item index="/postvideo/upload">
					<i class="el-icon-upload"></i>
					<span slot="title">投稿</span>
				</el-menu-item>
				<el-menu-item index="/postvideo/upload-manage">
					<i class="el-icon-folder"></i>
					<span slot="title">内容管理</span>
				</el-menu-item>
			</el-menu>
		</div>
		<div class="cc-body-container">
			<div class="video-up-app">
				<router-view></router-view>
				<!-- <PostVideoManage></PostVideoManage> -->
			</div>
		</div>
	</div>
</template>

<script>

</script>

<style lang="scss">
	.cc-container {
		width: 100%;
		height: 100%;
		min-width: var(--home-container-min-width);
		--cc-nav-width: 200px;
		display: flex;
	}

	.cc-nav-container {
		border-right: 1px solid #e5e9ef;
		height: inherit;
		overflow: visible;
		width: var(--cc-nav-width);
		min-width: var(--cc-nav-width);
		position: fixed;
		z-index: 1;
	}

	.el-menu-postvideo {
		height: 100%;
	}

	.cc-body-container {
		width: calc(100% - var(--cc-nav-width));
		height: 100%;
		background: #fafafa;
		overflow: visible;
		--cc-body-width: calc(var(--home-container-min-width) - var(--cc-nav-width));
		min-width: var(--cc-body-width);
		min-height: 920px;
		position: relative;
		left:var(--cc-nav-width); 
		z-index: 0;
	}

	.video-up-app {
		position: relative;
		width: var(--cc-body-width);
		margin-right: calc((100% - var(--cc-body-width))/2);
		margin-left: calc((100% - var(--cc-body-width))/2);
		border-top: 16px solid transparent;
		overflow: visible;
	}
</style>