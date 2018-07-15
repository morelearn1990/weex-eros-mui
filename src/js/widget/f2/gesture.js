const BUBBLE_EVENTS = [
    'click', 'longpress', 'touchstart', 'touchmove', 'touchend',
    'panstart', 'panmove', 'panend', 'horizontalpan', 'verticalpan', 'swipe'
]

const defaultOptions = {
    useCalculate: true, // 计算事件触发位置，对应的图表的数据. 关闭返回null
    useOffset: false // 计算数据是否需要计算图表相对页面偏移的坐标
};

class GestureController {
    constructor({
        ref,
        gesture,
        chart
    }) {
        this.dom = ref;
        this.gesture = gesture;
        this.options = defaultOptions;
        this.chart = chart;
        this._unbindEvent = {}; // 没有绑定事件
    }
    // 等geom绘制完再绑定事件
    bindEvents() {
        const {
            gesture,
            dom
        } = this;
        const {
            useCalculate
        } = this.options;
        for (const key in gesture) {
            // 基础的事件，hammer没提供，手动绑定。
            if (['touchstart', 'touchmove', 'touchend'].indexOf(key) !== -1) {
                const bindEvent = event => {
                    const records = useCalculate ? this.getEventPostionRecords(event, true) : null;
                    gesture[key](records, event);
                };
                Util.addEventListener(dom, key, bindEvent);
                this._unbindEvent[key] = bindEvent;
            } else {
                hammer.on(key, event => {
                    const records = useCalculate ? this.getEventPostionRecords(event, false) : null;
                    gesture[key](records, event);
                });
            }
        }
    }
    // 获取发生手势事件对应的数据
    getEventPostionRecords(event, _isOrigin) {
        const {
            useOffset
        } = this.options;
        const canvasDom = this.chart.get('canvas').get('el');
        let x;
        let y;
        // 原生的事件
        if (_isOrigin) {
            const positionSource = event.targetTouches.length > 0 ? event.targetTouches[0] : event.changedTouches[0];
            if (useOffset) {
                x = positionSource.clientX - canvasDom.offsetLeft;
                y = positionSource.clientY - canvasDom.offsetTop;
            } else {
                x = positionSource.clientX;
                y = positionSource.clientY;
            }
        } else {
            if (useOffset) {
                x = event.center.x - canvasDom.offsetLeft;
                y = event.center.y - canvasDom.offsetTop;
            } else {
                x = event.center.x;
                y = event.center.y;
            }
        }
        return this.chart.getSnapRecords({
            x,
            y
        });
    }
    destroy() {
        for (const key in this._unbindEvent) {
            const event = this._unbindEvent[key];
            Util.removeEventListener(this.dom, key, event);
        }
    }
}

module.exports = {
    init(chart) {
        // 在chart对象上增加一个方法，用于插件传参数。
        chart.pluginGesture = function ({
            gesture,
            options,
            hammerOptions
        }) {
            const canvasDom = chart.get('canvas').get('el');
            const gestureController = new GestureController({
                dom: canvasDom,
                gesture,
                options,
                hammerOptions,
                chart
            });
            gestureController.bindEvents();
            chart.set('gestureController', gestureController);
            return gestureController;
        };
    },
    clear(chart) {
        const gestureController = chart.get('gestureController');
        gestureController && gestureController.destroy();
    }
};
