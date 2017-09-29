/**
 * Created by Doden on 2017.07.07
 */

class Level extends React.Component {
    constructor(props) {
        super(props);
    }

    // 判断店铺等级
    create() {
        let xml = '',
            level = this.props.level;
        switch (level) {
            case 1:
                xml = (<span className="shop-level"><i className="low"></i></span>);
                break;
            case 2:
                xml = (<span className="shop-level"><i className="low"></i><i className="low"></i></span>);
                break;
            case 3:
                xml = (<span className="shop-level"><i className="low"></i><i className="low"></i><i className="low"></i></span>);
                break;
            case 4:
                xml = (<span className="shop-level"><i className="low"></i><i className="low"></i><i className="low"></i><i className="low"></i></span>);
                break;
            case 5:
                xml = (<span className="shop-level"><i className="low"></i><i className="low"></i><i className="low"></i><i className="low"></i><i className="low"></i></span>);
                break;
            case 6:
                xml = (<span className="shop-level"><i className="middle"></i></span>);
                break;
            case 7:
                xml = (<span className="shop-level"><i className="middle"></i><i className="middle"></i></span>);
                break;
            case 8:
                xml = (<span className="shop-level"><i className="middle"></i><i className="middle"></i><i className="middle"></i></span>);
                break;
            case 9:
                xml = (<span className="shop-level"><i className="middle"></i><i className="middle"></i><i className="middle"></i><i className="middle"></i></span>);
                break;
            case 10:
                xml = (<span className="shop-level"><i className="middle"></i><i className="middle"></i><i className="middle"></i><i className="middle"></i><i className="middle"></i></span>);
                break;
            case 11:
                xml = (<span className="shop-level"><i className="high"></i></span>);
                break;
            case 12:
                xml = (<span className="shop-level"><i className="high"></i><i className="high"></i></span>);
                break;
            case 13:
                xml = (<span className="shop-level"><i className="high"></i><i className="high"></i><i className="high"></i></span>);
                break;
            case 14:
                xml = (<span className="shop-level"><i className="high"></i><i className="high"></i><i className="high"></i><i className="high"></i></span>);
                break;
            case 15:
                xml = (<span className="shop-level"><i className="high"></i><i className="high"></i><i className="high"></i><i className="high"></i><i className="high"></i></span>);
                break;
            case 16:
                xml = (<span className="shop-level"><i className="super"></i></span>);
                break;
            case 17:
                xml = (<span className="shop-level"><i className="super"></i><i className="super"></i></span>);
                break;
            case 18:
                xml = (<span className="shop-level"><i className="super"></i><i className="super"></i><i className="super"></i></span>);
                break;
            case 19:
                xml = (<span className="shop-level"><i className="super"></i><i className="super"></i><i className="super"></i><i className="super"></i></span>);
                break;
            case 20:
                xml = (<span className="shop-level"><i className="super"></i><i className="super"></i><i className="super"></i><i className="super"></i><i className="super"></i></span>);
                break;
        }
        return xml;
    }

    render() {
        return (<p>
            {this.create()}
        </p>);
    }
}

export default Level;