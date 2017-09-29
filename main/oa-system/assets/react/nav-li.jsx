import React, {Component} from 'react';
import Link from './link.jsx';

class NavLi extends Component {
    constructor(props) {
        super(props);
    }

    createTab(node) {
        let have = false;

        for(let i=0; i<H.newPageList.length; i++){
            if(H.newPageList[i].indexOf(this.props.data.url) != -1){
                have = true;
                break;
            }
        }

        if(have) {
            window.open(this.props.data.url);
            return;
        }

        let tab = {
            id : this.props.data.id,
            parentId: this.props.parentId,
            name : this.props.data.name,
            url : this.props.data.url,
            selected : true,
            isOpen : true,
            isRequest : false
        };
        this.props.updateTabMenu && this.props.updateTabMenu(tab);
        $('#' + node).parent().siblings().removeClass('active');
        $('#' + node).parent().addClass('active');
    }

    hasNoSub() {
        return(
            <li>
                <Link
                    id={'nid_' + this.props.parentId + '_' + this.props.data.id}
                    name={this.props.data.name}
                    clickEvent={this.createTab.bind(this, 'nid_' + this.props.parentId + '_' + this.props.data.id)}>
                    <i className={'glyphicon ' + this.props.data.url}></i>
                    <span>{this.props.data.name}</span>
                </Link>
            </li>
        );
    }

    render(){
        return this.hasNoSub();
    }
}

export default NavLi;