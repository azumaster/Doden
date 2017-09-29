import React from 'react';
import TabClose from './main-tab-close.jsx';
import TabContentControl from './main-tab-content.jsx';

class TabController extends React.Component {
    navClick(o, e) {
        e.preventDefault();
        let tab = o;
        tab.selected = false;
        this.props.stateUpdate && this.props.stateUpdate(tab);
    }

    render() {
        return(
            <div className="section-main-panel" id="section-main">
                <div className="section-main-w">
                    <div className="tabs-w">
                        <ul className="nav nav-tabs" role="tablist" id="tab-list">
                            {
                                this.props.tabMenuArr.map((el, index)=>{
                                    let closeBtn = '',
                                        isSelected = el.selected ? 'active' : '';
                                    if(el.id != 0) {
                                        closeBtn =  (
                                            <TabClose data={el} closeTabHandler={this.props.closeTabHandler} />
                                        );
                                    }
                                    if (el.isOpen) {
                                        return (
                                            <li role="presentation" key={index} className={isSelected}>
                                                <a onClick={this.navClick.bind(this, el)}>
                                                    {el.name}
                                                    <span>&nbsp;</span>
                                                    {closeBtn}
                                                </a>
                                            </li>
                                        );
                                    }
                                })
                            }
                        </ul>
                        <TabContentControl
                            userInfo={this.props.userInfo}
                            tabMenuArr={this.props.tabMenuArr}
                            userNavigate={this.props.userNavigate}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default TabController;