class Tab extends React.Component{
    constructor(){
        super();
        this.state={
            index:1
        };
    }
    //处理掉class的问题当前的页面添加东西。
    togglePage(index){
        this.refs[this.state.index].setAttribute('class', '');
        this.refs[index].setAttribute('class', 'active');
        this.setState({index:index});
        this.props.togglePage(index);
    }

    render(){
        return(
        <div className="toolbar">
            <ul className='order-tab'>
                <li ref='1'  onClick={this.togglePage.bind(this, 1)}>全部订单</li>
                <li ref='2'  onClick={this.togglePage.bind(this, 2)}>未付款</li>
                <li ref='3'  onClick={this.togglePage.bind(this, 3)}>待发货</li>
                <li ref='4'  onClick={this.togglePage.bind(this, 4)}>已发货</li>
            </ul>
        </div>
        );
    }
}
export default Tab;