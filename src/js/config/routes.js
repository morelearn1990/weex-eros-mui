// 这里的后缀都是 .js 因为打包出来的都是js文件，而不是.vue文件，我们要告诉客户端跳转那个js

//  这里的路径和dev.json路径的区别
//  pages里面配置的是路由跳转的地址，也就是dev生成的 dist文件夹下的js bundle路径 从dist/js开始
//  dev.json 的 exports 需要打包的js地址，填入src的需要被打包成js bundle的地址   从src开始

export default {
    'index': {
        title: 'index',
        url: '/pages/demo/index.js'
    },
    'simple-table': {
        title: '简单表',
        url: '/pages/demo/simple-table/index.js'
    },
    'complex-table': {
        title: '复杂表',
        url: '/pages/demo/complex-table/index.js'
    },
    'selector': {
        title: '选择器',
        url: '/pages/demo/selector/index.js'
    },
    'status.extr': {
        title: '状态栏撑高',
        url: '/pages/demo/status-extr/index.js'
    },
    'f2': {
        title: 'F2 图表',
        url: '/pages/demo/f2/index.js'
    },
    'event': {
        title: 'event 事件监听和触发',
        url: '/pages/demo/event/index.js'
    },
}
