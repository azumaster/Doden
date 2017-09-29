/**
 * Created by Doden on 2017.05.15
 */

import React from 'react';

class Tab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: []
        };
    }

    componentWillMount(){
        let tabs = this.props.tabs;
        this.setState({
            tabs: tabs
        });
    }

    changeTab(e){
        let id = e.target.dataset.id;

        this.props.changeTab && this.props.changeTab(id);
    }

    createTabs(){
        let tabs = [];

        this.state.tabs.map((tab, index)=>{
            tabs.push(<div className={'tab-item '+(this.props.status==index?'active':null)} data-id={index} key={index}>{tab}</div>);
        });

        return tabs;
    }

    render() {
        return (<div id="tab" className="tab" onClick={this.changeTab.bind(this)}>
            {this.createTabs()}
        </div>);
    }
}

export default Tab;