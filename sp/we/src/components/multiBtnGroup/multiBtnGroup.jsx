/**
 * Created by Doden on 2017.03.08
 */

import React from 'react';

class BtnGroup extends React.Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        style : 'btn-default',
        btnData: [1, 2, 3, 4, 5],
        status: -1
    };

    createButtons(){
        let buttons = [],
            btnNames = this.props.btnNames,
            btnData = this.props.btnData,
            style = this.props.style,
            checked = this.props.checked,
            activeStyle = this.props.activeStyle;

        btnNames.map((btnName, index)=>{
            let btns,
                twoStyle = '';
            let isChecked = false;
            if(typeof(btnName) === 'object'){
                btns = [<em>{btnName.brand_name}</em>, <em>{btnName.i}%</em>];
                twoStyle = 'two';

                checked.map((c)=>{
                    if(c == btnName.brand_id){
                        isChecked = true;
                    }
                });
            }else{
                btns = btnName;
                checked.map((c)=>{
                    if(c == index){
                        isChecked = true;
                    }
                });
            }

            buttons.push(<div className="btn-group-item"><button key={index} type="button" className={'btn '+ twoStyle + ' ' + (!isChecked?style:activeStyle)}
                                      data-index={btnData[index]} onClick={this.props.clickCallback || null}>{btns}</button></div>);
        });

        return buttons;
    }

    render() {
        return (<div className="btn-group">
            {this.createButtons()}
        </div>);
    }
}

export default BtnGroup;