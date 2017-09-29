/*
* 评分
* props参数说明:
* score: 分数
* */

class Star extends React.Component {
    constructor(props) {
        super(props);
        this.CreateStar = this.CreateStar.bind(this);
    }

    CreateStar() {
        let stars = [],
            score = this.props.score,
            starClass = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
            point = String(score),
            prePoint = Math.floor(point),
            posPoint = point.split('.')[1] || 0,
            style = {backgroundImage: 'url("'+H.localhost+'/Public/images/stars.png")'};

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

        return stars;
    }

    render() {
        /*
        * score: 当前分数；如果没有或者小于0则表示需要操作。
        * starEv: 打分之后的回调;
        * */

        return (
            <div className="star-wrap">
                {this.CreateStar()}
            </div>
        );
    }
}

export default Star;