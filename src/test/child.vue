<template>
	<div class="child">
		子组件：{{ dynamicMessage }}+{{ staticMessage }}
	</div>
</template>
<script type="text/ecmascript-6">
	export default {
		props:['dynamicMessage', 'staticMessage']
	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
</style>