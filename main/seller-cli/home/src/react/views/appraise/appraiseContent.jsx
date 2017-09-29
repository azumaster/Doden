
class AppraiseContent extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (<section>{this.props.children}</section>);
    }
}

export default AppraiseContent;