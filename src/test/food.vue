<template>
	<div class="food">
		<cartcontrol :food="food"></cartcontrol>
		<transition name="fade">
			<div class="buy" v-show="!food.count || food.count===0" @click.stop.prevent="addFirst($event)">加入购物车</div>
		</transition>	
	</div>
	
</template>
<script type="text/ecmascript-6">
	import cartcontrol from './cartcontrol';
	export default {
		components: {
			cartcontrol
		}
		methods: {
			addFirst(event) {
				// console.log(event.target);
				// $emit调用的自定义事件v-on:cart-add（或者:cart-add）
				// this.$parent._drop(event.target);
				this.$emit("cart-add-food", event.target);
				Vue.set(this.food, "count", 1);
			}			
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
</style>