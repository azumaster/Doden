/*
* 等级图标;
* props:  level    //等级数;
* */

class Level extends React.Component {
    constructor(props) {
        super(props);
    }

    //店铺等级;
    shopLevel() {
        let xml = [],
            level = this.props.level;
        console.log(this.props.level);
        if(level <= 5) {
            for(let i = 1 ; i <= level ; i++) {
                xml.push(<i className="low" key={i}></i>);
            }
        }else if(level > 5 && level <= 10) {
            for(let i = 6 ; i <= level ; i++) {
                xml.push(<i className="middle" key={i}></i>);
            }
        }else if(level > 10 && level <= 15) {
            for(let i = 11 ; i <= level ; i++) {
                xml.push(<i className="high" key={i}></i>);
            }
        }else {
            for(let i = 16 ; i <= 20 ; i++) {
                xml.push(<i className="highest" key={i}></i>);
            }
        }
        return xml;
    }

    render() {
        return (<span className="shop-level">{this.shopLevel()}</span>);
    }
}

export default Level;