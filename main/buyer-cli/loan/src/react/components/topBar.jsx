/**
 * Created by Doden on 2017.06.22
 */

import React from 'react';

class TopBar extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        if(location.hash == '#/loan'){
            window.location.href = '#/loan/unPay';
        }
    }

    createTopBar(){
        let list = [],
            menu = this.props.menu;
        menu.map((m, i)=>{
            list.push(<div className={'top-bar-menu' + ((location.hash.indexOf(m.url)!=-1)?' active':'')} key={i} onClick={this.toPanel.bind(this, m.url)}>
                <p className={m.num?m.num>0?'has':'':''} data-num={m.num}>{m.name}</p>
            </div>);
        });

        return list;
    }

    toPanel(url){
        window.location.href = '#/loan/'+url;
    }

    render() {
        return (<div className="top-bar">
            {this.createTopBar()}
        </div>);
    }
}

export default TopBar;