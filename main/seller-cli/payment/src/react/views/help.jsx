/**
 * 货款中心：帮助
 */

class Help extends React.Component {
    constructor(props){
        super(props);
    }

    /**
     * 准备工作
     */
    componentDidMount(){
        this.createScroll();
    }

    createScroll(){
        var wrapper = document.getElementById('paymentHelp'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: true
            });

        SCROLL.on('beforeScrollStart', () => {
            SCROLL.refresh();
        });
    }

    /**
     * 创建View
     */

    createList(){
        return (<div className="help-list">
            <div className="help-item">
                <div className="help-question">一、哪些人可以绑定提现银行卡、可申请提现？</div>
                <div className="help-anwser">只有注册账户的老板，才能绑定（或修改）提现银行卡信息。其余店铺管理员只能查看部分银行卡信息。所有店铺成员均可申请提现。</div>
            </div>
            <div className="help-item">
                <div className="help-question">二、我绑定银行卡时，提示验证失败，怎么办？</div>
                <div className="help-anwser">请核实您提交的信息是否准确。然后，清空填写的所有信息，重新输入。需注意的是，收款人姓名和身份证号码必须是银行卡户主信息，手机号必须是银行预留号码。如多次验证失败，我们建议您更换银行卡。</div>
            </div>
            <div className="help-item">
                <div className="help-question">三、银行卡信息和身份证信息，提交到哪里的，信息安全是否有保障？</div>
                <div className="help-anwser">货款提现部分，我们已经全权委托给我们的合作银行【民生银行】，您提交的信息，是直接提交给民生银行的。</div>
            </div>
            <div className="help-item">
                <div className="help-question">四、申请提现后，多久能到账？</div>
                <div className="help-anwser">提现后，两个工作日内到账。如有疑问，请联系客服。</div>
            </div>
            <div className="help-item">
                <div className="help-question">五、我怎么对账？</div>
                <div className="help-anwser">点击“可提现”，可查看所有交易完成，未发起提现的订单。点击“提现中”，可查看已发起提现的全部订单。点击“已提现”，根据需要，查看全部、某年或某月的已提现订单。
                </div>
            </div>
        </div>);
    }

    render(){
        return (<div id="paymentHelp" className="help">
            <div className="scroller">
                {this.createList()}
            </div>
        </div>);
    }
}

export default Help;