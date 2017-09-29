/*
* 商品详情底部工具条;
* create: xy, time: 2017-03-09
* */

class Toolbar extends React.Component {
    constructor(props) {
        super(props);
    }

    consult() {
        $.req.contactShop({}, (res) => {
            if(res.code == 0) {
                location.href = 'tel:'+res.data.mobile;
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }

    addCar() {
        let data = this.props.data,
            num = 1;
        if(data.goods_start_num > 0) {
            num = data.goods_start_num;
        }
        let dialog = $.dialog({
            title: '加入进货单',
            content: '<div class="add-car-dialog"><div class="flex hd border-bottom">' +
            '<div><img class="goods-img" src="'+$.cdn() + data.goods_picture[0].goods_image + $.img(80, 90) +'" width="60px" aria-checked="60px" /></div>' +
            '<div class="flex-item goods-info"><div>商品名：'+data.goods_name+'</div><div>净重：'+data.goods_net_weight+'kg</div></div></div>' +
            '<div class="edit-num">请输入你要购买的数量 <span id="reductionNum" class="reduction sub icon"></span><input id="addCarNum" type="tel" value="'+num+'" />' +
            '<span id="addNum" class="add icon"></span></div></div>',
            cancel: '取消',
            autoClose: false,
            okCallback: () => {
                let val = $.selector('#addCarNum').value,
                    param = {goods_id: this.props.data.goods_id, buy_num: val};
                if(!parseInt(val)) {
                    $.selector('#addCarNum').focus();
                    return;
                }
                $.req.addCar(JSON.stringify(param), (res) => {
                    dialog.hide();
                    if(res.code == 0) {
                        $.toast({text: '成功加入购物车', icon: 'ok'});
                    }else {
                        $.toast({text:res.message, icon: 'info'});
                    }
                });
            }
        });
        let addNumNode = $.selector('#addNum'),
            reductionNumNode = $.selector('#reductionNum'),
            addCarNumNode = $.selector('#addCarNum');

        addNumNode.onclick = (e) => {
            e.preventDefault();
            let val = parseInt(addCarNumNode.value),
                inventory = data.goods_inventory || 9999;
            if(val < inventory) {
                addCarNumNode.value = val+1;
            }
        };
        reductionNumNode.onclick = (e) => {
            e.preventDefault();
            let val = parseInt(addCarNumNode.value);
            if(val > num) {
                addCarNumNode.value = val-1;
            }
        };
    }

    render() {
        let data = this.props.data;
        return (
            <div className="goods-toolbar flex border-top">
                <a className="items consult flex-item" onClick={this.consult.bind(this)}>
                    <span className="icon-consult"></span>
                    <p>咨询</p>
                </a>
                <a className="items car-list flex-item" href="#/buyer/car">
                    <span className="icon-car-list"></span>
                    <p>进货单</p>
                </a>
                {
                    data.on_sale == 2 && data.goods_status == 2 && !data.expired ? <a className="items add-car flex-item" onClick={this.addCar.bind(this)}>加入进货单</a> :
                        <a className="items no-add-car flex-item">已下架</a>
                }
            </div>
        );
    }
}

export default Toolbar;