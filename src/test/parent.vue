<template>
	<div class="parent">
		父组件：{{ parentMessage }}
		<!--
		注意传递参数时要用-代替驼峰命名，HTML不区分大小写
		通过属性传递，可传递动态属性，也可以传递静态属性，可传递数字、布尔值、数组、对象等任何类型的值
		:my-message是动态属性，需要加:
		mm是静态属性
		-->
		<child :dynamic-message="parentMessage" static-message="我是静态参数"></child>
		<child :dynamic-message="parentMessage" static-message="我是静态参数"></child>
	</div>
</template>
<script type="text/ecmascript-6">
	import child from './child.vue'
	export default {
		data () {				// 组件的data必须是函数
			return {
				parentMessage: '我是父组件的动态数据'
			}
		},
		components: {
			child
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
</style>