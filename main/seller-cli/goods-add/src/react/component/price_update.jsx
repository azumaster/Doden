import Validation from 'react-validation';
class PriceUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectListDOM: null,    //DOM结构
            filled: false,          //是否填写完毕了
            discountType: 0,         //优惠类型
            rulesDOM: [],            //model
            nameIndex: 0,            //符合默认的索引
            date: 0,                 //防止触发双次点击
            ifAdd: false
        };
        this.eventHandler= this.eventHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    static contextTypes = {
        goods_id: React.PropTypes.number,
        units: React.PropTypes.array,
        rules: React.PropTypes.array
    };

    static defaultProps = {
        price_rules: []
    };


    componentWillMount(){
        this.props.price_rules= [];
        if(this.props.basic_attr.price_rules){
            this.props.price_rules = this.props.basic_attr.price_rules;
        }
        this.createSelect();
    }

    componentDidUpdate(){
        this.state.SCROLL.refresh();
    }

    componentDidMount(){
        this.createScroll();
        this.validate();
    }

    createScroll(){
        var wrapper = document.getElementById('price_update_wrap'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false
            });
        this.state.SCROLL = SCROLL;
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    }

    createSelect() {
        let options = [];
        this.context.units.map((unit, index)=>{
            options.push(<option key={index}  value={unit.id}>{unit.name}</option>);
        });
        this.setState({
            selectListDOM: <div className="cell-row">
                                <div className="cell-head">
                                    单位：
                                </div>
                                <div className="cell-body">
                                </div>
                                <div className="cell-foot">
                                    <div className="select-wrap">
                                        <Validation.components.Select  className="select" validations={[]} name='goods_unit_id' value={this.props.basic_attr.goods_unit_id}>
                                            {options}
                                        </Validation.components.Select>
                                    </div>
                                </div>
                            </div>
        });
    }

    //创建优惠方案
    createRules(){
        this.context.rules.map((rule, index) => {
            let name = rule.show_name,
                unit = rule.buy_unit,
                discount = rule.preferential_unit,
                id = rule.price_rule_id,
                discountType = [],
                len = this.props.price_rules.length,
                addDiscount = '添加买' + name;
            name == '减' ? this.state.nameIndex = index : null;
            if(name != '减') return;
            if(this.props.price_rules){
                for(let i = 0; i < len; i++){
                    let discountWays = this.props.price_rules[i];
                    if(discountWays.price_rule_id == id){
                        if(!discountWays.rules){
                            return;
                        }
                        discountWays.rules.map((discountWay, index2)=>{
                            discountType.push(
                                <div key={discountWay.id} className="discount-way">
                                    <span>买<Validation.components.Input onChange={this.onChange} containerClassName="short-inline-input" type="number"
                                                                              value={discountWay.buy_num} placeholder="输入数量" validations={['price']} name={'[price_rules][0][rules][' + index2 + '][buy_num]'}/>{unit}，</span>
                                    <span>合计{name}<Validation.components.Input onChange={this.onChange} containerClassName="short-inline-input" type="number"
                                                                             value={discountWay.preferential} placeholder="输入优惠" validations={['price']} name={'[price_rules][0][rules][' + index2 + '][preferential]'}/>{discount}</span>
                                    <span data-operate="del" data-para={i + '.' + index2} onClick={this.eventHandler.bind(this, false)}>{null}</span>
                                </div>
                            );
                        });
                    }
                }
            }
            this.state.rulesDOM[index] = (
                <div className={this.state.filled ? 'activity' : 'activity' + ' disable'}>
                    <label htmlFor={'no' + id} className="checkbox">
                        <div className="cell-row" onTouchStart={this.state.filled ? this.eventHandler.bind(this, false) : null} data-operate="setPrice" data-para={index}>
                            <div className="cell-head">
                                <input value={id} type="radio" className="check" checked={this.state.discountType == id} name="price_rules[0][price_rule_id]" id={'no' + id}/>
                                <i className="icon-selected"></i>
                            </div>
                            <div className="cell-body">
                                <span>&nbsp;买{name}</span>&emsp;<span>如买家买20{unit}合计{name}10{discount}</span>
                            </div>
                            <div className="cell-foot">
                                {<span data-operate="setPrice" data-para={index} onTouchStart={this.eventHandler.bind(this, true)}>{this.state.discountType == id ? addDiscount : null}</span>}
                            </div>
                        </div>
                    </label>
                    {this.state.discountType == id ? discountType : null}
                </div>
            );
        });
        return this.state.rulesDOM;
    }

    //验证
    validate(){
        let context = this.context,
            state = this.state,
            nameIndex = this.state.nameIndex;
        $.isEmptyObject(this.form.validateAll()) ? state.filled = true : null;
        if(!state.discountType && state.filled){
            state.discountType = context.rules[nameIndex].price_rule_id;
            document.querySelector('#no' + state.discountType).checked = true;
            if(!this.context.goods_id && !this.props.basic_attr.price_rules){
                this.setPrice(nameIndex);
            }
        }
        this.forceUpdate();
    }

    //设置价格
    setPrice(para){
        let rule = this.context.rules[para],
            id = rule.price_rule_id,
            index = '',
            isExist = false;
        this.state.date = new Date();
        let obj = {
            'price_rule_id': Number(id),
            rules:[
                {
                    buy_num: null,
                    preferential: null,
                    id: Math.random()
                }
            ]
        };
        this.props.price_rules.map((rule, index2)=>{
            if(rule.price_rule_id == id && rule.rules.length != 0) {
                isExist = true;
                index = index2;
            }
        });
        if(this.state.discountType != id && isExist){  //切换时的操作
            this.state.discountType = id;
            this.forceUpdate();
            return;
        }
        this.state.discountType = id;
        if(isExist){
            if(!this.state.ifAdd) return;
            let len = this.props.price_rules[index].rules.length;
            if( len < 3){
                this.props.price_rules[index].rules.push({
                    'buy_num': null,
                    'preferential': null,
                    id: Math.random()
                });
            }else {
                H.operationState('暂时只能添加三条');
            }
        }else {
            this.props.price_rules.push(obj);
        }
        this.forceUpdate();
    }

    del(para){
        para = para.split('.');
        this.props.price_rules[para[0]].rules.splice(para[1], 1);
        this.forceUpdate();
    }

    handleSubmit(event){
        event && event.preventDefault();
        if(new Date() - this.state.date < 140){
            return ;
        }
        if($.isEmptyObject(this.form.validateAll())){
            let form = H.handleSubmit('form');
            if(form.price_rules[0].rules){
                form.price_rules[0].rules.map((rule, index)=>{
                    if(rule.buy_num == '' || rule.preferential == ''){
                        delete form.price_rules[0].rules[index];
                    }
                });
                if($.isEmptyObject(form.price_rules[0].rules)){
                    form.price_rules = [];
                }
            }else{
                form.price_rules = [];
            }
            this.props.basic_attr.price_rules = [];
            Object.assign(this.props.basic_attr, form);
            this.props.setData(this.props.basic_attr, this.props.num);
            $(this.refs.wrap).hide();
        }else{
            H.operationState('请填写完整后提交');
        }
    }

    close(){
        $(this.refs.wrap).hide();
    }

    onChange(){
        let price_rules = H.handleSubmit('form').price_rules[0],
            id = price_rules.price_rule_id,
            index,
            isExist = false;
        this.props.price_rules.map((rule, index2)=>{
            if(rule.price_rule_id == id) {
                isExist = true;
                index = index2;
            }
        });
        if(isExist){
            this.props.price_rules[index] = price_rules;
        }else {
            this.props.price_rules.push(price_rules);
        }
    }


    //事件分发器
    eventHandler(ifAdd, e){
        let target = e.target,
            parent = e.currentTarget,
            dataset = target.dataset,
            operate = dataset.operate,
            para =  dataset.para;
        e.stopPropagation();
        //this.props.basic_attr.goods_price = target.value;
        //this.props.parent.forceUpdate();
        if(ifAdd){
            this.state.ifAdd = true;
        }
        if(parent){
            let parentDataset = parent.dataset;
            operate = dataset.operate || parentDataset.operate;
            para =  dataset.para || parentDataset.para;
        }
        this[operate](para);
        this.state.ifAdd = false;
    }

    render() {
        return (
            <div ref="wrap">
            <div id="price_update_wrap" className="price-update-wrap">
                <div className="scroller">
                <Validation.components.Form ref={c => { this.form = c; }} id="form" onSubmit={this.handleSubmit}>
                    <h4 className="price-title">设置价格<span data-operate="close" onClick={this.eventHandler.bind(this, false)}>{null}</span></h4>
                    <div className="single-price">
                        <p>&emsp;设置单件价</p>
                        <fieldset >
                            {this.state.selectListDOM}
                            <div className="cell-row">
                                <div className="cell-head">
                                    单价：
                                </div>
                                <div className="cell-body">
                                    <Validation.components.Input containerClassName="text-input" value={this.props.basic_attr.goods_price} data-operate="validate" placeholder="请输入价格"
                                                                 type="number" validations={['required', 'price']} name="goods_price" onBlur={this.eventHandler.bind(this, false)}/>
                                </div>
                                <div className="cell-foot">元</div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="multi-price">
                        <p>&emsp;设置多件价</p>
                        <fieldset>
                            {this.createRules()}
                        </fieldset>
                    </div>
                    <button className="btn btn-confirm btn-blue" onTouchStart={this.handleSubmit.bind(this)}> 保存</button>
                </Validation.components.Form>
                </div>
            </div>
                <div className="price-mask">
                </div>
            </div>
        );
    }

}

export default PriceUpdate;