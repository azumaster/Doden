/**
 * Created by Doden on 2017.07.07
 */

class Swipe extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            // 当前状态
            currentType: 0

            // 获取数据
        };
    }

    componentDidMount(){
        this.createScroll();
    }

    createScroll(){
        let options = {
            zoom: true,
            scrollX: true,
            scrollY: false,
            mouseWhell: true,
            wheelAction: 'zoom',
            probeType: 2,
            preventDefault: false
        };


        var SCROLL = new IScroll(document.getElementById('swipe'+this.props.index), options);
        SCROLL.on('beforeScrollStart', () => {
            SCROLL.refresh();
        });

    }

    /**
     * 创建图片
     */
    createImgs(){
        let list = [],
            imgs = this.props.imgs;

        imgs.map((img, i)=>{
            list.push(<div key={i} className="img-item"><img src={H.getCdn()+img.img_url+'@150w_90Q.jpg'}/></div>);
        });

        return (<div className="swipe-imgs">
            {list}
        </div>);
    }

    render() {
        return (<div id={'swipe'+this.props.index} className="swipe">
            <div className="scroller">
                {this.createImgs()}
            </div>
        </div>);
    }
}

export default Swipe;