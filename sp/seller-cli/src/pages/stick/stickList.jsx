/**
 * Created by Doden on 2017.06.20
 */


class StickList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stickList: []
        };
    }

    componentWillMount(){
        this.getData();
    }

    componentDidMount(){
        this.createScroll();
    }

    createScroll(){
        let SCROLL = new IScroll('#stickList', {
            zoom: true,
            scrollX: false,  //是不中可以横向滚动;
            scrollY: true,  //是否可以纵向滚动;
            mouseWheel: true, //是否监听鼠标滚轮;
            wheelAction: 'zoom',
            probeType: 2,
            preventDefault: false
        });

        SCROLL.on('beforeScrollStart', () => {
            SCROLL.refresh();
        });
    }

    getData(){
        $.loading.show();

        $.req.getStickList({sort_id: this.props.params.id}, (res)=>{
            if(res.code==0){
                this.setState({
                    stickList: res.data
                });
            }else{
                $.toast({text:res.message, icon: 'info'});
            }
            $.loading.hide();
        });
    }

    createStickList(){
        let stickList = [],
            brandList = [],
            st = [],
            normal = [],
            icon = ['one', 'two', 'three', 'four', 'five'],
            list = this.state.stickList;

        if(list.length>0){
            list.map((stick, index)=>{

                brandList = [];
                st = $.objToArr(stick.brands.stick);
                normal = $.objToArr(stick.brands.normal);
                st.map((brand, i)=>{
                    brandList.push(<div className={'brand-item'+(i==0?' active':'')}><p>{brand.brand_name}</p><i className={'icon '+icon[i]}></i></div>);
                });

                stickList.push(<div key={index} className="stick-item">
                    <div className="stick-title">
                        <p>{stick.sort_name}</p>
                        {(stick.brands.normal.length<=0&&stick.brands.stick.length<=0)?null:<button className="btn btn-market" data-id={stick.sort_id} onClick={this.toStick.bind(this)}>设置置顶品牌</button>}

                    </div>
                    {st.length>0?<div className="stick-body">
                        <div className="stick-body-name">已置顶品牌</div>
                        <div className="stick-body-list">
                            {brandList}
                        </div>
                    </div>:(normal.length>0?<div className="stick-body">
                        <div className="stick-notice no"><i className="icon no-stick"></i>没有已置顶品牌</div>
                    </div>:<div className="stick-body">
                        <div className="stick-notice black"><i className="icon black-stick"></i>您屏蔽了该分类的所有品牌</div>
                    </div>)}

                </div>);
            });
        }else{
            stickList.push(<div className="stick-no">
                <p className="stick-no-word">无可置顶分类</p>
                <button type="button" className="btn btn-ok btn-full" onClick={this.back.bind(this)}>返回</button>
            </div>);
        }

        return stickList;
    }

    back(){
        window.history.back();
    }

    toStick(e){
        let sortId = e.target.dataset.id,
            id = this.props.params.id;
        window.location.href = '#/seller/stick/'+id+'/'+sortId;
    }

    render() {
        return (<div id="stickList" className="stick-list">
            <div id="scroll">
                {this.createStickList()}
            </div>
        </div>);
    }
}

export default StickList;