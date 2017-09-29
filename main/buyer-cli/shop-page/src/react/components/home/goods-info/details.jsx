/*
* 商品详情
* */

class Details extends React.Component {
    constructor(props) {
        super(props);
        this.createImg = this.createImg.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.scrollRefresh && this.props.scrollRefresh();
        }, 200);
    }

    imgOnLoad() {
        this.props.scrollRefresh && this.props.scrollRefresh();
    }

    createImg() {
        let data = this.props.data,
            xml = [];
        for(let i in data.goods_image) {
            xml.push(<img key={i} src={H.localhost + data.goods_image[i]+ H.imgSize()[640] + this.props.watermark} width="100%" onLoad={this.imgOnLoad.bind(this)} />);
        }

        //如果该商品有检验报告图片，就把检验报告图片加在图片列表后面;
        if(data.inspection_report) {
            xml.push(<img key={data.goods_image.length} src={H.localhost + data.inspection_report + H.imgSize()[640] + this.props.watermark} width="100%" onLoad={this.imgOnLoad.bind(this)} />);
        }

        return xml;
    }

    render() {
        let data = this.props.data;
        return (
            <div className="details">
                <div>品名：{data.goods_name}</div>
                <div>清真：{this.props.goods.halal == 1 ? '是' : '否'}</div>
                <div>品牌：{data.goods_brand}</div>
                <div>产地：{data.goods_origin}</div>
                <div>型号：{data.goods_xinghao}</div>
                <div>净重：{this.props.goods.goods_net_weight}Kg</div>
                <div>规格：{data.goods_guigei}</div>
                {
                    data.special_detail.map((data, index) => {
                        return (
                            <div key={index}>{data.prope_name}：{data.prope_value}</div>
                        );
                    })
                }
                <div>描述：{data.goods_description}</div>
                <div>
                    {this.createImg()}
                </div>
            </div>
        );
    }
}

export default Details;