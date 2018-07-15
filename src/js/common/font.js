export default {
    created() {
        const domModule = weex.requireModule('dom')
        domModule.addRule('fontFace', {
            'fontFamily': "iconfont",
            'src': "url('http://at.alicdn.com/t/font_748019_td013tz5sn.ttf')"
        })
    }
}
