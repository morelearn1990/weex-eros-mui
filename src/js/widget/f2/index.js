import F2 from './f2.js';
import gesture from "./gesture.js"
import {
    enable,
    WeexBridge
} from "gcanvas.js";

let F2Weex = Object.create(null)

F2Weex.install = (Vue, options) => {
    Vue.prototype.$createChart = function (ref, opt) {
        let gcanvasRef = enable(ref, {
            bridge: WeexBridge
        });
        let {
            width,
            height
        } = ref.style
        if (!width || !height) {
            throw new Error("请指定 GCanvas 的 width 和 height")
        }
        let pixelRatio = weex.config.eros.scale || 1
        F2.Util.addEventListener = function (source, type, listener) {
            ref.addEvent(type, listener);
        };
        F2.Util.removeEventListener = function (source, type, listener) {
            ref.removeEvent(type);
        };
        Vue.prototype.$F2 = F2;
        let chart = new F2.Chart({
            el: gcanvasRef,
            width: width,
            height: height,
            pixelRatio,
            // plugins: gesture,
            ...opt
        });
        return chart
    }
}

Vue.use(F2Weex)
