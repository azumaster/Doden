import React from 'react';
class HeadBar extends React.Component {
    constructor(props) {
        super(props);
    }
    logout(e) {
        e.preventDefault();
        H.server.logout({}, function (res) {
            if (res.code == 0) {
                window.location.href = '/';
            }
        });
    }

    render() {
        return (
            <div className="section-top-navbar navbar navbar-default">
                <a className="toggle-left-sidebar">
                    <img src="/images/logo.png" alt="logo" />
                </a>
                <a href="#" className="logout" id="logout" onClick={this.logout}><i className="glyphicon glyphicon-off" title="退出"></i></a>
            </div>
        );
    }
}

export default HeadBar;