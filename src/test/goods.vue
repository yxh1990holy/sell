<template>
	<div class="goods">
		<cartcontrol @cart-add-cartcontrol="addCart" :food="food"></cartcontrol>
		<shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
		<food ref="food" :food="selectedFood" @cart-add-food="addCart"></food>
	</div>
</template>
<script type="text/ecmascript-6">
	import cartcontrol from "./cartcontrol";
	import shopcart from "./shopcart";
	import food from "./food";
	export default {
		components: {
			shopcart,
			cartcontrol,
			food
		},
		methods: {
			addCart(target) {
				// 通过refs调用shopcart中的drop方法
				// 体验优化，异步执行下落动画
				this.$nextTick(() => {
					this.$refs.shopcart.drop(target);
				});
			},
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
</style>