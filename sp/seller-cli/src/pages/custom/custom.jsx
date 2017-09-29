/**
 * Created by Doden on 2017.03.08
 */

import { connect } from 'react-redux';
import Action from '../../redux/actions/action.js';

class Custom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL: null,
            customList: [],
            currentPage: 1,
            lastPage: 1,
            page: 1,
            size: 10,
            total: 0
        };
    }

    componentWillMount(){
        this.getData();
    }

    getData(){
        $.loading.show();
        $.req.getCustomList({p:this.state.page, s: this.state.size}, (res)=>{
            if(res.code == 0){
                let customList = this.state.customList;
                if(this.state.page == 1) customList = [];
                customList = customList.concat(res.data.data);
                this.setState({
                    currentPage: res.data.current_page,
                    lastPage: res.data.last_page,
                    total: res.data.total,
                    customList: customList
                });
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
            $.loading.hide();
        });
    }

    componentDidMount(){
        this.createScroll();
    }

    componentDidUpdate(){
        this.state.SCROLL.refresh();
    }

    createScroll(){
        let SCROLL = new IScroll('#sellerCustom', {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false
            });
        this.setState({SCROLL: SCROLL}, ()=>{
            SCROLL.on('scrollStart', () => {SCROLL.options.preventDefault = true;});
            SCROLL.on('scrollEnd', () => {
                SCROLL.options.preventDefault = false;
                if(this.state.customList){
                    if(this.state.customList.length >= this.state.total) return;
                    if((SCROLL.y - SCROLL.maxScrollY)<300){
                        this.state.page ++;
                        new Promise(()=>{this.getData();});
                    }
                }
            });
        });
    }

    createCustomList(){
        let list = [];

        if(this.state.customList){
            this.state.customList.map((custom, index)=>{
                list.push(<div key={index} className="custom-item">
                    <div className="ul">
                        <div className="li">
                            <div className="grid-row">
                                <div className="grid-col-9">
                                    <h4 className="pull-left"><i className="icon head" />{custom.user_name}</h4>
                                    <h5 className="pull-left">（{custom.shop_name}）</h5>
                                    <p data-name={custom.user_name} onClick={this.editCustom.bind(this)} className="icon edit pull-left" style={{marginLeft: '5px'}}></p>
                                </div>
                                <div className="grid-col-3"><a href={'tel:'+custom.mobile_phone}><h5 className="text-green text-right">联系客户</h5></a></div>
                            </div>
                        </div>
                        <div className="li">
                            <h5>{custom.mobile_phone}</h5>
                        </div>
                    </div>
                </div>);
            });
        }
        return (<ul className="custom-list">
            {list}
        </ul>);
    }

    // 修改客户名
    editCustom(e) {
        let name = e.target.dataset.name;
        console.log('aaa');
        $.dialog({
            title: '修改名称',
            content: '<div class="edit-input"><input id="editInput" type="text" value="'+name+'"><span id="editClose" class="icon close"></span></div>',
            seller: true,
            cancel: true,
            okCallback: ()=>{
                // $.req.operateTicket(JSON.stringify({handle:handle, order_ids:[orderId]}), (res)=>{
                //     if(res.code == 0){
                //         this.getTicketList();
                //     }else{
                //         $.toast({text:res.message, icon: 'info'});
                //     }
                // });
            }
        });

        let input = document.getElementById('editInput'),
            close = document.getElementById('editClose');
        input.focus();
        input.select();

        close.addEventListener('click', function () {
            input.value = '';
            input.focus();
        }, false);
    }

    render() {
        return (<div id="sellerCustom" className="seller-custom">
            {this.createCustomList()}
        </div>);
    }
}

const mapStateToProps = (state)=>{
    return {
        customList: state.custom
    };
};

const mapDispatchToProps = (dispatch) =>{
    return {
        getCustomList: (data)=>{Action(dispatch, 'fetchCustomList', data);}
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Custom);