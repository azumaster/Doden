import Input from './input.jsx';
/*
* format_values: [] //为了型号和规格
* titles： []
* placeholders: []
*
* cellStyle：[]  //一行的样式
* format_type_id: [] 根据id转换样式
* */

class InputArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            select: 0,
            submitData: {},
            editList: {},
            multiList: [], //多选列表
            choiceList: [{}, {}, {}, {}, {}, {}],
            multi: {},
            list: []
        };
    };

    static defaultProps = {
        type: ['types', 'specs'],
        format_values: []
    };

    componentWillMount(){
        this.deleteKey(this.props);
    }

    componentDidMount(){
        this.submit();
    }

    componentWillReceiveProps(nextProps) {
        this.deleteKey(nextProps);
        this.state.list = [];
    }


    deleteKey(nextProps){
        nextProps.format_values.map((format_value)=>{
            format_value.map((obj)=>{
                delete obj.rule;
                delete obj.default;
            });
        });
    }

    createCells(){
        let props = this.props,
            titles = props.titles,
            placeholders = props.placeholders,
            para = props.para,
            cellStyle = props.cellStyle,
            inputArea = [],
            value = props.value,
            format = '';
        let foot = (
            <div className="price-foot">
            </div>
        );
        if(this.props.submit == 'basic_attributes'){
            format = ['', '', 'true', 'true', ''];
        }
        titles.map((title, index)=>{
            if(title == '价格') {
                inputArea.push(
                    <div className="cell-row input-line signal 0">
                        <div className="cell-head">价格</div>
                        <div className="cell-body">
                            <input className="cell-input" data-para="goods_price" placeholder="请输入平台价" type="text" style={value[index] ? {display: 'none'}: null}  />
                        </div>
                        <div className="cell-foot">
                            <div className="price-foot">{value[index] ? value[index] : null}</div>
                        </div>
                    </div>
                );
            } else {
                inputArea.push(
                    <Input style={title == '价格' ? 'input-line signal 0'  :'input-line'} title={title} placeholder={ placeholders ? placeholders[index] : null} value={value?value[index]:null}
                           cellStyle={cellStyle ? cellStyle[index]: null} para={para?para[index]:null} index={index} format={format?format[index]:null} >
                        {this.props.special ? (this.switchFoot(index)) : (index < 2 ? this.switchFoot(index) : null)}
                        {title == '清真' ? this.createSwitch() : null}
                        {title == '价格' ? foot : null}
                    </Input>
                );
            }
        });
        return inputArea;
    }

    //清真
    createSwitch() {
        if(!this.props.basic.goods_id){
            return;
        }
        return (
            <input className="switch" type="checkbox" data-para="halal" defaultChecked={this.props.basic.halal}/>
        );
    }

    textBox(index, value){
        let format_values = this.props.format_values[index],
            type = this.props.type;
        if(value[0]){
            format_values = value;
        }
        return (
            <div key={Math.random()}>
                <label><input className={format_values[0].unit ? 'cell-input-value' : 'cell-input'} type="text" data-operate="value" data-para="0"
                              data-type={type[index]+''}
                              placeholder={format_values[0].unit ? '' : '请输入'+this.props.titles[index]}
                              onChange={this.updateValue.bind(this)} defaultValue={format_values[0].value ? format_values[0].value : null} />
                    {format_values[0] ? format_values[0].unit : null}
                </label>
            </div>
        );
    }

    singleChoice(index, value){
        let format_values = this.props.format_values[index],
            singleChoiceList = '',
            type = this.props.type;

        format_values.map((format_value, index2)=>{
            let iconChecked = '';
            if(value[0]) {
                if(format_value.value == value[0].value) {
                    iconChecked = 'icon-checked';
                }
            }

            singleChoiceList +=
                '<label class="cell-row single-choice-item">' +
                     '<label class="cell-head cell-foot" data-index=' + index + '>' +
                            '<span class="cell-body ' +iconChecked+ '" data-operate="choice" data-para='+ index2 + ' data-type=' + type[index] + '>' +
                        format_value.value + '</span>'  + '</label>' +
                '</label>';
        });

        return(
            <div className="cell-more" onClick={this.createSingleChoice.bind(this, singleChoiceList)}>
                <label>
                    <span className="selectName">{value[0] ? value[0].value : '请选择'}</span>
                    <i className="right-arrow">
                        {null}
                    </i>
                </label>
            </div>
        );
    }

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
    }

    createSingleChoice(singleChoiceList){
        H.sheet.create({
            style: 1,
            title: '请选择',
            content: '<div id="option_list"><div id="single_choice_list">' + singleChoiceList + '</div></div>',
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
            let option_list = $('#option_list');
            option_list.find('span').removeClass('icon-checked');
            $(target).addClass('icon-checked');
            H.sheet.hide();
            this.updateValue(e);
            this.state.SCROLL.destroy();
        });
    }

    //多选
    multiChoice(index, value){
        let format_values = this.props.format_values[index],
            //multiChoiceList = [],
            type = this.props.type,
            tempValue = $.extend(true, [], value),
            str = [];
        let domStr = '<div class="cells-column multi_choice_content">';
        format_values.map((format_value, index1)=>{
            let checked = '';
            tempValue.map((obj, index2)=>{
                if(obj.value == format_value.value){
                    checked = 'checked';
                    str.push(obj.value);
                    this.state.choiceList[index][index1] = 'true';
                    tempValue.splice(index2, 1);
                }
            });
            domStr += '<label class="cell-row multi-checkbox" for="'+this.props.constraint_id[index] + '_' + index1+'">' +
                '<div class="cell-head cell-foot" data-index="'+index+'"><div>'+
                '<input id="'+this.props.constraint_id[index] + '_' + index1+'" type="checkbox" name="list" class="check" data-operate="choice" id="" data-type="'+type[index]+'" data-para="'+index1+'" ' +
                'value="'+format_value.value+'" '+checked+' data-value="'+format_value.value+'" />' +
                '<i class="icon-selected"></i></div></div><div class="cell-body" style="display: block;">'+format_value.value+'</div></label>';

        });
        domStr += '</div><div id="inspect_report_btn" class="inspect-report-btn">保存并继续填写</div>';
        return(
            <div className="cell-more" onClick={this.createMultiList.bind(this, domStr)}>
                {value[0] ? str.join(' / ') : '请选择'}
                <i className="right-arrow">{null}</i>
            </div>
        );
    }

    createMultiList(domStr, e){
        e.stopPropagation();
        let target = e.target,
            dataset = target.dataset,
            index = $(target).parents('.cell-foot').data('index'),
            type = dataset.type,
            that = this,
            wrap = $('#multi_choice_wrap');
        this.state.multi['type'] = type;
        this.state.multi['index'] = index;
        wrap.html(domStr);
        wrap.addClass('show');
        window.location.href = '#pop';
        $('.multi_choice_wrap .check').change(function() {
            that.updateChoice(this);
        });
        $('#inspect_report_btn').bind('click', function() {
            that.confirm();
            that.props.setModifyState && that.props.setModifyState(2);
        });
    }

    closeMultiList(){
        $('.multi_choice_wrap').removeClass('show');
        window.history.back();
    }

    //确认
    confirm(){
        let submitData = this.state.submitData,
            constraint_id = this.props.constraint_id,
            titles = this.props.titles,
            editList = this.state.editList,
            multi = this.state.multi,
            format_type_id = this.props.format_type_id;
        if(multi.type || !multi.type){
            if(this.props.submit == 'special_attributes'){
                let temp = {
                    constraint_id: constraint_id[multi.index],
                    must: false,
                    name: titles[multi.index],
                    values: [],
                    format_type_id: format_type_id[multi.index]
                };
                if(!editList[multi.index]){
                    editList[multi.index] = 'true';
                }
                for(let key in  this.state.choiceList[this.state.multi.index]){
                    temp['values'].push(this.props.format_values[multi.index][key]);
                }
                submitData[multi.index] = temp;
                this.setState();
                this.closeMultiList();
                return;
            }
            switch(multi.type){
                case 'specs':
                    submitData[multi.type] = {
                        constraint_id: constraint_id[multi.index],
                        must: true,
                        name: '规格',
                        format_type_id: format_type_id[multi.index]
                    };
                    for(let key in  this.state.choiceList[this.state.multi.index]){
                        if(!submitData[multi.type]['values']){
                            submitData[multi.type]['values'] = [];
                            submitData[multi.type]['values'].push(this.props.format_values[multi.index][key]);
                        }else {
                            submitData[multi.type]['values'].push(this.props.format_values[multi.index][key]);
                        }
                    }
                    break;
                case 'types':
                    submitData[multi.type] = {
                        constraint_id: constraint_id[multi.index],
                        must: true,
                        name: '型号',
                        format_type_id: format_type_id[multi.index]
                    };
                    for(let key in  this.state.choiceList[this.state.multi.index]){
                        if(!submitData[multi.type]['values']){
                            submitData[multi.type]['values'] = [];
                            submitData[multi.type]['values'].push(this.props.format_values[multi.index][key]);
                        }else {
                            submitData[multi.type]['values'].push(this.props.format_values[multi.index][key]);
                        }

                    }
                    break;
            }
            this.setState();
            this.closeMultiList();
        }
    }

    XY(index, value){
        let format_values = this.props.format_values[index],
            type = this.props.type;
        if(value[0]){
            format_values = value;
        }
        return (
            <div key={Math.random()}>
                <label><input className="cell-input-value" type="text" data-operate="value" data-para="0" data-type={type[index]}
                              onChange={this.updateValue.bind(this)} defaultValue={format_values[0] ? format_values[0].value : null} />
                    {format_values[0] ? format_values[0].unit : null}
                </label>
                <span style={{margin: '0 5px'}}>*</span>
                <label>
                    <input className="cell-input-value" type="text" data-operate="value" data-para="1" data-type={type[index]}
                           onChange={this.updateValue.bind(this)} defaultValue={format_values[1] ? format_values[1].value : null} />
                    {format_values[1].unit ? format_values[1].unit : null}
                </label>
            </div>
        );
    }

    XYRange(index, value){
        let format_values = this.props.format_values[index],
            type = this.props.type;
        if(value[0]){
            format_values = value;
        }
        return (
            <div key={Math.random()}>
                <label ><input className="cell-input-value" type="text" data-operate="value" data-para="0" data-type={type[index]}
                              onChange={this.updateValue.bind(this)} defaultValue={format_values[0] ? format_values[0].value : null} />
                </label>
                <span style={{margin: '0 5px'}}>-</span>
                <label>
                    <input className="cell-input-value" type="text" data-operate="value" data-para="1" data-type={type[index]}
                           onChange={this.updateValue.bind(this)} defaultValue={format_values[1] ? format_values[1].value : null} />
                    {format_values[1].unit ? format_values[1].unit : null}
                </label>
            </div>
        );
    }

    switchFoot(index){
        if(!this.props.format_type_id){
            return;
        }

        let xml = '',
            values = [],
            format_type_id = this.props.format_type_id,
            constraint_id = this.props.constraint_id,
            parent = this.props.parent[this.props.submit],
            len = 0;

        if(this.props.submit == 'basic_attributes') {  //基本属性;
            if(index == 0){
                if(constraint_id[0] == parent.types.constraint_id) {
                    if(format_type_id[0] == parent.types.format_type_id) {
                        values = parent.types.values;
                    }
                }
            }else {
                if(constraint_id[1] == parent.specs.constraint_id) {
                    if(format_type_id[1] == parent.specs.format_type_id) {
                        values = parent.specs.values;
                    }
                }
            }

        }else {
            for(let k = 0 ; k < parent.length ; k++) {
                if(parent[k] && constraint_id[index] == parent[k].constraint_id) {
                    if (format_type_id[index] == parent[k].format_type_id) {
                        values = parent[k].values;
                        this.state.list[k] = true;
                        break;
                    }
                }
            }
            if(constraint_id.length == (index+1)){
                parent.map((format_value, index1)=>{
                    if(!this.state.list[index1]){
                        delete parent[index1];
                    }
                });
                len = parent.length;
                if(constraint_id.length >= len) {
                    for(let i=0; i<len; i++){
                        if(!parent[i]){
                            parent.splice(i, 1);
                        }
                    }
                }
            }
        }

        switch (this.props.format_type_id[index]){
            case 1:
              xml = this.textBox(index, values);
              break;
            case 2:
              xml = this.singleChoice(index, values);
              break;
            case 3:
              xml = this.multiChoice(index, values);
              break;
            case 4:
              xml = this.XYRange(index, values);
              break;
            case 5:
              xml = this.XY(index, values);
              break;
            default: return null;
        }
        return xml;
    }

    updateValue(e){
        this.props.setModifyState && this.props.setModifyState(2);
        let target = e.target,
            dataset = target.dataset,
            operate = dataset.operate,
            para = dataset.para,
            type = dataset.type,
            index = $(target).parents('.cell-foot').data('index'),
            submitData = this.state.submitData,
            constraint_id = this.props.constraint_id,
            titles = this.props.titles,
            format_type_id = this.props.format_type_id;
        if(type || this.props.submit == 'special_attributes'){
            if(this.props.submit == 'special_attributes'){
                let temp = {
                    constraint_id: constraint_id[index],
                    must: false,
                    name: titles[index],
                    values: [],
                    format_type_id: format_type_id[index]
                };
                if(operate == 'choice'){
                    temp['values'][0] = this.props.format_values[index][para];
                    submitData[index] = temp;
                    this.setState();
                    return;
                }
                this.props.format_values[index][para][operate] = target.value || target.dataset.value;
                temp['values'] = this.props.format_values[index];
                submitData[index] = temp;
                return;
            }
            switch(type){
                case 'specs':
                    submitData[type] = {
                        constraint_id: constraint_id[index],
                        must: true,
                        name: '规格',
                        values: [],
                        format_type_id: format_type_id[index]
                    };
                    if(operate == 'choice'){
                        submitData[type]['values'][0] = this.props.format_values[index][para];
                        this.setState();
                        return;
                    }else {
                        this.props.format_values[index][para][operate] = target.value || target.dataset.value;
                    }
                    submitData[type]['values'] = this.props.format_values[index];
                    break;
                case 'types':
                    submitData[type] = {
                        constraint_id: constraint_id[index],
                        must: true,
                        name: '型号',
                        values: [],
                        format_type_id: format_type_id[index]
                    };
                    if(operate == 'choice'){
                        submitData[type]['values'][0] = (this.props.format_values[index][para]);
                        this.setState();
                        return;
                    }else {
                        this.props.format_values[index][para][operate] = target.value || target.dataset.value;
                    }
                    submitData[type]['values'] = this.props.format_values[index];
                    break;
            }
            return;
        }
        if(target.value == 'on'){
            this.props.basic[para] = target.checked;
            return;
        }
        if(this.props.submit == 'basic_infos'){
            this.props.basic[para] = target.value;
            return;
        }
        submitData[para] = target.value;
    }

    updateChoice(node){
        let target = node,
            dataset = target.dataset,
            para = dataset.para,
            index = $(target).parents('.cell-foot').data('index'),
            type = dataset.type;
        this.state.multi['type'] = type;
        this.state.multi['index'] = index;
        if(!this.state.choiceList[index][para]){
            this.state.choiceList[index][para] = 'true';
        }else {
            delete this.state.choiceList[index][para];
        }
    }

    //提交
    submit(){
        let props = this.props,
            submit = props.submit,
            parent = props.parent;
        switch(submit){
            case 'basic_infos':
                this.state.submitData = parent[submit];
                this.state.submitData = {'halal': false};
                break;
            case 'basic_attributes':
                this.state.submitData = parent[submit];
                break;
            case 'special_attributes':
                this.state.submitData = parent[submit];
                break;
        }
    }

    render() {
        return (
            <div className={'cells-column' + this.props.style ? this.props.style : null} onChange={this.updateValue.bind(this)}>
                {this.createCells()}
            </div>
        );
    }

}
export default InputArea;