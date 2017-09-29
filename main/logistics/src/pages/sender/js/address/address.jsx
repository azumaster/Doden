/*
* 地址管理;
* */
import Map from '../map.jsx';
class Address extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultParam: {       //获取地址列表的参数;
                page: 1,
                size: 10
            },
            list: [],             //地址列表数据;
            total: 0,             //总条数;
            currentAddress: null  //当前修改的地址信息;
        };
        this.getAddressData = this.getAddressData.bind(this);
        this.createAddressList = this.createAddressList.bind(this);
        this.del = this.del.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentWillMount() {
        this.getAddressData();
    }

    componentDidMount() {
        this.createScroll();
    }

    componentDidUpdate() {
        this.state.SCROLL && this.state.SCROLL.refresh();
    }

    createScroll(){
        var wrapper = document.getElementById('addressWrap'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false
            });
        SCROLL.on('scroll', () => {
            if(this.state.list.length >= this.state.total) return;
            if((SCROLL.y - SCROLL.maxScrollY ) < 300) {
                this.state.defaultParam.page++;
                this.getAddressData();
            }
        });
        SCROLL.on('scrollEnd', () => {
            if(this.state.list.length >= this.state.total) return;
            if((SCROLL.y - SCROLL.maxScrollY ) < 300) {
                this.state.defaultParam.page++;
                this.getAddressData();
            }
        });
        this.state.SCROLL = SCROLL;
    }

    getAddressData() {
        let param = this.state.defaultParam;
        H.we_loading.show();
        H.server.shop_address(param, (res) => {
            H.we_loading.hide();
            if(res.code == 0) {
                this.state.list = this.state.list.concat(res.data.customs);
                this.state.total = res.data.total;
                this.forceUpdate();
            }else {
                H.operationState(res.message);
            }
        });
    }

    createAddressList() {
        let list = this.state.list,
            xml = [];

        xml.push(
            list.map((val, index) => {
                return (
                    <li className={val.available == 0 ? 'car-wrap invalid' : 'car-wrap' }>
                        <div className="car-hd"><div className="title">{val.mobile}（{val.name}）</div>
                            <i className="del-address-icon" data-operate="del" data-index={index}>
                            </i></div>
                        <div className="car-bd">
                            <div className="green"><label>地 址</label>{val.address}</div>
                            <div className="red"><label>提货码</label>{H.getExtractCode(val.code)}</div>
                            <div className="car-note">
                                {
                                    val.available == 0 ? (<span class="red">当前地址不可送</span>) : null
                                }
                                <a data-index={index} data-operate="edit" className="edit-address"></a>
                            </div>
                        </div>
                    </li>
                );
            })
        );

        return (<ul className="address-list" onClick={this.clickHandler.bind(this)}>{xml}</ul>);
    }

    //删除地址;
    del(index) {
        let data = this.state.list[index];
        H.dialog({
            title: '是否要删除？',
            content: '<div class="car-wrap"><div class="car-hd"><div class="title">'+data.mobile+'（'+data.name+'）</div></div>'+
            '<div class="car-bd"><div class="green"><label>地 址</label>'+data.address+'</div><div class="red"><label>提货码</label>' +
            H.getExtractCode(data.code)+
            '</div></div></div>',
            cancelText: '取消',
            cancel: true,
            okText: '提交',
            okCallback: () => {
                H.we_loading.show();
                H.server.shop_address_delete(JSON.stringify({uid: data.uid}), (res) => {
                    H.we_loading.hide();
                    if(res.code == 0) {
                        let list = this.state.list;
                        list.splice(index, 1);
                        this.setState({list: list}, () => {
                            this.state.SCROLL && this.state.SCROLL.refresh();
                        });
                        H.operationState('删除成功');
                    }else {
                        H.operationState(res.message);
                    }
                });
            }
        });
    }

    //修改地址;
    edit(index) {
        this.state.currentAddress = null;
        let data = this.state.list[index];
        this.state.currentAddress = {
            uid: data.uid,
            name: data.name,
            mobile: data.mobile,
            address: data.address
        };
        let editDialog = H.dialog({
            title: '修改地址？',
            content: '<div class="edit-address-player"><div class="hd">' +
            '<div class="flex-box center red"><div class="label">店铺名称</div><div class="flex-num1"><input id="shopName" value="'+data.name+'" type="text" placeholder="请输入收货人" /></div><div id="editShopName" class="edit-address-icon"></div></div>' +
            '<div class="flex-box center red"><div class="label">收货电话</div><div class="flex-num1"><input id="phone" value="'+data.mobile+'" type="tel" placeholder="请输入收货电话" /></div><div id="editPhone" class="edit-address-icon"></div></div>' +
            '<div class="flex-box center green"><div class="label">收货地址</div><div class="flex-num1"><div id="chooseAddress" class="choose-address-val">'+data.address+'</div></div><div id="editAddress" class="choose-address-icon"></div></div>' +
            '</div></div>',
            cancelText: '关闭',
            cancel: true,
            autoClose: false,
            okText: '提交',
            okCallback: () => {
                let data = this.state.currentAddress;
                data.name = $('#shopName').val();
                data.mobile = $('#phone').val();
                if(!data.name) {
                    H.operationState('请输入店铺名');
                    return;
                }
                if(!data.mobile) {
                    H.operationState('请输入收货电话');
                    return;
                }
                H.we_loading.show();
                H.server.shop_address_update(JSON.stringify(data), (res) => {
                    H.we_loading.hide();
                    if(res.code == 0) {
                        let list = this.state.list;
                        list[index] = res.data;
                        this.setState({list: list}, () => {
                            this.props.SCROLL && this.props.SCROLL.refresh();
                        });
                        editDialog.destroy();
                        H.operationState('修改成功');
                    }else {
                        H.operationState(res.message);
                    }
                }, data.id);
            },
            cancelCallback: () => {
                editDialog.destroy();
            }
        });
        $('#editShopName').click(() => {
            $('#shopName')[0].focus();
        });
        $('#editPhone').click(() => {
            $('#phone')[0].focus();
        });
        $('#chooseAddress').click(() => {
            this.state.currentAddress.name = $('#shopName').val();
            this.state.currentAddress.mobile = $('#phone').val();
            location.href = '#address/map';
        });
    }

    //添加地址;
    add() {
        this.state.currentAddress = {
            name: '',
            mobile: ''
        };
        let addDialog = H.dialog({
            title: '添加收货人',
            content: '<div class="edit-address-player"><div class="hd">' +
            '<div class="flex-box center red"><div class="label">收货人</div><div class="flex-num1"><input id="shopName" placeholder="请输入收货人姓名" type="text" /></div><div id="editShopName" class="edit-address-icon"></div></div>' +
            '<div class="flex-box center red"><div class="label">收货电话</div><div class="flex-num1"><input id="phone" placeholder="请输入收货电话" type="tel" /></div><div id="editPhone" class="edit-address-icon"></div></div>' +
            '<div class="flex-box center green"><div class="label">收货地址</div><div class="flex-num1"><div id="chooseAddress" class="choose-address-val not">请点击选择</div></div><div id="editAddress" class="choose-address-icon"></div></div>' +
            '</div></div>',
            cancelText: '关闭',
            cancel: true,
            autoClose: false,
            okText: '提交',
            okCallback: () => {
                let data = this.state.currentAddress;
                data.name = $('#shopName').val();
                data.mobile = $('#phone').val();
                if(!data.name) {
                    H.operationState('请输入店铺名');
                    return;
                }
                if(!data.mobile) {
                    H.operationState('请输入收货电话');
                    return;
                }
                if(!data.address) {
                    H.operationState('请选择地址');
                    return;
                }
                H.we_loading.show();
                H.server.shop_address_add(JSON.stringify(data), (res) => {
                    H.we_loading.hide();
                    if(res.code == 0) {
                        addDialog.destroy();
                        let list = this.state.list;
                        list.unshift(res.data);
                        this.state.SCROLL.scrollTo(0, 0);
                        this.setState({list: list}, () => {
                            this.props.SCROLL && this.props.SCROLL.refresh();
                        });
                        H.operationState('添加成功');
                    }else {
                        H.operationState(res.message);
                    }
                }, data.id);
            },
            cancelCallback: () => {
                addDialog.destroy();
            }
        });
        $('#editShopName').click(() => {
            $('#shopName')[0].focus();
        });
        $('#editPhone').click(() => {
            $('#phone')[0].focus();
        });
        $('#chooseAddress').click(() => {
            let obj = {
                name: $('#shopName').val(),
                mobile: $('#phone').val()
            };
            this.state.currentAddress = $.extend(this.state.currentAddress, obj);
            location.href = '#address/map';
        });
    }

    clickHandler(e) {
        let index = e.target.dataset.index,
            operate = e.target.dataset.operate;
        if(!index) return;
        this[operate](index);
    }

    //设置当前修改或者添加时提交的参数;
    setCurrentAddress(obj) {
        if(obj) {
            let data = this.state.currentAddress;
            data.address = obj;
            $('#chooseAddress').html(data.address.address);
            $('#chooseAddress').removeClass('not');
        }
        history.back();
    }

    render() {
        return (
            <div>
                <div className="address-page-add" onClick={this.add.bind(this)}>添加新收货人</div>
                <div id="addressWrap" className="address-wrap">
                    <div className="scroller">
                        {this.createAddressList()}
                    </div>
                </div>
                {
                    this.props.hash.indexOf('/map') != -1 ? <Map currentAddress={this.state.currentAddress} setCurrentAddress={this.setCurrentAddress.bind(this)} /> : null
                }
            </div>
        );
    }
}
export default Address;