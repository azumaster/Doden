

class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
    }

    render() {
        return (<div id="shopPage" className="shop-page">
            {this.props.children}
        </div>);
    }
}

export default Main;