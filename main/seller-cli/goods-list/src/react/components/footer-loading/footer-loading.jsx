/*
* 底部数据加载效果*/

class FooterLoading extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="pull-loading">
                <i className="loading"></i><span className="txt">加载中......</span>
            </div>
        );
    }
}

export default FooterLoading;