import React from 'react';
/*
 *按钮组
 * btnNames: [],     //按钮的名字
 * bindData: [],     //按钮绑定的数据
 * clickCallBack: fn //按钮点击的回调
 * style: ''         //按钮的的样式
 * status: 1         //当前选择的按钮;
 * activeStyle: string  //选择按钮的样式;
 * */

/*<BtnGroup btnNames={btnNames} bindData={bindData} clickCallback={this.setCurrentArea.bind(this)}
 style="btn btn-lg" activeStyle="btn btn-lg btn-default" status={this.state.currentAreaId}/>*/

class BtnGroup extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            status: this.props.status || []
        };
    }

    static defaultProps = {
        style: '',
        bindData: [1, 2, 3, 4, 5, 6, 7, 8]
    };

    //创建按钮
    createButtons() {
        let bindData = this.props.bindData,
            style = this.props.style,
            activeStyle = this.props.activeStyle,
            operate = this.props.operate;
        let buttons = [];
        this.props.btnNames.map((name, index)=> {
            buttons.push(<a data-operate={operate?operate[index]:null}
                            className={this.state.status.indexOf(bindData[index]) === -1 ? style : activeStyle}
                            data-checked={this.state.status.indexOf(bindData[index]) !== -1}
                            key={index}
                            data-index={bindData[index]}
                            href="javascript:;">{name}</a>);
        });
        return buttons;
    }

    handleChange(e) {
        let target = $(e.target);
        let val = target.attr('data-index');

        let index = this.state.status.indexOf(val);

        if (target.attr('data-checked') === 'false' && index === -1) {
            this.state.status.push(val);
            target.attr('data-checked', true);
            target.removeClass(this.props.style).addClass(this.props.activeStyle);
        } else if (target.attr('data-checked') === 'true' && index !== -1) {
            this.state.status.splice(index, 1);
            target.attr('data-checked', false);
            target.removeClass(this.props.activeStyle).addClass(this.props.style);
        }

        if (this.props.clickCallback) {
            this.props.clickCallback(this.state.status);
        }
    }

    render() {
        return (
            <div onClick={this.handleChange}
                 className={this.props.className} data-index={this.props.index}>
                {this.createButtons()}
            </div>
        );
    }
}
export default BtnGroup;
