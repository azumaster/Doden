/*
* 第四级分类筛选;
* */
//import Promise from 'es6-promise';

class TypesFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            typesData: this.props.typesData,             //当前三级分类下面的所有四级分类;
            typesId: this.props.typesId                //当前被选中的四级分类ID;
        };
        this.createTypes = this.createTypes.bind(this);
        this.createScroll = this.createScroll.bind(this);
    }

    componentDidMount() {
        this.createScroll();
    }

    componentDidUpdate(){
        this.state.SCROLL.refresh();
    }

    createScroll(){
        var wrapper = document.getElementById('typeFilterList'),
            SCROLL = new IScroll(wrapper, {
                scrollX: true, scrollY: false, preventDefault: false
            });

        this.state.SCROLL = SCROLL;
    }



    //创建第四级分类的筛选;
    createTypes() {
        let typesData = this.props.typesData;
        if(typesData) {
            let xml = typesData.map((val) => {
                if(val.series != 4) return null;
                return (
                    <li className={val.id == this.props.typesId ? 'active' : null} data-id={val.id}>{val.sort_name}</li>
                );
            });
            return xml;
        }else {
            return null;
        }
    }

    //筛选第4级分类;
    optionType(e) {
        let typeId = e.target.dataset.id,
            defaultParam = this.props.defaultParam;
        if(defaultParam.type_ids[0] == typeId) return;
        this.props.typesId = typeId;
        //筛选了第4级分类之后重新请求对应分类下面的商品;
        this.props.refresh && this.props.refresh(typeId);
    }

    render() {
        return (
            <div className="typeFilter-container">
                <div className="label">分类</div>
                <div className="flex-num1 type-filter-wrap">
                    <div id="typeFilterList" className="type-filter-list">
                        <div className="scroller">
                            <ul className="flex-box" onClick={this.optionType.bind(this)}>
                                {this.createTypes()}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TypesFilter;