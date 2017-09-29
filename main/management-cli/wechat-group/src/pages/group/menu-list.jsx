import React from 'react';
import MainMenuListItem from './mainMenu-list-item.jsx';
import ConditionalMenuListItem from './conditionalMenu-list-item.jsx';

class MenuList extends React.Component {
	constructor(props) {
		super(props);
	}

	static propTypes = {
	    menuList:  React.PropTypes.object.isRequired
	}

	render (){
		let menu_types = this.props.menuList.menu_type || [],
			main_menu = this.props.menuList.main_menu || [],
			conditional_menu = this.props.menuList.conditional_menu || [];
		return (
			<div className="section-menu-list">
				<MainMenuListItem
					menuTypes={menu_types}
					menuItem={main_menu} />

				{conditional_menu.map((el, index) => {
					return (
						<ConditionalMenuListItem
							key={'conditional_menu' + index}
							menuTypes={menu_types}
							menuItem={el} />);
				})}
			</div>
		);
	}
}

export default MenuList;

