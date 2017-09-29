/*
* 领红包*/

class Instruction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: false,  //是否领取;
            num: 0
        };
    }

    //领取红包;
    getInstruction() {
        H.we_loading.show();
        H.server.dailyRedPack({}, (res) => {
            if(res.code == 0) {
                this.setState({
                    status: true,
                    num: res.data.num
                });
                this.props.setGetRed && this.props.setGetRed();
            }else {
                H.operationState(res.message);
            }
            H.we_loading.hide();
        });
    }

    closeLayer() {
        this.props.instructionStatus(false);
    }

    shareHandler() {
        this.props.instructionStatus(false);
        H.share.layer();
    }

    render() {
        return (
            <div className="instruction-wrap">
                <div className="instruction-content">
                    {
                        this.state.status ?
                            <div className="instruction-content-item">
                                <img className="instruction-img" src={H.localhost + 'Public/images/buyer-cli/instruction-has.png'} width="100%"/>
                                <i className="close-layer" onClick={this.closeLayer.bind(this)}></i>
                                <div className="instruction-has-text">恭喜你，领取到{this.state.num}钻石<br />下单时可以抵扣现金</div>
                                <div className="btn-wrap">
                                    <button className="share-btn" onClick={this.shareHandler.bind(this)}>分享给好友</button>
                                </div>
                            </div> :
                            <div className="instruction-content-item">
                                <img className="instruction-img" src={H.localhost + 'Public/images/buyer-cli/instruction-not.png'} width="100%"/>
                                <i className="close-layer" onClick={this.closeLayer.bind(this)}></i>
                                <div className="instruction-not-text">猜猜里面有多少</div>
                                <div className="btn-wrap">
                                    <button className="get-btn" onClick={this.getInstruction.bind(this)}>领取红包</button>
                                </div>
                            </div>
                    }
                </div>
            </div>
        );
    }
}

export default Instruction;