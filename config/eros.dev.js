// appBoard，mediator 不建议进行修改 如果修改了 也请对应修改
module.exports = {
    'eslint': false,
    'webpackWarnings': false,
    'exports': [
        // appBoard
        'js/config/index.js',
        // mediator
        'js/mediator/index.vue',
        // home
        'js/pages/demo/index.vue',
        'js/pages/demo/simple-table/index.vue',
        'js/pages/demo/complex-table/index.vue',
        'js/pages/demo/selector/index.vue',
        'js/pages/demo/status-extr/index.vue',
        'js/pages/demo/f2/index.vue',
        'js/pages/demo/event/index.vue',
    ],
    'alias': {
        'Components': 'js/components',
        'Common': 'js/common',
        'Config': 'js/config',
        'Widget': 'js/widget',
        'Pages': 'js/pages',
        'Utils': 'js/utils'
    },
    'diff': {
        'pwd': '/Users/yangmingzhe/Work/opensource/eros-diff-folder',
        'proxy': 'https://app.weex-eros.com/source'
    },
    'server': {
        'path': './',
        'port': 8889
    },
    'mockServer': {
        'port': 52077,
        'mockDir': './dist/mock'
    },
    'socketServer': {
        'port': 8890,
        'switch': true
    }
}
