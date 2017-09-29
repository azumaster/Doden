import BtnGroup from '../../../../components/btn-group/btn_group.jsx';
import RecommendGoods from './recommend_goods.jsx';
import HighQualityShop from './high_quality_shop.jsx';
import NewGoods from './new_goods.jsx';
import Banner from './banner.jsx';
import BrandHouse from './brand-house.jsx';
import PopUpAd from './popUpAd.jsx';

class HomeManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            component: null,
            addNewPanel:null,
            index: 0,
            areaData: []
        };
        this.clickCallback = this.clickCallback.bind(this);
    }

    componentWillMount(){
        this.init();

    }

    init(){
        H.server.other_customArea_list({}, (res) => {
            if(res.code == 0) {
                this.state.areaData = res.data;
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    getChildContext() {
        return {areaData: this.state.areaData};
    }

    //创建功能区域
    createFunctionArea(){
        let btnNames = ['banner', '品牌馆', '优质供应商', '推荐好货', '弹窗广告'],
            operate = ['Banner', 'BrandHouse', 'HighQualityShop', 'RecommendGoods', 'PopUpAd'];
        return (<BtnGroup btnNames={btnNames} operate={operate} clickCallback={this.clickCallback}
                          style="btn btn-lg" activeStyle="btn btn-lg btn-default" status={this.state.index} />);
    }

    //适配器
    clickCallback(e){
        let target = e.target,
            dataset = target.dataset,
            index = dataset.index,
            operate = dataset.operate;
        this.state.index = index;
        switch (operate){
            case 'Banner' :
                // return;
                this.state.component = <Banner key={operate} togglePanel={this.togglePanel.bind(this)}/>;
                break;
            case 'BrandHouse':
                this.state.component = <BrandHouse key={operate} togglePanel={this.togglePanel.bind(this)}/>;
                break;
            case 'HighQualityShop' :
                this.state.component = <HighQualityShop key={operate} togglePanel={this.togglePanel.bind(this)}/>;
                break;
            case 'RecommendGoods' :
                this.state.component = <RecommendGoods key={operate}/>;
                break;
            case 'NewGoods' :
                this.state.component = <NewGoods key={operate}/>;
                break;
            case 'PopUpAd':
                this.state.component = <PopUpAd key={operate} togglePanel={this.togglePanel.bind(this)}/>;
                break;
        }
        this.forceUpdate();
    }

    togglePanel(panel){
        this.setState({
            addNewPanel: panel
        });
    }


    render() {
        return (
            <div className="section-warp">
                <div className="section-filter">
                    <form className="form-inline">
                        <div className="filter-row">
                            {this.createFunctionArea()}
                        </div>
                    </form>
                </div>
                <hr/>
                <div className="section-table" >
                    {this.state.component}
                </div>
                {this.state.addNewPanel}
            </div>
        );
    }
}

HomeManagement.childContextTypes = {
    areaData: React.PropTypes.array
};
export default HomeManagement;