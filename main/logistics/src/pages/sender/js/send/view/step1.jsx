/*
* 第一步骤;
* */

class Step1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentAddress: this.props.currentAddress
        };
    }

    createAddressList() {
        let list = this.props.list,
            arr = this.props.chooseIdArr,
            xml = [];

        xml.push(
            list.map((val, index) => {
                return (
                    <li className={val.available == 0 ? 'car-wrap invalid' : arr.indexOf(index) == -1 ? 'car-wrap' : 'car-wrap active'}
                        onClick={this.chooseAddress.bind(this, index)} >
                        <div className="car-hd"><div className="title">{val.mobile}（{val.name}）</div>
                            <i className={arr.indexOf(index) == -1 ? 'choose-icon' : 'choose-icon active'}>
                            </i></div>
                        <div className="car-bd">
                            <div className="green"><label>地 址</label>{val.address}</div>
                            <div className="red"><label>提货码</label>{H.getExtractCode(val.code)}</div>
                            <div className="car-note">
                                {
                                    val.available == 0 ? (<span>当前地址不可送</span>) : null
                                }
                            </div>
                        </div>
                    </li>
                );
            })
        );

        return (<ul className="send-list">{xml}</ul>);
    }

    chooseAddress(index) {
        let arr = this.props.chooseIdArr,
            list = this.props.list;
        if(list[index].available == 0) return;
        if(arr.indexOf(index) == -1) {   //如果没有需要添加;
            arr.push(index);
        }else {
            arr.splice(arr.indexOf(index), 1);
        }
        this.props.chooseIdArr = arr;
        this.forceUpdate();
    }

    //添加地址;
    add() {
        this.props.currentAddress = {
            name: '',
            mobile: ''
        };
        let addDialog = H.dialog({
            title: '添加收货人？',
            content: '<div class="edit-address-player"><div class="hd">' +
            '<div class="flex-box center green"><div class="label">收货人</div><div class="flex-num1"><input id="shopName" placeholder="请输入收货人姓名" type="text" /></div><div id="editShopName" class="edit-address-icon"></div></div>' +
            '<div class="flex-box center red"><div class="label">收货电话</div><div class="flex-num1"><input id="phone" placeholder="请输入收货电话" type="tel" /></div><div id="editPhone" class="edit-address-icon"></div></div>' +
            '<div class="flex-box center green"><div class="label">收货地址</div><div class="flex-num1"><div id="chooseAddress" class="choose-address-val not">请点击选择</div></div><div id="editAddress" class="choose-address-icon"></div></div>' +
            '</div></div>',
            cancelText: '关闭',
            cancel: true,
            autoClose: false,
            okText: '提交',
            okCallback: () => {
                let data = this.props.currentAddress;
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
                        let list = this.props.list;
                        list.push(res.data);
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
            let data = $.extend(this.props.currentAddress || {}, obj);
            this.props.setShowMap && this.props.setShowMap(data);
        });
    }

    render() {
        return (
            <div>
                {this.createAddressList()}
                {
                    this.props.list.length >= this.props.total ? (
                        <div className="add-address">
                            <div className="add-address-btn" onClick={this.add.bind(this)}>
                                添加新提货人
                            </div>
                        </div>
                    ) : null
                }
            </div>
        );
    }
}

export default Step1;