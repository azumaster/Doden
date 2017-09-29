/*
 * props 传入的是商铺的starNum
 *
 * */

class Star extends React.Component{
    constructor(){
        super();
    }
    createStar(){
        let stars=[];
        let i=0;
        for(i;i<this.props.starNum;i++){
            stars.push(<i className="star"></i>);
        }
        return stars;
    }
    render(){
        return(
            <div className="star-filed">
                {this.createStar()}
            </div>
        );
    }
}

export default Star;


