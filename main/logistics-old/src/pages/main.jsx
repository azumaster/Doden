import React from 'react';
import Content from '../components/content/content.jsx';
import AddInfo from '../components/addinfo/addinfo.jsx';

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sdf: 1
		};
	}

	render() {
		return (
			<div>
				<Content />
				<AddInfo />
			</div>
		);
	}
}

export default Main;
