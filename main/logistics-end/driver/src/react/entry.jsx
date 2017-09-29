
import TabNav from './components/tab.jsx';
import Running from './pages/running/running.jsx';
import Delivery from './pages/running/delivery.jsx';
import Complete from './pages/complete/complete.jsx';

class Entry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStatus:0,
            currentPage:0
        };
        this.createPage = this.createPage.bind(this);
    }

    getPanel() {
        H.server.sign_delivery({}, (res)=>{
            if(res.code == 0){
                this.setState({
                    currentPage:2
                }, this.createPage);
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                alert(res.message);
            }
        });
    };

    send(){
        this.setState({
            currentPage:2
        }, this.createPage);
    }


    createPage() {
        let XML = [],
            page = this.state.currentPage;

        if(page == 0){
            XML.push(<Running changePanel={this.getPanel.bind(this)} send={this.send.bind(this)}/>);
        } else if(page == 1){
            XML.push(<Complete />);
        } else if(page == 2){
            XML.push(<Delivery/>);
        }

        return XML;
    }

    toggleStatus(e) {
        let index = e.target.dataset.index;

        if(index == this.state.currentStatus) {
            return;
        }

        this.setState({
            currentStatus: index,
            currentPage: index
        }, this.createPage);
    }

    render() {
        let tabNames = ['执行中', '已完成'],
            tabStatus = [0, 1];

        $('body').on('touchmove', function (event) {
            event.preventDefault();
        });

        return(
            <div className="container">
                {this.createPage()}
                <TabNav tabNames={tabNames} tabStatus={tabStatus} status={this.state.currentStatus} style='btn-item'
                        activeStyle='btn-item active' touchCallback={this.toggleStatus.bind(this)}/>
            </div>
        );
    }
}

export default Entry;