/**
 * Created by Doden on 2017.03.03
 */

class Sell extends React.Component {
    constructor(props) {
        super(props);
        $.seller = true;
    }

    componentWillMount(){
        window.location.href = '#/seller';
    }

    render() {
        return (<div id="sellerRoute">
                {this.props.children}
            </div>
        );
    }
}

export default Sell;