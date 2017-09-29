class Input extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.value == undefined){
            return;
        }
        this.refs.input.value = nextProps.value;
    }

    render() {
        let props = this.props;
        return (
            <div className={this.props.style ? 'cell-row ' + this.props.style : 'cell-row'}>
                <div className="cell-head">
                    {props.title}
                </div>

                <div className="cell-body" style={props.cellStyle == 'hidden' || (props.title=='价格'&&props.value) ? {display: 'none'} : {}}>
                    <input ref="input" className={props.cellStyle? props.cellStyle + ' cell-input' : 'cell-input'}
                           data-para ={props.para} placeholder={props.placeholder} type={props.format ? 'number' : 'text'} />
                </div>

                <div className="cell-foot" style={props.cellStyle == 'hidden' ? {textAlign: 'right', flex: 1, webkitBoxFlex: 1, webkitFlex: 1, mozBoxFlex: 1} : {}} data-index={props.index}>
                    {props.format ? (props.title == '价格'&&props.value ) : this.props.children}
                </div>
                {
                    props.title == '带箱重' || props.title == '去箱重' ? <div>公斤</div> : null
                }
            </div>
        );
    }

}
export default Input;