/*
** 商品全部评论
 */
class Comments extends React.Component {
    constructor (props) {
    super(props);
    this.state = {
        comments: [],     //评价数据列表;
        data: {
            diffGrade: {},
            total: 0
        },
        param: {
            good_id: this.props.goodsId,
            page_size: 10,   //每页数量;
            page_num: 1,    //页码
            type: this.props.status         //评价类型状态; 1->好评；2->中评;3->差评；4->所以评价；5->有图评价
        },
        loaded: true,     //当前这页的数据是否加载完成。加载完成之后才允许加载下一页
        SCROLL: null
    };
    }

    componentWillMount () {
        H.we_loading.show();
        this.getData();
    }

    componentDidMount () {
        this.scrollCreator();
    }

    componentDidUpdate(){
        this.state.SCROLL.refresh();
    }

    //获取评价;
    getData() {
        this.state.loaded = false;
        H.server.getAppraiseGoods(this.state.param, (res) => {
            this.state.loaded = true;
            H.we_loading.hide();
            if (res.code == 0) {
                this.setState({
                    data: res.data,
                    comments: this.state.comments.concat(res.data.data)
                });
            } else {
                H.operationState(res.message);
            }
        });
    }

    scrollCreator () {
    // 创建iscroll实例
    var wrapper = document.getElementById('comments-tab-contents'),
        SCROLL = new IScroll(wrapper, {
        zoom: true,
        scrollX: false,  //是不中可以横向滚动;
        scrollY: true,  //是否可以纵向滚动;
        mouseWheel: true, //是否监听鼠标滚轮;
        wheelAction: 'zoom',
        probeType: 2,
        click: true
        });
        this.setState({SCROLL: SCROLL});
        SCROLL.on('scroll', () => {
            if(this.state.comments.length >= this.state.data.total || this.state.loaded == false) return;
            if(SCROLL.y < SCROLL.maxScrollY - 50){
                if((SCROLL.y - SCROLL.maxScrollY ) < 300) {
                    if(!this.state.isLoading){
                        this.state.param.page_num++;
                        this.getData();
                    }
                }
            }
        });
        SCROLL.on('scrollStart', () => {
            SCROLL.refresh();
        });
        this.state.SCROLL = SCROLL;
    }

    //点赞;
    praise(id, type, i) {
        let param = {appraise_id: id, type: type},
            list = this.state.comments;
        H.server.appraisePraise(param, (res) =>　{
            if(res.code == 0) {
                if(type == 1) {
                    list[i].praise = [{}];
                    list[i].praises_num++;
                }else {
                    list[i].praise = [];
                    list[i].praises_num--;
                }
                this.setState({comments: list});
            }else {
                H.operationState(res.message);
            }
        });
    }

    //tab切换;
    tabHandle(status) {
        let param = this.state.param;
        param.type = status;
        param.page_num = 1;
        this.setState({param: param, comments: []}, () => {
            H.we_loading.show();
            this.getData();
        });
    }

    createList () {
        let dom = [],
            list = this.state.comments;
        for (let i = 0 ; i < list.length ; i++) {
            dom.push(
                <div className="comment-content-item">
                    <div className="user-info">
                      <div className="avatar">
                        <img src={list[i].buyer.unionPic} alt=""/>
                      </div>
                      <div className="username">{list[i].buyer.unionName}{i}</div>
                    </div>
                    <div className="comment-content-item-content">
                        {list[i].content}
                    </div>
                    <div className="images">
                        {
                            list[i].appraise_img.map((val, index) => {
                                return (
                                    <div key={index} className="image"><img src={H.localhost + val.img_url + H.imgSize()[640]}/></div>
                                );
                            })
                        }
                    </div>
                    <div className="bottom-bar">
                      <div className="date-time">
                          {list[i].created_at}
                      </div>
                      <div className={list[i].praise.length > 0 ? 'like active' : 'like'}
                           onClick={this.praise.bind(this, list[i].id, list[i].praise.length > 0 ? 2 : 1, i)}>
                        <div className="like-text">{list[i].praises_num < 100 ? list[i].praises_num : '99+'}</div>
                        <img className="like-off" src="data:image/png;base64,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" alt=""/>
                        <img className="like-on" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAADpElEQVR42u1dPW8TQRDNDwDEDwCRFgkBHYiGdJQgQYEECBdUNAlScvbt2trUUOAuggLcINHhloa4piG/ID8gCFHEX1QwBwKdjX3xfeztu733pK2wxOy8m5l3s3ObtTWCIAiCIAiCIAgP8N2YsyOtb0+UMlOlPoy13v/R6fxctKJ/m2j9NvrtJAxvlm2r/P/Xx+325lip50Ol3i2zc6j1e9nLa/ndM/ndrW/GnIEnQYzdFOd+WbapVVdEopDz2BoJrdbdcRju5bVT9vtRyHkCRc6k3d6InvC8m1u2fkeOMeu5STDmnNjZtmWnkNOVaLvhjIjhzs7VpFRU9Jpq/TKKwrR2fg2C05I+X5Rl5+hPij5famqKnFPWBv+LmBSpbNjpNFzZKSkxsJ7KoqgookYUUWOSouXImFPylO65tlPS+eBYqUt2aoVSDdcbnFNnh8Nm88q8ncdBcFFS1CcwWx8Uq0pEPSFtcEaObm9fjqmna6h2ykPytJjIsKigCnsCm837krPvwdup9au8L01b6Jus2pJs89CLmuEVKa3Wo9Rqio6zXPsWCJKl7xkI0tb3JRno86qtkF06rLT3lE4yGcas01Elk6L1hSSJ26OTSifkDaOjClHC6ACKkkhZ0TFu10yzlC+BEDK4EU9XfTrFedrq/yOEDsFYbJOgtVOEC3Z0sdrzW2yVYLVSdiNCBnQGDCEDEkJCuBIJoSPApC+dAPVyeMCUxRrClUwI2+5IKavHF0O0F8NRGN6hM0DGTYULHk4hHlJFcosOAZC8fzFVqkunOP/mpcvRUbSzkDjoFJB0xUEHsAEHRgnIWTo/0AGPjthIECWwy9qx6GYGOqu0VskGvxFB6lulvMOEbXmbbfYsV2iwntipG1nubOE3I7YIyXuzEdsqFtsjJMUDMkgKIBnxmsJCn66AF3Eb3snqi5J4JWmbWU1lvCWI0ypJ0yMuwGbkkm88XIJTK3NTIwigArOopHIV+xoqsFytkJJI6deIjD4sGXVTYDNjO1WAz0MTJx67wpLi4enjyqd8qPBJgcEpqboqMGgllZOUXhXbIN6REUeVBrtTDyJUFVVQYJVVUj4We2+Kd8a/R3KAVLxrSwaaAvNSSVW13eLsQAkdLg68nB8oUYHVWEkhK7DaF+/UkWJp5KiU0RyvFViBI0eVOVCqgwKjkgIq9izelpBl5AhmNIcKjEoKpt3CNog7Uvq1O1CCL/axL4Zrc6BEEARBEARBEARRIH4BgFv1QBIOhVQAAAAASUVORK5CYII=" alt=""/>
                      </div>
                    </div>

                </div>
          );
        }
        return dom;
    }

    render () {
    return (
      <div className="comments">
        <div className="comments-tab">
          <div className={this.state.param.type == 1 ? 'comments-tab-item active' : 'comments-tab-item'}
               onClick={this.tabHandle.bind(this, 1)}>好评({this.state.data.diffGrade.goodCount})</div>
          <div className={this.state.param.type == 2 ? 'comments-tab-item active' : 'comments-tab-item'}
               onClick={this.tabHandle.bind(this, 2)}>中评({this.state.data.diffGrade.mediumCount})</div>
          <div className={this.state.param.type == 3 ? 'comments-tab-item active' : 'comments-tab-item'}
               onClick={this.tabHandle.bind(this, 3)}>差评({this.state.data.diffGrade.poorCount})</div>
          <div className={this.state.param.type == 5 ? 'comments-tab-item active' : 'comments-tab-item'}
               onClick={this.tabHandle.bind(this, 5)}>有图({this.state.data.diffGrade.imgCount})</div>
        </div>
        <div className="comments-tab-content-box" id="comments-tab-contents">
          <div className="scroller">
            {this.createList()}
          </div>
        </div>
      </div>
    );
    }
}

export default Comments;
