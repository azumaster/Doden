/**
 * Created by Doden on 2017.03.03
 */

import BtnGroup from '../../../../components/btn-group/btn_group.jsx';
import ServiceProvider from './serviceProvider.jsx';
import ServiceCategory from './serviceCatogery.jsx';
import ServiceLog from './serviceLog.jsx';

class ServiceManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage:0
        };
    }

    createMenu(){
        let btnNames = ['服务商管理', '服务商客户分类', '操作日志'],
            btnData = [0, 1, 2];

        return (<BtnGroup btnNames={btnNames} bindData={btnData} clickCallback={this.toggle.bind(this)}
                          style="btn btn-lg" activeStyle="btn btn-lg btn-default" status={this.state.currentPage}/>);
    }

    toggle(e){
        let page = e.target.dataset.index;

        if(page === this.state.currentPage){
            return;
        }

        this.setState({
           currentPage: page
        });
    }

    createPanel(){
        let panel = null,
            page = this.state.currentPage;

        if(page == 0){
            panel = <ServiceProvider />;
        } else if(page == 1){
            panel = <ServiceCategory />;
        } else if(page == 2){
            panel = <ServiceLog />;
        }

        return panel;
    }

    render() {
        return (
            <div className="section-warp">
                <div className="section-filter">
                    <form className="form-inline">
                        <div className="filter-row">
                            {this.createMenu()}
                        </div>
                    </form>
                </div>
                <hr/>
                <div className="section-table" >
                    {this.createPanel()}
                </div>
                {this.state.showPanel}
            </div>
        );
    }
}

export default ServiceManagement;