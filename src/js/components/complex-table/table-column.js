export default {
    name: "TableClomn",
    props: {
        prop: String,
        width: {
            type: Number,
            default: 200
        },
        label: String,
        className: String,
        labelClassName: String
    },
    created() {
        const owner = this.$parent;
        let columnIndex, columnConfig;
        let {
            prop,
            width,
            label,
            className,
            labelClassName
        } = this
        columnConfig = {
            prop,
            width,
            label,
            className,
            labelClassName
        }
        columnIndex = [].indexOf.call(owner.$children, this);
        owner.store.commit('insertColumn', columnConfig, columnIndex);
    }
}
