/*
* 供应商
* */

//星级评分;
import Star from '../star/star.jsx';
import Level from '../level/level.jsx';

class Supplier extends React.Component {
    constructor(props) {
        super(props);
        this.createXml = this.createXml.bind(this);
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
                    <div>供应商：<a style={{color: '#337ab7'}} href={'index.php?m=PublicTemplate&c=ApiPublic&a=shopShow&shopId='+data.seller_id}>{data.seller_name}</a></div>
                    <div className="flex-box center">店铺等级：<Level level={data.seller_rank} />{data.seller_rank}级</div>
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