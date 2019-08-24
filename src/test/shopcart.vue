<template>
		<div class="shopcart">
			<cartcontrol :food="food"></cartcontrol>
		</div>
</template>
<script type="text/ecmascript-6">
  import cartcontrol from './cartcontrol'
	export default {
		components: {
			cartcontrol
		},
		methods: {
			drop (el) {
				console.log("我是小球下落方法");				
			}
		}
	};
</script>