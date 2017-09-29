/**
 * Created by Doden on 2017.03.08
 */

import React from 'react';

class Tab extends React.Component {
    constructor(props) {
        super(props);
    }

    createTab(){
        let tabs = [],
            tabNames = this.props.tabNames,
            tabData = this.props.tabData,
            style = this.props.style,
            activeStyle = this.props.activeStyle,
            status = this.props.status;

        tabNames.map((tabName, index)=>{
            tabs.push(<div key={index} onClick={this.props.clickCallback || null} className={'flex-item '+(status!=tabData[index]?style:activeStyle)}>
                <h3 className="text-center" data-index={tabData[index]}>{tabName}</h3>
            </div>);
        });

        return tabs;
    }

    render() {
        return (<div id="topTab" className="tab">
            <div className="flex">
                {this.createTab()}
            </div>
        </div>);
    }
}

export default Tab;