/*
* 系统通知*/
import FooterLoading from '../../components/footer-loading/footer-loading.jsx';

class SystemInforms extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            param: {
                page: 1,
                size: 20
            },
            isLoad: true,
            loadEnd: false,
            data: []
        };
        this.getNoticeList = this.getNoticeList.bind(this);
    }

    componentWillMount() {
        H.we_loading.show();
        this.getNoticeList();
    }

    componentDidMount() {
        this.createScroll(this.getNoticeList);
    }

    //拉取数据;
    getNoticeList() {
        H.server.getNoticeList(this.state.param, (res) => {
            if(res.code == 0) {
                H.we_loading.hide();
                this.state.data = this.state.data.concat(res.data.notification_list);
                this.state.total = res.data.total;
                if(this.state.data.length >= res.data.total) {
                    this.state.loadEnd = true;
                }else {
                    this.state.param.page ++;
                }
                this.state.isLoad = true;
                this.setState();
                this.state.SCROLL.refresh();
            }else {
                H.operationState(res.message);
            }
        });
    }

    //创建IScroll;
    createScroll(fn){
        var wrapper = document.getElementById('notice_list'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false
            });
        this.setState({SCROLL: SCROLL});
        SCROLL.on('scroll', () => {
            if(this.state.loadEnd) return;
            if((SCROLL.y - SCROLL.maxScrollY) < 300) {
                if(this.state.isLoad) {
                    this.setState({isLoad: false}, () => {
                        fn && fn();
                        SCROLL.refresh();
                    });
                }
            }
        });
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    }

    render() {
        return (
            <div id="notice_list" className="notice-list">
                <div className="scroller">
                    {
                        this.state.data.map((val, index) => {
                            return (
                                <div key={index} className="notice-item">
                                    <div className="notice-time">{val.created_at}</div>
                                    <div className="notice-content">
                                        <p>通知人：系统管理员（{val.user_name}）</p>
                                        <p>商品名：{val.goods_name}</p>
                                        <p>商品状态：{val.type}</p>
                                    </div>
                                    <div className="notice-info">
                                        <p>通知内容：{val.note}</p>
                                    </div>
                                </div>
                            );
                        })
                    }
                    {
                        !this.state.loadEnd && !this.state.isLoad ? <FooterLoading /> : ''
                    }
                </div>
            </div>
        );
    }
}

export default SystemInforms;