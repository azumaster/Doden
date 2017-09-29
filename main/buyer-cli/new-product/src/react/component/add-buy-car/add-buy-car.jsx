/*
* 二批商下单时，加入购物车
* */

class AddBuyCar extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if(!nextProps.goodsId || nextProps.sheetState != 1) return;
        H.server.goodsInfoSupplier({goods_id: nextProps.goodsId}, (res) => {
            if(res.code == 0) {
                H.sheet.consulting({
                    title: '加入购物车',
                    content: '<div class="actionsheet_cell read-only">' +
                    '<div class="actionsheet_item center">精品六各鸡腿</div>'+
                    '<div class="actionsheet_item center">136元/件</div>'+
                    '<div class="actionsheet_item center"><span class="label" style="width: 3em;">数量</span><div class="flex-num1"><div class="flex-box">' +
                    '<div class="input"><input type="tel" class="input-item" style="width: 80px;text-align: center;padding-right: 10px;" />件</div></div></div></div>'+
                    '<div class="actionsheet_item center" style="color: #888;">5件起售，最多购买1000件</div>'+
                    '</div>',
                    cancel: '关闭',
                    confirm: '加入购物车',
                    confirmCallback: () => {
                        alert('加入购物车');
                    }
                });
            }else {
                H.operationState(res.message);
            }
        });
    }

    render() {
        return (
            <div style={{display: 'none'}}></div>
        );
    }
}

export default AddBuyCar;