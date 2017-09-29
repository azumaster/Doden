/**
 * Created by Doden on 2017.03.03
 */

class SellPanel extends React.Component {
    constructor(props) {
        super(props);
        $.seller = true;
    }

    render() {
        return (<div id="sellerPanel">
                {this.props.children}
            </div>
        );
    }
}

export default SellPanel;