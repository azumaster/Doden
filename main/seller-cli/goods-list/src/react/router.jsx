/*
* 路由管理*/
import Enter from './page/enter/enter.jsx';
import MyGoods from './page/my-goods/my-goods.jsx';
import SalesPromotion from './page/sales-promotion/sales-promotion.jsx';
import SystemInforms from './page/system-informs/system-informs.jsx';
import SpecArticle from './page/my-goods/spec-article.jsx';
import Nav from './components/nav/nav.jsx';

class Router extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageStatus: '',
            soldoutNum: 0,   //过期商品数量;
            specArticleStatus: false    //是否显示商品规范书;
        };
        this.createPage = this.createPage.bind(this);
    }

    componentWillMount() {
        document.addEventListener('touchmove', function (e){e.preventDefault();}, false);
        this.setState({pageStatus: location.hash});
        window.onhashchange = () => {
            this.setState({pageStatus: location.hash});
        };

        let server = H.server;
        //获取过期商品的数量; 如果大于0表示有过期商品需要提示改价;
        H.we_loading.show();
        server.getSoldoutNum({}, (res) => {
            H.we_loading.hide();
            if(res.code ==0) {
                this.setState({soldoutNum: res.data.num});
            }else {
                H.operationState(res.message);
            }
        });
    }

    createPage() {
        let page = this.state.pageStatus,
            XML = [];
        if(page.indexOf('my-goods') != -1) {
            XML.push(<MyGoods hash={this.state.pageStatus} />);
        }else if(page.indexOf('sales-promotion') != -1) {
            XML.push(<SalesPromotion />);
        }else if(page.indexOf('system-informs') != -1) {
            XML.push(<SystemInforms />);
        }else {
            XML.push(<Enter />);
        }

        if(page.indexOf('spec-article') != -1) {
            XML.push(<SpecArticle />);
        }

        return XML;
    }

    navHandler(index) {
        switch (index) {
            case 0:
                window.location.href = '/index.php?m=Home';
                break;
            case 1:
                window.location.href = '#';
                //window.location.href = 'index.php?m=PublicTemplate&c=ApiPublic&a=sellerGoodsListPage';
                break;
            case 2:
                window.location.href = 'index.php?m=PublicTemplate&c=ApiPublic&a=seller#/order/dqr';
                break;
        }
    }

    //确认价格有效;
    confirmPrice () {
        H.we_loading.show('正在更新价格');
        H.server.updateExpirationTime({}, (res) => {
            if(res.code == 0) {
                this.setState({soldoutNum: 0});
                H.operationState('价格更新完成');
            }else {
                H.operationState(res.message);
            }
            H.we_loading.hide();
        });
    }

    render() {
        return(<div>
            {this.createPage()}
            {
                this.state.soldoutNum > 0 ?  <div className="update-price flex-box">
                    <div className="flex-num1"><p>请确认在售商品的价格无误</p><p>请下架无货商品</p></div>
                    <a className="confirm-price" onClick={this.confirmPrice.bind(this)}>确认价格有效</a>
                </div> : null
            }

            <Nav clickCallBack={this.navHandler.bind(this)} />
        </div>);
    }
}

export default Router;