import ShopPage from './page/goods_notice.jsx';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state=  {
            shop_id: null
        };
    }

    componentWillMount(){
        if(H.urlParam('shopId')){
            this.state.shop_id = H.urlParam('shopId');
        }
    }

    render() {
        return (
           <ShopPage  shop_id={this.state.shop_id} />
        );
    }
}
export default Main;