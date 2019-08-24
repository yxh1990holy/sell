<template>
	<div class="cartcontrol">
		<transition name="move">
			<div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)">
				<span class="inner icon-remove_circle_outline"></span>
			</div>			
		</transition>
		<!-- 给数字添加过渡更加流畅 -->
		<transition name="count-move">
			<div class="cart-count" v-show="food.count>0">{{ food.count }}</div>
		</transition>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
	</div>
</template>
<script type="text/ecmascript-6">
	import Vue from 'vue';
	export default {
		props: {
			food: {
				type: Object
			}
		},
		methods:{
			//增加event是为了阻止PC端点击会出现两次增加，实际我这里没有出现该种情况
			//可以去掉第一个if语句
			addCart(event) {
				if(!event._constructed) {
					return;
				}
				if (!this.food.count) {
					// 使用这种方法是为了vue能正常观测count变化
					Vue.set(this.food, 'count', 1);
					// this.food.count = 1;
				} else {
					this.food.count++;
				}
				// console.log('this.food.count:'+this.food.count);
				// console.log('调用到cartcontrol.vue中的addCart方法并分发cartAdd');
				// this.$emit('cart-add-cartcontrol', event.target);
				this.$root.eventHub.$emit('cart.add', event.target);
			},
			decreaseCart(event) {
				if(!event._constructed) {
					return;
				}
				if (this.food.count>0) {
					this.food.count--;
				}
			}
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
	.cartcontrol
		font-size: 0
		.cart-decrease
			display: inline-block
			padding: 6px
			.inner
				display: inline-block
				line-height: 24px
				font-size: 24px
				color: rgb(0, 160, 220)	
			&.move-enter-active, &.move-leave-active
				transition: all 0.5s linear
				pacity: 1
				transform: translate3d(0, 0, 0)
				.inner
					transition: all 0.5s
					opacity: 1
					transform: rotate(0deg)
			&.move-enter, &.move-leave-active
				opacity: 0
				transform: translate3d(24px, 0, 0)/*开启硬件加速，让动画更流畅*/
				.inner
					opacity: 0
					transform: rotate(180deg)	/* 旋转180度 */	
		.cart-count
			display: inline-block
			vertical-align: top
			width: 12px
			padding-top: 6px
			line-height: 24px
			text-align: center
			font-size: 10px
			color: rgb(147, 153, 159)
			&.count-move-enter-active,&.count-move-leave-active
				transition: all 0.5s linear
				opacity: 1
			&.count-move-enter, &.count-move-leave-active
				opacity: 0
		.cart-add
			display: inline-block
			padding: 6px
			line-height: 24px
			font-size: 24px
			color: rgb(0, 160, 220)			
</style>