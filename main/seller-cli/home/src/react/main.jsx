/**
 * Created by Doden on 2017.05.31
 */



class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    }

    render() {
        return (<div>
            {this.props.children}
        </div>);
    }
}

export default Main;