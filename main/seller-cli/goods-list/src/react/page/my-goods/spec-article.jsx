/*
* 商品规范书
* */
import ArticleWrap from '../../components/article/article-wrap.jsx';
import ArticleItem from '../../components/article/article-item.jsx';
class SpecArticle extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var wrapper = document.getElementById('article_wrap');
            new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2
            });
    }

    render() {
        return (
            <ArticleWrap id="article_wrap" title="找冻品网商品规范书">
                <ArticleItem title="一、商品名">
                    <p>商品名必须包含品牌（厂号）、名字、型号，示例：六和鸭胗M号、1123火鸡尖中号、渝达鸭肠大鸭、丰丰白条鸭4.2斤。</p>
                </ArticleItem>
                <ArticleItem title="二、品牌（厂号）">
                    <p>同一个商品只能有一个品牌（厂号），进口货的品牌栏，必须要明确厂号，不能留空，也不能只填个“进口”。</p>
                </ArticleItem>
                <ArticleItem title="三、产地">
                    <p>示例：六和鸭胗有山东产的，有河南产的，品质其实不一样，同一个商品只允许有一个产地，不能即是山东货又是河南货，2个产地的货，请上传为2个不同的产品。</p>
                    <p>进口货的产地必须要明确到国家，如132牛前的产地就是“德国“。</p>
                </ArticleItem>
                <ArticleItem title="四、商品分类">
                    <p>示例：鸡胸必须要明确是仔鸡胸还是老鸡胸，明明是仔鸡胸，却选择的是老鸡胸，这样的错误商品不允许上架。</p>
                </ArticleItem>
                <ArticleItem title="五、带箱重量">
                    <p>平台不允许上架连您都不知道重量的商品，按”公斤“销售的商品，带箱重量就填1。</p>
                </ArticleItem>
                <ArticleItem title="六、净重">
                    <p>去箱后的重量。</p>
                </ArticleItem>
                <ArticleItem title="七、解冻后重量">
                    <p>选填项，能明确解冻后的大概重量，会提升商品排名，信息越真实，买家反馈越好，商品就会优先展示。</p>
                </ArticleItem>
                <ArticleItem title="八、清真">
                    <p>必须明确商品外包装是否带有”清真“标志，同一商品不允许即是清真，又是非清真。</p>
                </ArticleItem>
            </ArticleWrap>
        );
    }
}

export default SpecArticle;