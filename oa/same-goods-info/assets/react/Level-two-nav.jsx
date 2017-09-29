/**
 * Created by john on 2016/1/27.
 */

class NavController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            param: H.getUrlParam('goodsId')
        };
    }

    render(){
        return (
            <GoodsInfoCtrl />
        );
    }
}

export default NavController;