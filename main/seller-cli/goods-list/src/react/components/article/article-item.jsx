/*
* 文章段落
* 参数说明：
* children:  段落内容;
* title: 标题；
* */

class ArticleItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className="article-item">
                <h2 className="title">{this.props.title}</h2>
                <section className="content">{this.props.children}</section>
            </section>
        );
    }
}

export default ArticleItem;