/*
* 供应商
* */

//星级评分;
import Star from '../star/star.jsx';

class Supplier extends React.Component {
    constructor(props) {
        super(props);
        this.createXml = this.createXml.bind(this);
        this.shopLevel = this.shopLevel.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.props.scrollRefresh && this.props.scrollRefresh();
    }

    createXml() {
        if(!this.state.data) return '';

        return xml;
    }

    //店铺等级;
    shopLevel(level) {
        let xml = '';
        switch (level) {
            case 1:
                xml = (<span className="shop-level"><i className="low"></i></span>);
                break;
            case 2:
                xml = (<span className="shop-level"><i className="low"></i><i className="low"></i></span>);
                break;
            case 3:
                xml = (<span className="shop-level"><i className="low"></i><i className="low"></i><i className="low"></i></span>);
                break;
            case 4:
                xml = (<span className="shop-level"><i className="low"></i><i className="low"></i><i className="low"></i><i className="low"></i></span>);
                break;
            case 5:
                xml = (<span className="shop-level"><i className="middle"></i></span>);
                break;
            case 6:
                xml = (<span className="shop-level"><i className="middle"></i><i className="middle"></i></span>);
                break;
            case 7:
                xml = (<span className="shop-level"><i className="middle"></i><i className="middle"></i><i className="middle"></i></span>);
                break;
            case 8:
                xml = (<span className="shop-level"><i className="middle"></i><i className="middle"></i><i className="middle"></i><i className="middle"></i></span>);
                break;
            case 9:
                xml = (<span className="shop-level"><i className="high"></i></span>);
                break;
            case 10:
                xml = (<span className="shop-level"><i className="high"></i><i className="high"></i></span>);
                break;
            case 11:
                xml = (<span className="shop-level"><i className="high"></i><i className="high"></i><i className="high"></i></span>);
                break;
            case 12:
                xml = (<span className="shop-level"><i className="high"></i><i className="high"></i><i className="high"></i><i className="high"></i></span>);
                break;
        }
        return xml;
    }

    render() {
        let data = this.props.data,
            xml = '',
            addr = '';
        if(data) {
            addr = data.point_of_departure;
            if(data.point_of_departure.indexOf('海霸王') != -1) {
                addr = '成都市海霸王冻库';
            }else if(data.point_of_departure.indexOf('青白江') != -1) {
                addr = '成都市青白江银犁冻库';
            }
            xml = (
                <div className="supplier">
                    <div>供应商：{data.seller_name}</div>
                    <div className="flex-box center">店铺等级：{this.shopLevel(data.seller_rank)}{data.seller_rank}级</div>
                    <div>发货点：{addr}</div>
                    <div>
                        <div className="flex-box center">服务评价：
                            <Star score={data.service_grade} />

                            {data.service_grade ? data.service_grade : 0}分
                        </div>
                        <div className="flex-box center">发货速度：
                            <Star score={data.delivery_speed} />

                            {data.delivery_speed ? data.delivery_speed : 0}分
                        </div>
                        <div className="flex-box center">商品总评：
                            <Star score={data.goods_grade} />

                            {data.goods_grade ? data.goods_grade : 0}分
                        </div>
                    </div>
                    {true ? '' : <div>违规次数：{data.infraction_num}次</div>}
                </div>
            );
        }


        return (
            <div>
                {xml}
            </div>
        );
    }
}

export default Supplier;