<template>
	<div>
		<div class="shopcart">
			<div class="content" @click="toggleList">
				<div class="content-left">
					<div class="logo-wrapper">
						<div class="logo" :class="{'highlight':totalCount>0}">
							<i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
						</div>
						<div class="num" v-show="totalCount>0">{{ totalCount }}</div>
					</div>
					<div class="price" :class="{'highlight':totalPrice>0}">￥{{ totalPrice }}元</div>
					<div class="desc">另需配送费￥{{ deliveryPrice }}元</div>
				</div>
				<div class="content-right" @click.stop.prevent="pay">
					<div class="pay" :class="payClass">
						{{ payDesc }}
					</div>
				</div>			
			</div>
			<div class="ball-container">
				<transition-group name="drop" @before-enter="beforeEnter" @enter="dropEnter" @after-enter="afterEnter">
					<div class="ball" v-for="(ball, index) in balls" v-show="ball.show" :key="ball+index">
							<div class="inner inner-hook"></div>
					</div>
				</transition-group>				
			</div>
			<transition name="fold">
				<div class="shopcart-list" v-show="listShow">
					<div class="list-header">
						<h1 class="title">购物车</h1>
						<span class="empty" @click="empty">清空</span>
					</div>
					<div class="list-content" ref="listContent">
						<ul>
							<li class="food" v-for="food in selectFoods">
								<span class="name">{{ food.name }}</span>
								<div class="price">
									<span>￥{{ food.price*food.count }}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<cartcontrol :food="food"></cartcontrol>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</transition>
		</div>
		<transition name="mask">
			<div class="list-mask" @click="hideList" v-show="listShow"></div>
		</transition>
	</div>
</template>
<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
  import cartcontrol from '@/components/cartcontrol/cartcontrol'
	export default {
		props: {
			selectFoods: {
				type: Array,
				default() {
					return [
						// {
						// 	price: 20,
						// 	count: 1
						// }
					];
				}
			},
			deliveryPrice: {
				type: Number,
				default: 0
			},
			minPrice: {
				type: Number,
				default: 0
			}
		},
		components: {
			cartcontrol
		},
		data() {
			return {
				balls: [
					{	show: false	}, { show: false },	{show: false }, { show: false	}, { show: false }
				],
				// 添加一个变量，用来存储已经下落的小球
				dropBalls: [],
				// 购物车详情列表默认折叠
				fold: true
			}
		},
		computed: {
			totalPrice() {
				let total = 0;
				this.selectFoods.forEach((food) => {
					total += food.price * food.count;
				});
				return total;
			},
			totalCount() {
				let count = 0;
				this.selectFoods.forEach((food) => {
					count += food.count;
					// console.log("food-name:"+food.name+";food-count:"+ count);
				});				
				return count;
			},
			payDesc() {
				if (this.totalPrice === 0) {
					return `￥${this.minPrice}元起送`;
				}else if(this.totalPrice<this.minPrice) {
					let diff = this.minPrice - this.totalPrice;
					return `还差￥${diff}元起送`;
				}else{
					return '去结算';
				}
			},
			payClass() {
				if(this.totalPrice < this.minPrice){
					return 'not-enough';
				}else{
					return 'enough';
				}
			},
			listShow() {
				if(!this.totalCount) {
					this.fold = true;
					return false;
				}
				let show = !this.fold;
				if (show) {
					this.$nextTick(() => {
						if(!this.scroll) {
							this.scroll = new BScroll(this.$refs.listContent, {click: true});
						}	else {
							this.scroll.refresh();
						}					
					});
				}
				return show;
			}
		},
		created() {
		  // 获取按钮组件的点击的元素，用在drop方法里
		  this.$root.eventHub.$on('cart.add', this.drop);
		},
		beforeDestroy() {
		  this.$root.eventHub.$off('cart.add', this.drop);
		},	
		methods: {
			drop (el) {
				// console.log('调用到shopcart.vue中的drop方法');
				// console.log(el);
				for(let i=0; i<this.balls.length; i++) {
					let ball = this.balls[i];
					if(!ball.show) {
						ball.show = true;
						ball.el = el;
						this.dropBalls.push(ball);
						return;
					}
				}
			},
			beforeEnter(el, done) {
				// console.log('调用到shopcart.vue中的beforeEnter方法');
				let count = this.balls.length;
				while(count--) {
					let ball = this.balls[count];
					if(ball.show) {
						let rect = ball.el.getBoundingClientRect();	//返回元素的大小及其相对于视口的位置
						let x = rect.left - 32;	//ball-container left:32
						let y = -(window.innerHeight - rect.top -22);
						el.style.display = '';
						el.style.transform = `translate3d(0, ${y}px, 0)`;		//外层元素纵向移动
						el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
						let inner = el.getElementsByClassName('inner-hook')[0]; //内层元素横向移动
						inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
						inner.style.transform = `translate3d(${x}px, 0, 0)`;
						// console.log(el);
					}
				}
			},
			dropEnter(el, done) {
				// console.log('调用到shopcart.vue中的dropEnter方法');
				/* 手动取到offsetHeight，触发浏览器重绘 */
				let rf = el.offsetHeight;
				this.$nextTick(() => {	//样式重置回来
					el.style.webkitTransform = 'translate3d(0, 0, 0)';	//设置小球掉落后最终的位置
					el.style.transform = 'translate3d(0, 0, 0)';
					let inner = el.getElementsByClassName('inner-hook')[0];
					inner.style.webkitTransform = 'translate3d(0, 0, 0)';
					inner.style.transform = 'translate3d(0, 0, 0)';
					//Vue为了知道过渡的完成，必须设置相应的时间监听器。他可以是transitionend或animationend
					el.addEventListener('transitionend', done);	
				});
			},
			afterEnter(el) {
				// console.log('调用到shopcart.vue中的afterEnter方法');
				let ball = this.dropBalls.shift();
				if(ball) {
					ball.show = false;
					el.style.display = 'none';
				}
			},
			toggleList() {
				if(!this.totalCount) {
					return;
				}
				this.fold = !this.fold;
			},
			hideList() {
				this.fold = true;
			},
			empty() {
				this.selectFoods.forEach((food) => {
					food.count = 0;
				});
			},
			pay() {
				if(this.totalPrice < this.minPrice) {
					return;
				}
				window.alert(`支付${this.totalPrice}`);
			}
		}
	};
</script>
<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"
	.shopcart
		position: fixed
		left: 0
		bottom: 0
		z-index: 50
		width: 100%
		height: 48px
		.content
			display: flex
			background: #141d27
			font-size: 0
			color: rgba(255, 255, 255, 0.4)
			.content-left
				flex: 1
				.logo-wrapper
					display: inline-block
					position: relative
					top: -10px
					margin: 0 12px 
					padding: 6px
					width: 56px
					height: 56px
					box-sizing: border-box
					vertical-align: top
					border-radius: 50%
					background: #141d27
					.logo
						width: 100%
						height: 100%
						border-radius: 50%
						text-align: center
						background: #2b343c
						&.highlight
							background: rgb(0, 160 ,220)
						.icon-shopping_cart
							line-height: 44px
							font-size: 24px
							color: #80858a
							&.highlight
								color: #fff
					.num
						position: absolute
						top: 0
						right: 0
						width: 24px
						height: 16px
						line-height: 16px
						text-align: center
						border-radius: 16px
						font-size: 9px
						font-weight: 700
						color: #fff
						background: rgb(240, 20, 20)
						box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
				.price
					display: inline-block
					vertical-align: top
					margin-top: 12px
					line-height: 24px
					padding-right: 12px
					box-sizing: border-box
					border-right: 1px solid rgba(255, 255, 255, 0.1)
					font-size: 16px
					font-weight: 700
					&.highlight
						color: #fff
				.desc
					display: inline-block
					vertical-align: top
					margin: 12px 0 0 12px
					line-height: 24px
					font-size: 10px
			.content-right
				flex: 0 0 105px
				width: 105px
				.pay
					height: 48px
					line-height: 48px
					text-align: center
					font-size: 12px
					font-weight: 700					
					&.not-enough
						background: #2b333b
					&.enough
						background: #00b43c
						color: #fff
		.ball-container
			.ball
				position: fixed
				left: 32px
				bottom: 22px
				z-index: 200
				.inner
					width: 15px
					height: 15px
					border-radius: 50%
					background-color: #00A0DC
					transition: all 1s linear
				&.drop-enter-active
					transition: all 1s cubic-bezier(0.49, -0.29, 0.75, 0.41)				
		.shopcart-list
			position: absolute
			left: 0
			top: 0
			z-index: -1
			width: 100%
			transform: translate3d(0, -100%, 0)
			&.fold-enter-active, &.fold-leave-active
				transition: all 0.5s
				transform: translate3d(0, -100%, 0)
			&.fold-enter, &.fold-leave-active
				transform: translate3d(0, 0, 0)
			.list-header
				height: 40px
				line-height: 40px
				padding: 0 18px
				background: #f3f5f7
				border-bottom: 1px solid rgba(7, 17, 27, 0.1)
				.title
					float: left
					font-size: 14px
					color: rgb(7, 17, 27)
				.empty
					float: right
					font-size: 12px
					color: rgb(0, 160, 220)	
			.list-content
				padding: 0 18px
				max-height: 217px
				overflow: hidden
				background: #fff
				.food
					position: relative
					padding: 12px 0
					box-sizing: border-box
					border-1px(rgba(7, 17, 27, 0.1))
					.name
						line-height: 24px
						font-size: 14px
						color: rgb(7, 17, 27)
					.price
						position: absolute
						right: 90px
						bottom: 12px
						line-height: 24px
						font-size: 14px
						font-weight: 700
						color: rgb(240, 20, 20)
					.cartcontrol-wrapper
						position: absolute
						right: 0
						bottom: 6px							
	.list-mask
		position: fixed
		top: 0 
		left: 0
		width: 100%
		height: 100%
		z-index: 40
		backcdrop-filter: blur(10px)
		opacity: 1
		background: rgba(7, 17, 27, 0.6)
		&.mask-enter-active, &.mask-leave-active			
			transition: all 0.5s					
		&.mask-enter, &.mask-leave-active
			opacity: 0
			background: rgba(7, 17, 27, 0)	
</style>