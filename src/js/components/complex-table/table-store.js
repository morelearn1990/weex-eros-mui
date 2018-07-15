let TableStore = function (table, initialState = {}) {
    if (!table) {
        throw new Error('Table is required.');
    }
    this.table = table;

    this.states = {
        data: table.data,
        columns: [],
        sortProp: [],
        currentRow: [],
        filters: {},
        order: {
            index: null, //排序 index
            flag: 0 //正反序   0 正序，1反序 
        }
    }
    this.table.$watch("data", (newVal, oldVal) => {
        this.states.data = newVal
    })
    for (let prop in initialState) {
        if (initialState.hasOwnProperty(prop) && this.states.hasOwnProperty(prop)) {
            this.states[prop] = initialState[prop];
        }
    }
}
TableStore.prototype.mutations = {
    insertColumn(states, column, index) {
        let array = states.columns;
        index >= array.length ? array.push(column) : array.splice(index, 0, column)
    },
}

TableStore.prototype.commit = function (name, ...args) {
    const mutations = this.mutations;
    if (mutations[name]) {
        mutations[name].apply(this, [this.states].concat(args));
    } else {
        throw new Error(`Action not found: ${name}`);
    }
}
TableStore.prototype.orderColum = function (index) {
    let {
        states
    } = this;

    if (index != states.order.index || (index == states.order.index && states.order.flag == 1)) {
        states.order.index = index
        states.order.flag = 0
        order(this.table.data, states.columns[index].prop)
        return;
    }
    states.order.flag = 1
    orderReverse(this.table.data, states.columns[index].prop)

    function order(data, prop) {
        let dataTemp = [];
        dataTemp[0] = data[0];
        for (let i = 1; i < data.length; i++) {
            let length = dataTemp.length
            if (valueConvert(data[i][prop], dataTemp[0][prop]) < 0) {
                dataTemp.unshift(data[i])
                continue;
            }
            if (valueConvert(data[i][prop], dataTemp[length - 1][prop]) >= 0) {
                dataTemp.push(data[i])
                continue;
            }
            for (let j = 0; j < length - 1; j++) {
                if (valueConvert(data[i][prop], dataTemp[j][prop]) >= 0 && valueConvert(data[i][prop], dataTemp[j + 1][prop]) < 0) {
                    dataTemp.splice(j + 1, 0, data[i])
                    break;
                }
            }
        }
        states.data = dataTemp
    }

    function orderReverse(data, prop) {
        let dataTemp = [];
        dataTemp[0] = data[0];
        for (let i = 1; i < data.length; i++) {
            let length = dataTemp.length
            if (valueConvert(data[i][prop], dataTemp[0][prop]) >= 0) {
                dataTemp.unshift(data[i])
                continue;
            }
            if (valueConvert(data[i][prop], dataTemp[length - 1][prop]) < 0) {
                dataTemp.push(data[i])
                continue;
            }
            for (let j = 0; j < length - 1; j++) {
                if (valueConvert(data[i][prop], dataTemp[j][prop]) < 0 && valueConvert(data[i][prop], dataTemp[j + 1][prop]) >= 0) {
                    dataTemp.splice(j + 1, 0, data[i])
                    break;
                }
            }
        }
        states.data = dataTemp
    }

    function valueConvert(value1, value2) {
        let num1 = parseFloat(value1),
            num2 = parseFloat(value2);
        if (isNaN(num1) || isNaN(num2)) {
            let str1 = String(value1)
            let str2 = String(value2)
            return compare(str1, str2)
        } else {
            return compare(num1, num2)
        }
    }

    function compare(value1, value2) {
        return value1 > value2 ? 1 : value1 == value2 ? 0 : -1
    }

}

export default TableStore
