import EventEmitter from 'wolfy87-eventemitter';

export default class Renderer extends EventEmitter {
    constructor(myCtx) {
        super();
        const self = this;
        self.ctx = myCtx;
        self.style = {};
        console.log("myCtx", myCtx)
    }

    getContext(type) {
        if (type === '2d') {
            return this.ctx;
        }
    }
}
