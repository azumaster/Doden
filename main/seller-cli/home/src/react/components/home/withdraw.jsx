
class withDraw extends React.Component {
    constructor(props) {
        super(props);
    }

    // 去提现界面
    toWithdraw(){
        window.location.href = '/?m=PublicTemplate&c=ApiPublic&a=withdrawalsInfoPage';
    }

    render() {

        let financialArr = this.props.shopInfo.financialArr;

        if(!this.props.shopInfo || this.props.shopInfo=={}){
            return null;
        }else {
            let money = {},
                confirmed = 0,
                withdraw = ['0', '00'];
            if(financialArr){
                confirmed = H.formatMoney(financialArr.confirmed/100, 2, '');
                withdraw[0] = confirmed.split('.')[0]?confirmed.split('.')[0]:'0';
                withdraw[1] = confirmed.split('.')[1]?confirmed.split('.')[1]:'00';
            }

            for(let key in financialArr){
                money[key] = financialArr[key];
            }

            return (<div id="withdraw" className="withdraw">
                <div className="withdraw-item">
                    <p className="tip">可提现（元）</p>
                    <p className="num"><em>{withdraw[0]+'.'}</em><em>{withdraw[1]}</em></p>
                </div>

                <div className="withdraw-get" onClick={this.toWithdraw.bind(this)}>
                    <i className="icon getMoney"></i><p className="label">提现</p>
                </div>
            </div>);
        }
    }
}

export default withDraw;