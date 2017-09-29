/*
* 主控制页面;
* */
import All from './all/all.jsx';
import Already from './already/already.jsx';
import Not from './not/not.jsx';
import Tab from '../../../components/tab/tab.jsx';
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageState: 0
        };
        this.createContent = this.createContent.bind(this);
        this.createScroll = this.createScroll.bind(this);
    }

    componentWillMount() {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    }

    componentDidMount() {
        this.createScroll();
    }

    createScroll(){
        var wrapper = document.getElementById('posWrap'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false
            });
        SCROLL.on('scroll', () => {
            if(this.state.list.length >= this.state.total || this.state.step != 1) return;
            if((SCROLL.y - SCROLL.maxScrollY ) < 300) {
                this.state.defaultParam.page++;
                this.getAddressData();
            }
        });
        SCROLL.on('scrollEnd', () => {
            //SCROLL.options.preventDefault = false;
            if(this.state.list.length >= this.state.total || this.state.step != 1) return;
            if((SCROLL.y - SCROLL.maxScrollY ) < 300) {
                this.state.defaultParam.page++;
                this.getAddressData();
            }
        });
        this.state.SCROLL = SCROLL;
    }

    tabHandler(num) {
        console.log(num);
    }

    //创建不同的内容;
    createContent() {
        let xml = null;
        switch (this.state.pageState) {
            case 0:
                xml = (<All />);
                break;
            case 1:
                xml = (<Not />);
                break;
            case 2:
                xml = (<Already />);
                break;
        }
        return xml;
    }

    //给列表添加click事件;
    clickHandler(e) {
        let status = e.target.dataset.status;
        switch (status) {
            case '1':
                H.dialog({
                    title: '<div class="flex-box" style="text-align: left;padding: 0 20px;">' +
                    '<div class="dialog-handler-title flex-num1">发件人：食品房子</div><span class="color-warning">未装车</span></div>',
                    content: '<div class="dialog-card-bd"><div class="green-icon"><label>运单号</label>201702065585</div>' +
                    '<div class="red-icon"><label>提货人</label>张哥（0102033）</div><div class="orange-icon"><label>预约数量</label>3件</div></div>' +
                    '<ul id="dialogList" class="dialog-blue-list">' +

                    '<li class="flex-box"><div class="flex-num1">小件（0~10kg）</div><div class="change-num"><a class="reduce" data-index="0"></a>' +
                    '<input id="NumValue0" type="tel" value="1" class="num-input"><a class="increase" data-index="0"></a></div></li>' +

                    '<li class="flex-box"><div class="flex-num1">中件（10~20kg）</div><div class="change-num"><a class="reduce" data-index="1"></a>' +
                    '<input id="NumValue1" type="tel" value="1" class="num-input"><a class="increase" data-index="1"></a></div></li>' +

                    '<li class="flex-box"><div class="flex-num1">泡沫箱（不计重量）</div><div class="change-num"><a class="reduce" data-index="2"></a>' +
                    '<input id="NumValue2" type="tel" value="1" class="num-input"><a class="increase" data-index="2"></a></div></li>' +

                    '</ul>',
                    okText: '保存并打印',
                    okCallback: () => {
                        console.log(123);
                    }
                });
                $('#dialogList').delegate('.reduce', 'click', function(e) {
                    let index = e.target.dataset.index,
                        input = $('#NumValue'+index);
                    if(parseInt(input.val())>0) {
                        input.val(parseInt(input.val())-1);
                    }
                });
                $('#dialogList').delegate('.increase', 'click', function(e) {
                    let index = e.target.dataset.index,
                        input = $('#NumValue'+index);
                    input.val(parseInt(input.val())+1);
                });
                break;
        }
    }

    render() {
        return (
            <div>
                <div className="pos-tab">
                    <Tab arr={['全部', '未装车', '已装车']} default={this.state.pageState} slider={true} tabHandler={this.tabHandler.bind(this)} />
                </div>
                <div className="count-num">
                    <div className="appointment">预&nbsp;&nbsp;&nbsp;约：12个发件人，87件</div>
                    <div className="already-load">已装车：4个发件人，32件</div>
                </div>
                <div id="posWrap" className="pos-wrap">
                    <div className="scroller" onClick={this.clickHandler.bind(this)}>
                        {this.createContent()}
                    </div>
                </div>
                <div className="pos-footer">
                    结束装车
                </div>
            </div>
        );
    }
}

export default Main;