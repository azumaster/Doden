/*
* 商品介绍
* create: xy, time: 2017-03-09
* */

class goodsIntroduce extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let data = this.props.data;
        return (
            <div className="goods-introduce">
                <p className="slogan border-bottom">{data.goods_description}</p>
                {
                    data.inspection_report?
                        <div>
                            <h2>检验报告</h2>
                            <img onLoad={this.props.scrollRefresh} src={$.cdn() + data.inspection_report + $.img(450, 80)} width="100%"/>
                        </div> : null
                }

                <h2>商品图片</h2>
                {
                    data.goods_picture.map((val, index) => {
                        return (<img onLoad={this.props.scrollRefresh} key={index} src={$.cdn() + val.goods_image + $.img(450, 80)}/>);
                    })
                }
            </div>
        );
    }
}

export default goodsIntroduce;