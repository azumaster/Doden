class HistoryBack extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAndroid: false
        };
    }

    componentWillMount(){
        this.state.isAndroid = H.browser.versions.android;
    }

    historyBack(){
        window.history.back();
    }


    render() {
        return (
            <div className="back-wrap" onClick={this.historyBack}>
                {this.state.isAndroid ?  <span className="back-button">返回</span>
                                      :  null
                }
            </div>
        );
    }
}
export default HistoryBack;