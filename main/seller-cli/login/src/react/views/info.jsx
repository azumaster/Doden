/**
 * 找冻品网注册（填写详细信息）
 * 切换买家和卖家
 * Created by Doden on 2017.05.15
 */

import React from 'react';

import Tab from './../components/tab.jsx';
import Cascade from './../components/cascade.jsx';

class Info extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            infoStatus: 0,
            pageStatus: 0,
            market: null,
            address: null,
            currentMarket: '',
            currentAddress: '',
            pianquId: '',
            shopAddress: '',
            example: false,
            cMarket: null, //选择的当前市场
            cAddress: null, // 选择的的当前地址
            openAddressCascade: false,
            openMarketCascade: false,
            uploadImg: '',
            mediaSrc: '',
            regAddress: {},
            re: null,
            final: false
        };
    }

    componentWillMount(){
        this.getArea();

        let re = this.props.re,
            info = 0;

        if(re){
            if(re.trenchnum == 21){
                info = 0;
            }else if(re.trenchnum == 11){
                info = 1;
                this.getMarket();
            }
        }

        console.log('will:'+re);
        this.setState({
            re: re,
            infoStatus: info
        });
    }


    componentDidMount(){
        this.createScroll();
        $('#info').css({height: window.innerHeight + 'px'});

        console.log(this.state.re);
        if(this.state.re){
            // let address = '';
            document.getElementById('userName').value = this.state.re.xingming;
            document.getElementById('dianpu').value = this.state.re.dianPuName;
            document.getElementById('xxdz').value = this.state.re.xiangXiDiZi;
            // if(this.state.re.trenchnum == 21){
            //     // 二批
            //     document.getElementById('shopAddress').innerHTML='<em>'+this.state.re.province+this.state.re.city+this.state.re.county+'</em><i class="icon right"></i>';
            // }else if(this.state.re.trenchnum == 11){
            //     // 一批
            //     document.getElementById('shopAddress2').innerHTML='<em>'+this.state.re.province+this.state.re.city+this.state.re.county+'</em>';
            //
            // }

            this.setState({
                uploadImg: this.state.re.cardPic,
                mediaSrc: this.state.re.cardPic
            });
        }
    }

    getArea(){
        H.server.getMarket({type: 21}, (res)=>{
            if(res.code == 0 || res.status == 0){
                let address = {0:[], 1:{}, 2:{}};
                for(let pk in res.data.provinceArr){
                    address[0].push({id: res.data.provinceArr[pk].provinceidtxt, name: res.data.provinceArr[pk].dividename});
                }
                for(let key in res.data.cityArr){
                    address[1][key] = [];
                    for(let ck in res.data.cityArr[key]){
                        address[1][key].push({id: ck, name: res.data.cityArr[key][ck]});
                    }
                }
                for(let key in res.data.countyArr){
                    address[2][key] = {};
                    for(let k in res.data.countyArr[key]){
                        address[2][key][k] = [];

                        for(let cok in res.data.countyArr[key][k]){
                            if(res.data.countyArr[key][k][cok]){
                                address[2][key][k].push({id: cok, name: res.data.countyArr[key][k][cok]});
                            }
                        }
                    }
                }

                this.setState({
                    address: address
                });
            }else{
                H.toast(res.message);
            }
        });
    }

    getMarket(){
        H.server.getMarket({type: 11}, (res)=>{
            if(res.code == 0 || res.status == 0){
                let market = {0:[], 1:{}};
                res.data.provinceArr.map((province)=>{
                    market[0].push({id: province.provinceidtxt, name: province.dividename});
                });
                for(let key in res.data.pianquArr){
                    market[1][key] = [];
                    res.data.pianquArr[key].map((pianqu)=>{
                        market[1][key].push({id: pianqu.pianquId, name: pianqu.pianqu});
                    });
                }

                this.setState({
                    market: market
                });
            }else{
                H.toast(res.message);
            }
        });
    }

    createScroll(){
        let scrollOptions = {
            zoom: true,
            scrollX: false,  //是不中可以横向滚动;
            scrollY: true,  //是否可以纵向滚动;
            mouseWheel: true, //是否监听鼠标滚轮;
            wheelAction: 'zoom',
            probeType: 2,
            preventDefault: false
        };

        let SCROLL = new IScroll('#info', scrollOptions);

        SCROLL.on('beforeScrollStart', () => {
            SCROLL.refresh();
        });
        this.SCROLL = SCROLL;
    }

    createInfo(){
        return (<div className="info-content">
            <div className="info-item notice"><p>请输入店铺信息</p></div>
            <div className="info-item form">
                <label className="label">姓名<span className="require">*</span></label>
                <input type="text" id="userName" placeholder="请输入姓名"/>
            </div>
            <div className="info-item form">
                <label className="label">店铺名<span className="require">*</span></label>
                <input type="text" id="dianpu" placeholder="请输入店铺名"/>
            </div>
            {this.state.infoStatus == 1?
                <div className="info-item form">
                    <label className="label">市场地址<span className="require">*</span></label>
                    <p className="form-label" id="marketAddress" onClick={this.chooseMarket.bind(this)}>{this.state.currentMarket?<em>{this.state.currentMarket}</em>:'选择市场'}<i className="icon right"></i></p>
                </div>:null}
            <div className="info-item form">
                <label className="label">店铺地址<span className="require">*</span></label>
                {this.state.infoStatus == 0?<p id="shopAddress" className="form-label" onClick={this.openAddress.bind(this)}>{this.state.currentAddress?<em>{this.state.currentAddress}</em>:'选择省、市、县'}<i className="icon right"></i></p>
                :<p className="form-label" id="shopAddress2">请先选择市场地址</p>}
            </div>
            <div className="info-item form detail">
                <label className="label">详细地址<span className="require">*</span></label>
                <input type="text" id="xxdz" placeholder="请输入街道门牌号"/>
            </div>

            <div className="info-item notice"><p>请上传店铺照片</p></div>
            <div className="info-item photo">
                <div className="info-upload">
                    <div className="info-upload-img" onClick={this.upload.bind(this)}>
                        <div className="image-input"></div>
                        <img style={{display: this.state.uploadImg?'block':'none'}} className="image-preview" src={this.state.uploadImg}/>
                        <span className="img-require">*</span>
                    </div>
                    <a href="javascript:;" onClick={this.handleExample.bind(this)}>示例图片</a>
                </div>
                <p className="info-notice">上传的照片要包含门店招牌，并且与填写的店铺名必须一致</p>
            </div>
            <div className="info-item btn"><div className={'info-btn '+(this.state.final?'':'disabled')} onClick={this.complete.bind(this)}>完成</div></div>
        </div>);
    }

    createExample(){
        return(<div id="example" className="photo-example" >
            <div className="icon close" onClick={this.handleExample.bind(this)}></div>
            <img src="http://img.idongpin.com/Public/images/login/test.png"/>
        </div>);
    }

    createAuditing(){
        return (<div id="auditing" className="auditing">
            <div className="audit-img"><img src="http://img.idongpin.com/Public/images/login/auditing.png"/></div>
            <p className="audit-text">店铺审核中...</p>
            <p className="audit-assist">店铺审核将在3个工作日内完成，请耐心等待</p>
        </div>);
    }

    handleExample(){
        this.setState({
            example: !this.state.example
        });
    }

    // 提交注册
    complete(){
        if(!this.state.final) return;

        if(!this.state.regAddress){
            H.toast('请检查你的填写信息' );
        }else{
            if(this.state.re){
                let info = 0;
                if(this.state.infoStatus == 0){
                    info = 21;
                }else if(this.state.infoStatus == 1){
                    info = 11;
                }

                let params = {
                    shId: this.state.re.shId,
                    shopId: this.state.re.shopId,
                    shopType: info,
                    userName: document.getElementById('userName').value,
                    dianPuName: document.getElementById('dianpu').value,
                    province: this.state.regAddress.pId,
                    city: this.state.regAddress.cId,
                    xiangXiDiZi: document.getElementById('xxdz').value,
                    cardPic: this.state.mediaSrc,
                    pianquId: this.state.infoStatus==0?0:this.state.pianquId
                };

                if(this.state.regAddress.countyId){
                    params.county = this.state.regAddress.countyId;
                }

                if(!params.cardPic) return;

                H.server.reRegister(params, (res)=>{
                    if(res.code ==0 || res.status ==0){
                        this.setState({
                            pageStatus: 1
                        });
                    }else{
                        H.toast(res.message);
                    }
                });
            }else {
                let info = 0;
                if(this.state.infoStatus == 0){
                    info = 21;
                }else if(this.state.infoStatus == 1){
                    info = 11;
                }

                let params = {
                    type: info,
                    regTel: this.props.tel,
                    userName: document.getElementById('userName').value,
                    dianPuName: document.getElementById('dianpu').value,
                    province: this.state.regAddress.pId,
                    city: this.state.regAddress.cId,
                    xiangXiDiZi: document.getElementById('xxdz').value,
                    cardPic: this.state.mediaSrc,
                    pianquId: this.state.infoStatus==0?0:this.state.pianquId
                };

                if(this.state.regAddress.countyId){
                    params.county = this.state.regAddress.countyId;
                }

                H.server.submitRegister(params, (res)=>{
                    if(res.code ==0 || res.status ==0){
                        this.setState({
                            pageStatus: 1
                        });
                    }else{
                        H.toast(res.message);
                    }
                });
            }
        }
    }

    changeTab(id){
        if(id){
            this.setState({infoStatus: id}, ()=>{
                if(id == 1){
                    // 如果是1批商，则获取市场地址
                    if(!this.state.market){
                        this.getMarket();
                    }
                    this.setState({
                        cAddress: null,
                        currentAddress: ''
                    });
                }
                else if(id == 0){
                    // 如果是二批商，则获取省市县信息
                    if(!this.state.address){
                        this.getArea();
                    }
                    this.setState({
                        cMarket: null,
                        currentMarket: ''
                    });
                }
            });
        }
    }

    // 微信JSSDK上传图片
    upload(){
        let _this = this;

        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var localIds = res.localIds;
                syncUpload(localIds);
            }
        });
        let syncUpload = function(localIds) {
            let localId = localIds.pop();
            _this.setState({
               uploadImg: localId
            });
            wx.uploadImage({
                localId: localId,
                isShowProgressTips: 1,
                success: function (res) {

                    console.log('aaa');
                    _this.setState({
                        mediaSrc: res.serverId,
                        final: true
                    }, ()=>{
                        console.log('bbb');
                    });
                },
                fail: function (res) {
                    alert(res.errMsg);
                }
            });
        };
    }

    // 选择市场
    chooseMarket(){
        this.SCROLL.destroy();
        this.setState({
            openMarketCascade: true
        });
    }

    // 选择省市县
    openAddress(){
        this.SCROLL.destroy();
        this.setState({
            openAddressCascade: true
        });
    }

    // 关闭Cascade
    closeMarketCascade(current) {
        if(current[0]){
            let shopAddress = '';
            // 获取店铺地址
            H.server.getShopAddress({id: current[1].id}, (res)=>{
                if(res.code == 0 || res.status == 0){
                    shopAddress = res.data.province+' '+res.data.city+' '+(res.data.county?res.data.county:'');
                    $('#shopAddress2').html('<em>'+shopAddress+'</em>');
                    let reg = {pId: res.data.province_id, cId: res.data.city_id};
                    if(res.data.county_id){
                        reg.countyId = res.data.county_id;
                    }
                    this.setState({
                        regAddress: reg
                    });
                }else{
                    H.toast(res.message);
                }
            });

            this.setState({
                currentMarket: current[0].name+' '+current[1].name,
                pianquId: current[1].id,
                cMarket: current,
                shopAddress: shopAddress
            });
        }
        this.setState({
            openMarketCascade: false
        }, this.createScroll);
    }

    // 关闭店铺地址
    closeAddressCascade(current){
        if(current[0]){
            let shopAddress = '',
                reg = {};
            if(current[2]){
                shopAddress = current[0].name+' '+current[1].name + ' '+current[2].name;
                reg = {pId: current[0].id, cId: current[1].id, countyId: current[2].id};
            }else if(current[1]){
                shopAddress = current[0].name+' '+current[1].name;
                reg = {pId: current[0].id, cId: current[1].id};
            }else {
                shopAddress = current[0].name;
                reg = {pId: current[0].id};
            }

            this.setState({
                currentAddress: shopAddress,
                cAddress: current,
                regAddress: reg
            });
        }

        this.setState({
            openAddressCascade: false
        }, this.createScroll);
    }

    render() {
        let tabs = ['我要买货', '我要卖货'],
            page = this.state.pageStatus==0 ? <div id="info" className="info">
                <div id="scroll" className="scroller">
                    <Tab tabs={tabs} status={this.state.infoStatus} changeTab={this.changeTab.bind(this)}></Tab>
                    <div className="info-inner">
                        {this.createInfo()}
                    </div>
                </div>
                {this.state.example ? this.createExample() : null}
                {this.state.openMarketCascade?<Cascade close={this.closeMarketCascade.bind(this)} address={this.state.market} title="选择市场"
                                                 current={this.state.cMarket}/>:null}
                {this.state.openAddressCascade?<Cascade close={this.closeAddressCascade.bind(this)} address={this.state.address} title="店铺地址"
                                                       current={this.state.cAddress}/>:null}
            </div> : (this.state.pageStatus==1?this.createAuditing():null);

        return page;
    }

}

export default Info;