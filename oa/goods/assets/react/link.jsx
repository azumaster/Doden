class Link extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <a id={this.props.id} href={this.props.url} title={this.props.name} onClick={this.props.clickEvent}>
                {this.props.children}
            </a>
        );
    }
}

export default Link;