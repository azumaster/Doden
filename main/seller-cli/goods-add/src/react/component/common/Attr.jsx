/*
* xy 2017-09-12
* 生成属性的格式类型
* 格式类型(1＝文本框,2＝单选,3=多选,4=X-Y区间，5=X*Y值)
* */

class Attr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL: null,
            multiChoiceArr: []
        };
    }

    //文本框;
    textBox(){
        let data = this.props.data;
        let values = this.props.val.values || [];
        return (
            <div>
                <label><input className={data.format_values[0].unit ? 'cell-input-value' : 'cell-input-row'} type="text"
                              value={values[0] ? values[0].value : null}
                              placeholder={data.format_values[0].unit ? '' : '请输入'+ (data.attribute_name || this.props.label)}
                              onChange={this.textBoxChange.bind(this)}/>
                    {data.format_values[0].unit}
                </label>
            </div>
        );
    }

    //单选;
    singleChoose(){
        let data = this.props.data,
            singleChoiceList = '';
        let values = this.props.val.values || [];

        data.format_values.map((value)=>{
            let iconChecked = '';
            if(value.value == (values[0] ? values[0].value : '')){
                iconChecked = 'icon-checked';
            }
            singleChoiceList +=
                '<label class="cell-row single-choice-item">' +
                '<label class="cell-head cell-foot">' +
                '<span class="cell-body '+ iconChecked + '" data-operate="choose">' +
                value.value + '</span>'  + '</label>' +
                '</label>';
        });

        return(
            <div className="cell-more" onClick={this.createSingleChoice.bind(this, singleChoiceList)}>
                <label>
                    <span className="selectName">{values[0] ? values[0].value :'请选择'}</span>
                    <i className="right-arrow">
                        {null}
                    </i>
                </label>
            </div>
        );
    }

    //多选
    multiChoice(){
        let format_values = this.props.data.format_values,
            tempValue = this.props.val.values || [],
            str = [];
        this.state.multiChoiceArr = [];
        let domStr = '<div class="cells-column multi_choice_content">';
        format_values.map((v, index)=> {
            let checked = '';
            tempValue.map((value)=> {
                if (value) {
                    if (value.value == v.value) {
                        this.state.multiChoiceArr.push(v);
                        str.push(value.value);
                        checked = 'checked';
                    }
                }
            });
            domStr += '<label class="cell-row multi-checkbox" for="multiChoice_' + index + '">' +
                '<div class="cell-head cell-foot"><div>' +
                '<input id="multiChoice_' + index + '" type="checkbox" name="list" data-index="'+index+'" class="check" value="' + v.value + '" ' + checked + ' />' +
                '<i class="icon-selected"></i></div></div><div class="cell-body" style="display: block;">' + v.value + '</div></label>';
        });

        domStr += '</div><div id="inspect_report_btn" class="inspect-report-btn">保存并继续填写</div>';
        return(
            <div className="cell-more" onClick={this.createMultiList.bind(this, domStr)}>
                {str[0] ? str.join(' / ') :'请选择'}
                <i className="right-arrow">{null}</i>
            </div>
        );
    }

    //X*Y
    XY(){
        let data = this.props.data.format_values,
            values = this.props.val.values || [];
        return (
            <div>
                <label style={{whiteSpace: 'no-warp'}}>
                    <input className="cell-input-value" type="text" onChange={this.xyChange.bind(this)}
                           value={values[0] ? values[0].value : null} data-index={0} />
                    {data[0].unit}
                </label>
                <span style={{margin: '0 5px'}}>*</span>
                <label style={{whiteSpace: 'no-warp'}}>
                    <input className="cell-input-value" type="text" onChange={this.xyChange.bind(this)}
                           value={values[1] ? values[1].value : null} data-index={1} />
                    {data[1].unit}
                </label>
            </div>
        );
    }

    //X-Y
    XYRange(){
        let data = this.props.data.format_values,
            values = this.props.val.values || [];
        return (
            <div>
                <label><input className="cell-input-value" type="text" onChange={this.xyChange.bind(this)}
                              value={values[0] ? values[0].value : null} data-index={0} />
                </label>
                <span style={{margin: '0 5px'}}>-</span>
                <label>
                    <input className="cell-input-value" type="text" onChange={this.xyChange.bind(this)}
                           value={values[1] ? values[1].value : null} data-index={1} />
                    {data[1].unit}
                </label>
            </div>
        );
    }

    //单选中的滑动事件;
    createScroll(){
        var wrapper = document.getElementById('option_list'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false
            });
        this.state.SCROLL = SCROLL;
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        SCROLL.on('scrollStart', () => {
            SCROLL.refresh();
        });
    }

    //设置val并传上去;
    updateValue(v) {
        let val = this.props.val || {},
            attr = this.props.data;
        val.constraint_id = attr.attribute_id;
        val.must = this.props.label ? 1 : attr.must;
        val.name = this.props.label || attr.attribute_name;
        val.values = v;
        this.props.setData && this.props.setData(val);
    }

    //文本框改变;
    textBoxChange(e) {
        this.updateValue([{value: e.target.value, unit: this.props.data.format_values[0].unit}]);
    }

    //单选的事件处理;
    createSingleChoice(singleChoiceList){
        H.sheet.create({
            style: 1,
            title: '请选择',
            content: '<div id="option_list"><div id="single_choice_list" class="single-choice-list">' + singleChoiceList + '</div></div>',
            confirm: '关闭',
            confirmCallback: () => {
                H.sheet.hide();
            }
        });
        this.createScroll();
        $('#option_list').click((e)=>{
            let target = e.target;
            if(target.nodeName != 'SPAN'){
                return;
            }
            let option_list = $('#option_list'),
                text = '';
            option_list.find('span').removeClass('icon-checked');
            $(target).addClass('icon-checked');
            text = option_list.find('.icon-checked').html();
            this.updateValue([{value: text, unit: ''}]);
            H.sheet.hide();
            this.state.SCROLL.destroy();
        });
    }

    //xy or x-y handler
    xyChange(e) {
        let i = e.target.dataset.index,
            val = this.props.val.values ? this.props.val.values : [];
        console.log(val);
        val[i] = {value: e.target.value, unit: this.props.data.format_values[i].unit};
        this.updateValue(val);
    }

    //多选事件;
    createMultiList(domStr){
        let that = this,
            wrap = $('#multi_choice_wrap'),
            format_values = this.props.data.format_values,
            multiChoiceArr = this.state.multiChoiceArr;
        wrap.html(domStr);
        wrap.addClass('show');
        window.location.href = '#pop';
        $('.multi_choice_wrap .check').change(function(e) {
            let length = 0;
            for(let i = 0 ; i < multiChoiceArr.length ; i++) {
                if(multiChoiceArr[i].value == format_values[e.target.dataset.index].value) {
                    multiChoiceArr.splice(i, 1);
                    length = 1;
                }
            }
            if(length == 0) {
                multiChoiceArr.push(format_values[e.target.dataset.index]);
            }
        });
        $('#inspect_report_btn').bind('click', function() {
            let arr = [];
            for(let i = 0 ; i < multiChoiceArr.length ; i++) {
                arr.push({
                    value: multiChoiceArr[i].value,
                    unit: multiChoiceArr[i].unit
                });
            }
            that.updateValue(arr);
            that.closeMultiList();
        });
    }

    //关闭;
    closeMultiList() {
        $('#multi_choice_wrap').removeClass('show');
        window.history.back();
    }

    render() {
        let data = this.props.data,
            xml = null;
        if(!data) return null;
        switch (data.format_type_id) {
            case 1:
                xml = this.textBox();
                break;
            case 2:
                xml = this.singleChoose();
                break;
            case 3:
                xml = this.multiChoice();
                break;
            case 4:
                xml = this.XYRange();
                break;
            case 5:
                xml = this.XY();
                break;
        }
        return (
            <div className="cell-row input-line">
                <div className="cell-head">{data.attribute_name || this.props.label}</div>
                <div className="cell-body" style={{textAlign: 'right'}}>
                    {xml}
                </div>
            </div>
        );
    }
}

export default Attr;