/*
* 注册协议
* */

class Article extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dom: null
        };
    }

    componentWillMount() {
        $.req.getArticle(this.props.params.file, (res) => {
            this.setState({dom: res});
        });
    }

    componentDidMount() {
        this.createScroll();
    }

    createScroll(){
        var wrapper = document.getElementById('ArticleWrap'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 3,
                preventDefault: false
            });
        SCROLL.on('beforeScrollStart', () => {
            SCROLL.refresh();
        });
    }

    count() { //获取n天后的日期;
        var dd = new Date();
        return {
            y: dd.getFullYear(),
            m: dd.getMonth()+1,
            d: dd.getDate()
        };
    }

    render() {
        return (
            <div id="ArticleWrap" className="article-wrap">
                <div className="scroller">
                    <div className="article-content" dangerouslySetInnerHTML={{__html: this.state.dom}}></div>
                    {
                        this.props.params.file == 'authorization-qiye' ?
                        <p style={{padding: '15px', lineHeight: 1.6, fontSize: '14px'}}>我司【{this.props.license_name}】（公司营业执照号码／统一信用代码证【{this.props.license_code}】）于【{this.count().y}】年【{this.count().m}】月【{this.count().d}】日授权我司代理人通过线上点击确认方式签署本授权确认书并授权确认如上。</p> : null
                    }
                    {
                        this.props.params.file == 'authorization-geren' ?
                            <p style={{padding: '15px', lineHeight: 1.6, fontSize: '14px'}}>本授权人【{this.props.name}】（身份证号码【{this.props.id_card}】）于【{this.count().y}】年【{this.count().m}】月【{this.count().d}】日通过线上点击确认方式签署本授权确认书并授权确认如上。</p> : null
                    }
                </div>
            </div>
        );
    }
}

export default Article;