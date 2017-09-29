/*
 * props 传入的是comments(shopIcon， shopName ，starNum，comments)
 *
 * */
import Star from './Star.jsx';
class Comments extends React.Component{
    constructor(){
        super();
    }
    render(){
        return(
            <div className="cell ">
                <div className="cell-head"> <img src={this.props.comments.shopIcon} style={{height:'70px', width:'70px'}} alt="icon"/> </div>
                <div >
                    <div className="cell-primary">{this.props.comments.shopName}< Star starNum={this.props.comments.starNum} /></div>
                    <div className="cell-ft">{this.props.comments.comments}</div>
                </div>
            </div>
        );
    }
}
export default Comments;