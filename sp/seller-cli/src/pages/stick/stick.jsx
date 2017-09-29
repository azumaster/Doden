/**
 * Created by Doden on 2017.06.20
 */


class Stick extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div id="stick">
            {this.props.children}
        </div>);
    }
}

export default Stick;