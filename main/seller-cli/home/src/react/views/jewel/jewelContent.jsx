/**
 * Created by Doden on 2017.05.31
 */

class JewelContent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<section>{this.props.children}</section>

        );
    }
}

export default JewelContent;