/**
 * Created by Doden on 2017.06.20
 */

import React from 'react';

class StickCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentClass: 0,
            currentType: 0,
            goodsType: []
        };
    }

    componentWillMount() {
        this.getData();
        if (sessionStorage.getItem('class')) {
            this.setState({
                currentClass: sessionStorage.getItem('class')
            });
        }
    }

    getData(){
        let data = {};
        data.status = 0;
        $.loading.show();

        $.req.getTypeList(data, (res)=>{
            if(res.code == 0){
                let secondType = [];
                for(let key in res.data[1]){
                    secondType.push(res.data[1][key]);
                }

                this.setState({
                    currentType: secondType[this.state.currentClass].type_id,
                    goodsType: res.data
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

        let SCROLL_CLASS = new IScroll('#goodsClass', scrollOptions);
        let SCROLL_TYPE = new IScroll('#typeList', scrollOptions);

        SCROLL_CLASS.on('beforeScrollStart', () => {
            SCROLL_CLASS.refresh();
        });
        SCROLL_TYPE.on('beforeScrollStart', () => {
            SCROLL_TYPE.refresh();
        });

    }

    openStick(e){
        let id = e.target.dataset.id;

        let currentClass = this.state.currentClass;

        sessionStorage.setItem('class', currentClass);
        window.location.href=location.hash+'/'+id;
    }

    createClass(){
        let goodClass = [];

        if(this.state.goodsType){
            let secondType = [];

            for(let key in this.state.goodsType[1]){
                if(typeof this.state.goodsType[1][key] == 'object') {
                    secondType.push(this.state.goodsType[1][key]);
                }
            }

            secondType.map((type, index)=>{
                goodClass.push(<div key={index} onClick={this.toggleClass.bind(this)} className={'good-class '+(this.state.currentClass==index?'active':'')}>
                    <h4 data-index={index} data-id={type.type_id} className="text-center">{type.type_name}</h4>
                </div>);
            });
        }

        return(<div id="goodsClass" className="goods-class" style={location.hash.indexOf('blacklist') != -1 ? {top: 0} : null}>
            <div id="scrollClass">
                {goodClass}
            </div>
        </div>);
    }

    toggleClass(e){
        let index = e.target.dataset.index,
            id = e.target.dataset.id;
        if(index == this.state.currentClass){
            return;
        }

        this.setState({
            currentClass: index,
            currentType: id
        }, this.getData);
    }

    createTypeList(){
        let typeList = [];

        if(this.state.goodsType[1]){
            let thirdType = this.state.goodsType[1][this.state.currentType];
            if(thirdType){
                let third = [];
                for(let key in thirdType){
                    if(!isNaN(key)){
                        third.push(thirdType[key]);
                    }
                }

                third.map((t, index)=>{
                    typeList.push(<div key={index} className="grid-col-4">
                        <div className="type-item" data-id={t.type_id} onClick={this.openStick.bind(this)}>
                            <img className="img-rounded" data-id={t.type_id} src={$.cdn()+t.type_pic_url+$.img(120, 100)}/>
                            <h5 className="text-assist text-center" data-id={t.type_id}>{t.type_name}</h5>
                        </div>
                    </div>);
                });
            }
        }

        return(<div id="typeList" className="type-list" style={location.hash.indexOf('blacklist') != -1 ? {top: 0} : null}>
            <div id="scrollType" className="grid-row">
                {typeList}
            </div>
        </div>);
    }

    render() {
        return (<div id="stickCategory" className="stick-category">
            <div id="stickContent" className="stick-content">
                {this.createClass()}
                {this.createTypeList()}
            </div>
        </div>);
    }
}

export default StickCategory;