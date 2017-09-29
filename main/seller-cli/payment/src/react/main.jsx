

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
        return (<div id="payment" className="payment">
            {this.props.children}
        </div>);
    }
}

export default Main;