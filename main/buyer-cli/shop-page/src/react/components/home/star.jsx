/**
 * Created by Doden on 2017.07.07
 */

class Star extends React.Component {
    constructor(props) {
        super(props);
    }

// 判断店铺等级
    shopStar(e) {
        let stars = [],
            starClass = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
            point = String(e),
            prePoint = Math.floor(point),
            posPoint = point.split('.')[1] || 0,
            style = {backgroundImage: 'url("'+H.localhost+'Public/images/stars.png")'};
        for(let i=0; i<prePoint; i++){
            stars.push(<i className="star ten" style={style}></i>);
        }

        if(5-prePoint>0){
            stars.push(<i className={'star '+starClass[posPoint]} style={style}></i>);
            if(5-prePoint-1>0){
                for(let j=0; j<5-prePoint-1; j++){
                    stars.push(<i className="star zero" style={style}></i>);
                }
            }
        }

        return (<div className="stars">
            {stars}
        </div>);
    }

    // 计算得分
    point(point){
        return point?point:0+'分';
    }

    render() {
        return (<div className="shop-star">
            <p className="provider-star">{this.shopStar(this.props.point)}</p>
            <p className="provider-point">{this.point(this.props.point)}</p>
        </div>);
    }
}

export default Star;