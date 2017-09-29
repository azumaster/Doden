/*
* 商品中客户咨询*/

class Consulting extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if(!nextProps.goodsId || nextProps.sheetState != 2) return;
        H.server.goodsInfoSupplier({goods_id: nextProps.goodsId}, (res) => {
            if(res.code == 0) {
                let name = res.data.seller_name,
                    marketName = res.data.point_of_departure;
                H.sheet.create({
                    title: '咨询台',
                    content: '<div class="actionsheet_cell read-only">' +
                    '<div class="actionsheet_item center">在线客服：平台交易员</div>'+
                    '<div class="actionsheet_item center">售后服务：由'+' “'+name+'('+marketName+')'+'” 提供</div>'+
                    '<div class="actionsheet_item center" style="color: #888;">电话咨询后，立即在线下单，就有机会获得200钻石</div>'+
                    '</div>',
                    cancel: '关闭',
                    confirm: '拨打',
                    confirmCallback: () => {
                        window.location.href = 'tel:15208359521';
                    }
                });
            }else {
                H.operationState(res.message);
            }
        });
    }

    render() {
        return(
            <div style={{display: 'none'}}></div>
        );
    }
}

export default Consulting;