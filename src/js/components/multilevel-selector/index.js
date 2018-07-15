import MMultiSelector from "./selector-pan-delay.vue"
export default MMultiSelector

// selector-list 使用 list 内置组件和 scroll 手势来操作，只测试了 ios ，Android 可能会出现问题
// selector-scroller 不能用，使用 scroller 时第一个 selector 总是横向和纵向都能滚动，不知道为啥？ 
// selector-pan 兼容性好像要好点，但是操作起来会感觉不好，因为快速滑动后没有后续滑动的动画
// selector-pan-delay 在 selector-pan 的基础上增加了延时滚动动画
