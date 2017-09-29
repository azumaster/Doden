import React from 'react';

class Home extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                欢迎
                <p>{this.props.userInfo.name}（{this.props.userInfo.login_name}）</p>
            </div>
        );
    }
}

export default Home;