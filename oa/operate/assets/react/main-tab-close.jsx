class TabClose extends React.Component {
    constructor(props) {
        super(props);
        this.closeTab = this.closeTab.bind(this);
    }


    closeTab(e) {
        e.stopPropagation();
        this.props.closeTabHandler && this.props.closeTabHandler(this.props.data);
    }

    render(){
        return (
            <i className="glyphicon tab-del-btn" onClick={this.closeTab}></i>
        );
    }
}

export default TabClose;