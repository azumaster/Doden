/**
 * Created by Doden on 2017.07.03
 */


import BtnGroup from '../../components/multiBtnGroup/multiBtnGroup.jsx';

class PriceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            choice: false,
            goodsPrice: null,
            current: 0,
            checked: []
        };
    }

    componentWillMount(){
        this.getData();
    }

    getData(){
        $.loading.show();
        $.req.getGoodsPrice({sort_id: this.props.params.tId, status: 0}, (res)=>{
            if(res.code==0){
                $.loading.hide();
                let all = res.data,
                    current = null;
                all.map((a)=>{
                    if(a.id == this.props.params.id){
                        current = a;
                    }
                });
                this.setState({
                    goodsPrice: current
                });
            }else{
                $.loading.hide();
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }

    componentDidMount(){
        this.createScroll();
    }

    createScroll(){
        let SCROLL = new IScroll('#priceList', {
            zoom: true,
            scrollX: false,  //是不中可以横向滚动;
            scrollY: true,  //是否可以纵向滚动;
            mouseWheel: true, //是否监听鼠标滚轮;
            wheelAction: 'zoom',
            probeType: 2,
            preventDefault: false
        });

        SCROLL.on('beforeScrollStart', () => {
            SCROLL.refresh();
        });
    }

    createPriceList(){
        let btnNames = [], btnData = [], checked = this.state.checked;

        if(this.state.goodsPrice){
            this.state.goodsPrice.brands.map((brand)=>{
                let increase = 0;
                if(brand.increase>0){
                    increase = '+'+Number(brand.increase*100).toFixed(1);
                } else if (brand.increase< 0) {
                    increase = Number(brand.increase*100).toFixed(1);
                }
                brand.i = increase;
                btnNames.push(brand);
                btnData.push(brand.brand_id);
            });
        }


        return (<BtnGroup btnNames={btnNames} btnData={btnData} style="btn-default" activeStyle="btn-market" clickCallback={this.toggle.bind(this)} checked={checked} />);
    }

    toggle(e){
        let index = e.target.dataset.index?e.target.dataset.index:e.target.parentNode.dataset.index,
            checked = this.state.checked,
            btnIndex = -1,
            isChecked = false;

        checked.map((c, i)=>{
            if(c == index){
                isChecked = true;
                btnIndex = i;
            }
        });

        if(isChecked){
            checked.splice(btnIndex, 1);
        }else {
            checked.push(index);
        }

        this.setState({
            checked:checked
        });
    }

    // 打开弹窗
    openUpdateDialog(type){
        let placeHolder = '';

        if(type == 'add'){
            placeHolder = '请输入加价比例';
        }else {
            placeHolder = '请输入降价比例';
        }

        $.dialog({
            title: '设置改价比例',
            seller: true,
            cancel: true,
            content:'<div id="sellerAddPrice" class="seller-add-price">' +
            '<div class="form"><label>' +
            '<input id="priceInput" type="number" class="price-input" placeholder='+placeHolder+'>%' +
            '</label>' +
            '<h5 class="text-left text-assist" style="margin-top:10px">按件卖商品，改价后，向上取整，精确到元。如加价后2.16元，则实际显示金额为3.00元。</h5><h5 class="text-left text-assist">按公斤、超码件、袋卖商品，改价后，向上取整，精确到角。如加价后2.12元，则实际显示金额为2.20元。</h5></div>' +
            '</div>',
            okCallback: ()=>{
                let percentage = $.selector('#priceInput').value,
                    brands_ids = this.state.checked;
                if(percentage<0){
                    $.toast({text: '改价比例不能低于0%', icon: 'info'});
                }else{
                    percentage = Math.round(percentage*10)/1000;

                    if(type != 'add'){
                        percentage = -percentage;
                    }

                    $.req.addPrice(JSON.stringify({sort_id: Number(this.props.params.id), percentage: percentage, brand_ids: brands_ids}), (res)=>{
                        if(res.code ==0 ){
                            $.toast({text:'改价成功'});
                            this.getData();
                        }else {
                            $.toast({text: res.message, icon: 'info'});
                        }
                    });
                }
            }
        });

        // 打开弹窗后输入框获取到焦点，且只能输入一位小数
        $.selector('#priceInput').focus();
        $.selector('#priceInput').addEventListener('keyup', ()=>{
            let input = $.selector('#priceInput');
            if(input.value.indexOf('.') != -1){
                if(input.value.split('.')[1]>9){
                    input.value = input.value.substr(0, input.value.length-1);
                }
            }
        }, false);
    }


    render() {
        return (<div className="price-list" id="priceList">
            <div id="scroller">
                <div className="price-title">
                    请选择改价品牌
                </div>
                <div className="price-add-btn-group">
                    {this.createPriceList()}
                </div>
            </div>
            <div className="price-list-btn" id="priceBtn">
                <div className="btn-toast cancel" onClick={this.openUpdateDialog.bind(this, 'sub')}>降价</div>
                <div className="btn-toast ok" onClick={this.openUpdateDialog.bind(this, 'add')}>加价</div>
            </div>
        </div>);
    }
}

export default PriceList;