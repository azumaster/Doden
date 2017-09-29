import GoodsAdd from './component/goods_add.jsx';
import GoodsUpdate from './component/goods_update.jsx';
import Validation from 'react-validation';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goods_id: null,
            type: null,
            rules: [],
            units: []
        };
        Object.assign(Validation.rules, {
            required: {
                rule: value =>{
                    return  value;
                },
                hint: ()=>{
                    return <span>{null}</span>;
                }
            },
            number: {
                rule: value =>{
                    return H.isNumber(value);
                },
                hint: ()=>{
                    return <span>请输入数字</span>;
                }
            },
            price:{
                rule: value =>{
                    if(!value) return true;
                    return  /^(0|([1-9][0-9]{0,3}))(\.[0-9]{1,2})?$/.test(value);
                },
                hint: ()=>{
                    return H.operationState('价格只支持小数点后两位,且单价不超过一万.', 1000);
                }
            }
        });
    }

    static childContextTypes = {
        goods_id: React.PropTypes.number,
        units: React.PropTypes.array,
        rules: React.PropTypes.array
    };

    getChildContext(){
        return {
            goods_id: this.state.goods_id,
            units: this.state.units,
            rules: this.state.rules
        };
    }

    //初始化
    componentWillMount(){
        let goodsID = H.urlParam('goodsID');
        if(goodsID) {
            this.state.type = 1;
            this.state.goods_id = goodsID;
        }
        H.weSign(['chooseImage', 'uploadImage']);
        //$('#multi_choice_wrap').show();
        H.server.getUnits(null, (res)=>{
            if(res.code == 0){
                this.state.units = res.data;
                this.forceUpdate();
            }else{
                H.operationState(res.message);
            }
        });
        H.server.getPriceRules({goods_id: this.state.goods_id}, (res)=>{
            if(res.code == 0){
                this.state.rules = res.data.price_rules;
                this.forceUpdate();
            }else{
                H.operationState(res.message);
            }
        });
    }


    render() {
        return (
            <div>
                {this.state.goods_id ? <GoodsUpdate type={this.state.type} goods_id={this.state.goods_id} /> :
                    <GoodsAdd type={this.state.type} />}
            </div>
        );
    }
}
export default Main;