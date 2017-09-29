/*
* 游客访问商品列表的footer
* */

class TouristsFooter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <footer className="flex-box center tourists-footer">
                <div className="flex-num1">注册后可查询价格</div>
                <a className="go-login">免费注册</a>
            </footer>
        );
    }
}

export default TouristsFooter;