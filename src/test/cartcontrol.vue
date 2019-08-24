<template>
	<div class="cartcontrol">
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)">数量控制组件</div>
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
			addCart(event) {
				// console.log('调用到cartcontrol.vue中的addCart方法并分发cartAdd');
				this.$emit('cart-add-cartcontrol', event.target);
			}
		}
	}
</script>
