import React from 'react';
/*
*按钮组
* btnNames: [],     //按钮的名字
* bindData: [],     //按钮绑定的数据
* clickCallBack: fn //按钮点击的回调
* style: ''         //按钮的的样式
* */
class BtnGroup extends React.Component{
    constructor(){
        super();
    }

    //创建按钮
    createButtons(){
        let bindData = this.props.bindData,
            style = this.props.style;
        let buttons = [];
        this.props.btnNames.map((name, index)=>{
            buttons.push(<a className={style} data-index={bindData[index]} href="javascript:;" > {name} </a>);
        });
        return buttons;
    }

    render(){
        return(
            <div>
                <div className="btn-group" onClick={this.props.clickCallback} >
                    {this.createButtons()}
                </div>
            </div>
        );
    }
}
export default BtnGroup;
