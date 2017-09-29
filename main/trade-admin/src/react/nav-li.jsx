import React, {Component} from 'react';
import Link from './link.jsx';

class NavLi extends Component {
    constructor(props) {
        super(props);
    }

    hasNoSub() {
        return(
            <li>
                <Link
                    id={this.props.id}
                    name={this.props.data.name}
                >
                    <i className="glyphicon glyphicon-fire"></i>
                    <span>{this.props.data.name}</span>
                </Link>
                {this.props.children}
            </li>
        );
    }

    render(){
        return this.hasNoSub();
    }
}

export default NavLi;