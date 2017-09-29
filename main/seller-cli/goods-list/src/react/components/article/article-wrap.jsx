/*
* 文章容器
* 参数说明：
* title:  大标题;
* children: 内容部分;
* id: 区分不同的文章;
* */

class ArticleWrap extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id={this.props.id} className="article-wrap">
                <div className="scroller">
                    <div className="article-hd">
                        <h1>{this.props.title}</h1>
                    </div>
                    <div className="article-bd">
                        {this.props.children}
                    </div>
                    <div className="article-ft"></div>
                </div>
            </div>
        );
    }
}

export default ArticleWrap;

