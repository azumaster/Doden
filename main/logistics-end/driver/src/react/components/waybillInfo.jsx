/**
 * 运单详情的显示
 */

class WaybillInfo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            startY:0,
            endY:0
        };
    }


    toggleMenu(){
        if($('#waybillInfo').hasClass('active')){
            $('#waybillInfo').removeClass('active');
        } else {
            $('#waybillInfo').addClass('active');
        }

    }

    startTouch(e) {
        let touch = e.targetTouches[0];
        this.setState({
            startY: touch.pageY
        });
    }

    moveToggleMenu(e) {
        let touch = e.targetTouches[0];
        this.setState({
            endY: touch.pageY
        });
    }

    endTouch(){
        let map = this.props.map,
            allMarker = map.getAllOverlays('marker');

        if($('#waybillInfo').hasClass('active')){
            if(this.state.endY - this.state.startY > 30){
                map.panBy(0, 180);
                allMarker.map((m)=>{
                    m.setIconStyle('http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png');
                });
                this.toggleMenu();
            }
        } else {
            if(this.state.startY - this.state.endY > 30){
                this.toggleMenu();
            }
        }

    }

    render() {
        let waybillInfo = this.props.location,
            code = '';

        if(!waybillInfo) {
            return null;
        }

        code = H.getLadingCode(waybillInfo.code, [2, 3, 4]);

        return(
            <div id="waybillInfo" className={this.props.style} onTouchStart={this.startTouch.bind(this)}
                 onTouchMove={this.moveToggleMenu.bind(this)} onTouchEnd={this.endTouch.bind(this)}>
                <div className="waybill-info-title">
                    <span className="icon title-icon">&#xe60d;</span>
                    <span className="address">{waybillInfo.address.full}</span>
                    {this.props.error?<span className="error"><a href="javascript:" className="error-link" onTouchEnd={this.props.touchCallback}>地址报错</a></span>:null}
                    <span className="icon toggle" id="toggle" onTouchEnd={this.toggleMenu.bind(this)}>&#xe606;</span>
                </div>
                <div className="waybill-info-content">
                    <div className="info">
                        <h5 className="sub-title">配送信息</h5>
                        <div className="detail-info">
                            <span className="mark mark-green detail-mark"></span>
                            <span className="detail-label">发货人</span>
                            <span className="detail-value"><a className="tel-link" href={'tel://'+waybillInfo.shop.mobile}>{waybillInfo.shop.mobile}</a></span>
                        </div>
                        <div className="detail-info">
                            <span className="mark mark-red detail-mark"></span>
                            <span className="detail-label">收货人</span>
                            <span className="detail-value">
                                <a className="tel-link" href={'tel://'+waybillInfo.custom.mobile}>{waybillInfo.custom.mobile}</a>
                                ({waybillInfo.custom.name})
                            </span>
                        </div>
                    </div>
                    <div className="info">
                        <h5 className="sub-title">订单信息</h5>
                        <div className="detail-info">
                            <span className="mark mark-green detail-mark"></span>
                            <span className="detail-label">运单号</span>
                            <span className="detail-value">{waybillInfo.day_no}</span>
                        </div>
                        <div className="detail-info">
                            <span className="mark mark-red detail-mark"></span>
                            <span className="detail-label">提货码</span>
                            <span className="detail-value">{code}</span>
                        </div>
                    </div>

                    {this.props.remark? <textarea className="info textarea" id="remark" placeholder="点击添加备注" defaultValue={waybillInfo.note}></textarea> :null}
                </div>
                {this.props.operate?
                    <div className="tab-nav sub-tab-nav">
                        <a href="javascript:;" className="btn-item" onTouchEnd={this.props.touchCallback}>{this.props.operate[0]}</a>
                        <a href="javascript:;" className="btn-item" onTouchEnd={this.props.touchCallback}>{this.props.operate[1]}</a>
                        <a href="javascript:;" className="btn-icon icon" onTouchEnd={this.props.touchCallback}>&#xe600;</a>
                    </div>
                    :null}
            </div>
        );
    }
}

export default WaybillInfo;