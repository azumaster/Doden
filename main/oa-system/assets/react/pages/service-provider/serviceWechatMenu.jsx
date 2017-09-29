/**
 * Created by Doden on 2017.03.16
 */

import React from 'react';

class ServiceWechatMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: {},
            menuType: {},
            tags: []
        };
    }

    componentWillMount(){
        this.getData();
    }

    getData(){
        new Promise((resolve)=>{
            H.server.wechat_menu_list({source: this.props.source}, (res)=>{
                if(res.code == 0) {
                    this.setState({
                        menu: res.data
                    }, ()=>{resolve('ok');});
                }else if(res.code == 10106) {
                    H.overdue();
                }else{
                    H.Modal(res.message);
                }
            });
        }).then(()=>{
            H.server.wechat_tag_list({source: this.props.source}, (res)=>{
                if(res.code == 0) {
                    this.setState({
                        tags: res.data.tags
                    });
                }else if(res.code == 10106) {
                    H.overdue();
                }else{
                    H.Modal(res.message);
                }
            });
        }).then(()=>{
            H.server.get_menu_type({}, (res)=>{
                if(res.code == 0) {
                    this.setState({
                        menuType: res.data
                    });
                }else if(res.code == 10106) {
                    H.overdue();
                }else{
                    H.Modal(res.message);
                }
            });
        });

    }

    createDesInfo(){
        let mainMenu = this.state.menu.menu;

        if(!mainMenu){
            return null;
        }

        return(<div className="section-table" style={{marginTop: '20px'}}>
            <div className="main-menu">
                <h4>----- 主菜单 -----</h4>
                {this.createMainMenu()}
            </div>
            <div className="main-menu">
                <h4>----- 个性化菜单 -----</h4>
                <p style={{color:'red'}}>每个用户组的第一条菜单数据有效，其余条数为历史条数。</p>
                {this.createConditionalMenu()}
            </div>
        </div>);
    }

    // 编辑主菜单
    createMainMenu(){
        let menu = this.state.menu.menu,
            menuType = this.state.menuType,
            xml = [],
            options = [],
            menuXML = [];

        menu.button.map((b, i)=>{
            let subMenu = [];
            menuXML = [];

            options = [];

            for(let key in menuType){
                if(b.type){
                    if(b.type == key){
                        options.push(<option key={key+'_'+i} selected value={key}>{menuType[key].type_name+'['+key+']'}</option>);
                    }else{
                        options.push(<option key={key+'_'+i} value={key}>{menuType[key].type_name+'['+key+']'}</option>);
                    }
                }
            }

            if(b.sub_button && b.sub_button.length>0){
                let sOptions = [];

                b.sub_button.map((s, j)=>{

                    sOptions = [];

                    for(let key in menuType){
                        if(s.type){
                            if(s.type == key){
                                sOptions.push(<option key={key+'_'+i+'_'+j} selected value={key}>{menuType[key].type_name+'['+key+']'}</option>);
                            }else{
                                sOptions.push(<option key={key+'_'+i+'_'+j} value={key}>{menuType[key].type_name+'['+key+']'}</option>);
                            }
                        }
                    }

                    subMenu.push(<form key={'menu_'+i+'_'+j} className={'form-inline sub-form-'+i}>
                        <div className="from-group menu-group row">
                            <div className="col-lg-2"></div>
                            <div className="input-group col-lg-2">
                                <div className="input-group-addon">Name</div>
                                <input type="text" className="form-control sub_name" id={'sub_name_'+j} defaultValue={s.name}/>
                            </div>
                            <div className="input-group col-lg-3">
                                <div className="input-group-addon">TYPE</div>
                                <select className="form-control sub_type" id={'sub_type_'+j}>{sOptions}</select>
                            </div>
                            <div className="input-group col-lg-4">
                                <div className="input-group-addon">URL/KEY</div>
                                <input type="text" className="form-control sub_key" id={'sub_key_'+j} defaultValue={s.key?s.key:s.url}/>
                            </div>
                        </div>
                    </form>);
                });
            }

            menuXML.push(<form key={'menu_'+i} className="form-inline main-menu">
                <div className="from-group menu-group row">
                    <div className="input-group col-lg-2">
                        <div className="input-group-addon">Name</div>
                        <input type="text" className="form-control" id={'menu_name_'+i} defaultValue={b.name}/>
                    </div>
                    <div className="input-group col-lg-4">
                        <div className="input-group-addon">TYPE</div>
                        <select className="form-control" id={'menu_type_'+i}>{options}</select>
                    </div>
                    <div className="input-group col-lg-5">
                        <div className="input-group-addon">URL/KEY</div>
                        <input type="text" className="form-control" id={'menu_key_'+i} defaultValue={b.key?b.key:b.url}/>
                    </div>
                    <div className="input-group col-lg-1">
                        <button type="button" data-index={i} className="btn btn-sm btn-orange" onClick={this.addNewMainSub.bind(this)}>新增二级</button>
                    </div>
                </div>
            </form>);

            xml.push(<div id={'mainMenu'+i} key={'mainMenu'+i} className="mainMenu">
                {menuXML}
                {subMenu}
            </div>);
        });

        return (<div id="mainMenu">
            <div style={{margin:'10px 50px', overflow:'hidden'}}>
                <a href="javascript:;" className="pull-right" data-id={menu.menuid} onClick={this.delMenu.bind(this)}>删除</a>
                <a href="javascript:;" className="pull-right" onClick={this.saveMenu.bind(this)}
                   style={{marginRight:'10px'}}>保存</a>
                <a href="javascript:;" className="pull-right" onClick={this.addOneMain.bind(this)}
                   style={{marginRight:'10px'}}>新增一级</a>
            </div>
            {xml}
        </div>);
    }

    // 新增二级主菜单
    addNewMainSub(e){
        let menuType = this.state.menuType,
            index = e.target?e.target.dataset.index:e.dataset.index,
            options = '',
            form = document.createElement('form');

        for(let key in menuType){
            options += '<option value="'+key+'">'+menuType[key].type_name+'['+key+']</option>';
        }

        form.className = 'form-inline sub-form-'+index;
        form.innerHTML = '<div class="from-group menu-group row">' +
            '<div class="col-lg-2"></div>' +
            '<div class="input-group col-lg-2">' +
            '<div class="input-group-addon">Name</div>' +
            '<input type="text" class="form-control sub_name"/></div>' +
            '<div class="input-group col-lg-3"><div class="input-group-addon">TYPE</div>' +
            '<select class="form-control sub_type">'+options+'</select></div>' +
            '<div class="input-group col-lg-4">' +
            '<div class="input-group-addon">URL/KEY</div>' +
            '<input type="text" class="form-control sub_key" />' +
            '</div></div>';

        document.getElementById('mainMenu'+index).appendChild(form);
        $('#mainMenu'+index).find('#menu_type_'+index).html(' ');
        $('#mainMenu'+index).find('#menu_key_'+index).val(' ');
    }

    // 新增一级主菜单
    addOneMain(){
        let menuType = this.state.menuType,
            index = $('#mainMenu').find('.main-menu').length,
            options = '',
            form = document.createElement('div');

        for(let key in menuType){
            options += '<option value="'+key+'">'+menuType[key].type_name+'['+key+']</option>';
        }

        form.className = 'mainMenu';
        form.id = 'mainMenu'+index;

        form.innerHTML = '<form class="form-inline main-menu">' +
            '<div class="from-group menu-group row">' +
                '<div class="input-group col-lg-2">' +
                    '<div class="input-group-addon">Name</div>' +
                    '<input type="text" class="form-control" id="menu_name_'+index+'"/></div>' +
                '<div class="input-group col-lg-4"> ' +
                    '<div class="input-group-addon">TYPE</div>' +
                    '<select class="form-control" id="menu_type_'+index+'">'+options+'</select></div>' +
                '<div class="input-group col-lg-5">' +
                    '<div class="input-group-addon">URL/KEY</div>' +
                    '<input type="text" class="form-control" id="menu_key_'+index+'">' +
                        '</div>' +
                '<div class="input-group col-lg-1">' +
                    '<button type="button" data-index="'+index+'" id="new2nd_'+index+'" class="btn btn-sm btn-orange"}>新增二级</button>' +
                '</div>' +
                '</div>'+
            '</form>';

        document.getElementById('mainMenu').appendChild(form);

        $('#new2nd_'+index).click(()=>{
            this.addNewMainSub($('#new2nd_'+index)[0]);
        });
    }

    // 保存菜单
    saveMenu(){
        let source = this.props.source,
            button = [],
            data = {};

        let mainMenu = $('.mainMenu');

        for(let i=0; i<mainMenu.length;i++){
            if($(mainMenu.get(i)).find('#menu_type_'+i).val()){
                let btn = {
                    type:$(mainMenu.get(i)).find('#menu_type_'+i).val(),
                    name:$(mainMenu.get(i)).find('#menu_name_'+i).val()
                };

                if($(mainMenu.get(i)).find('#menu_type_'+i).val() == 'view'){
                    btn.url = $(mainMenu.get(i)).find('#menu_key_'+i).val();
                }else{
                    btn.key = $(mainMenu.get(i)).find('#menu_key_'+i).val();
                }
                button.push(btn);

            }else{
                let forms = $(mainMenu.get(i)).find('.sub-form-'+i),
                    sub = [];

                let btn = {
                    name:$(mainMenu.get(i)).find('#menu_name_'+i).val()
                };

                for(let j=0;j<forms.length;j++){
                    let subButton = {
                        type: $(forms.get(j)).find('.sub_type').val(),
                        name: $(forms.get(j)).find('.sub_name').val()
                    };

                    if($(forms.get(j)).find('.sub_type').val() == 'view'){
                        subButton.url = $(forms.get(j)).find('.sub_key').val();
                    }else{
                        subButton.key = $(forms.get(j)).find('.sub_key').val();
                    }

                    sub.push(subButton);
                }

                btn.sub_button = sub;
                button.push(btn);
            }
        }

        data.source = source;
        data.buttons = button;
        data.match_rule = [];

        H.server.update_menu(data, (res)=>{
            if(res.code == 0) {
                H.Modal('操作成功');
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    // 删除菜单
    delMenu(e){
        let mId = e.target.dataset.id;

        H.Modal({
            content: '是否删除该菜单?',
            cancel: true,
            okCallback: ()=>{
                H.server.del_menu({source: this.props.source, menu_id:mId}, (res)=>{
                    if(res.code == 0) {
                        H.Modal('操作成功');
                        this.getData();
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else{
                        H.Modal(res.message);
                    }
                });
            }
        });
    }

    // 编辑个性化菜单
    createConditionalMenu(){
        let tags = this.state.tags,
            menu = this.state.menu.conditionalmenu,
            menuType = this.state.menuType,
            options = [],
            menuXML = [],
            tagXML = [];

        if(menuType.view || menuType.click){

            tags.map((tag, ti)=>{
                let operate = null,
                    xml = [];

                menu.map((m, index)=>{

                    if(tag.id == m.matchrule.group_id){
                        xml.push(<div>
                            <a href="javascript:;" data-id={m.menuid} onClick={this.delMenu.bind(this)}>删除</a>
                        </div>);

                        m.button.map((b, i)=>{
                            let subMenu = [];
                            menuXML = [];

                            options = [];
                            for(let key in menuType){
                                if(b.type){
                                    if(b.type == key){
                                        options.push(<option key={key+'_'+i} selected value={key}>{menuType[key].type_name+'['+key+']'}</option>);
                                    }else{
                                        options.push(<option key={key+'_'+i} value={key}>{menuType[key].type_name+'['+key+']'}</option>);
                                    }
                                }
                            }

                            if(b.sub_button && b.sub_button.length>0){
                                let sOptions = [];

                                b.sub_button.map((s, j)=>{

                                    sOptions = [];

                                    for(let key in menuType){
                                        if(s.type){
                                            if(s.type == key){
                                                sOptions.push(<option key={key+'_'+i+'_'+j} selected value={key}>{menuType[key].type_name+'['+key+']'}</option>);
                                            }else{
                                                sOptions.push(<option key={key+'_'+i+'_'+j} value={key}>{menuType[key].type_name+'['+key+']'}</option>);
                                            }
                                        }
                                    }

                                    subMenu.push(<form key={'cMenu_'+i+'_'+j} className={'form-inline sub-form-'+ti}>
                                        <div className="from-group menu-group row">
                                            <div className="col-lg-2"></div>
                                            <div className="input-group col-lg-2">
                                                <div className="input-group-addon">Name</div>
                                                <input type="text" className="form-control sub_name" id={'sC_name_'+j} defaultValue={s.name}/>
                                            </div>
                                            <div className="input-group col-lg-3">
                                                <div className="input-group-addon">TYPE</div>
                                                <select className="form-control sub_type" id={'sC_type_'+j}>{sOptions}</select>
                                            </div>
                                            <div className="input-group col-lg-4">
                                                <div className="input-group-addon">URL/KEY</div>
                                                <input type="text" className="form-control sub_key" id={'sC_key_'+j} defaultValue={s.key?s.key:s.url}/>
                                            </div>
                                        </div>
                                    </form>);
                                });
                            }

                            menuXML.push(<form key={'cmenu_'+i} id={'cMenuForm_'+i} className="form-inline cMenu-form">
                                <div className="from-group menu-group row">
                                    <div className="input-group col-lg-2">
                                        <div className="input-group-addon">Name</div>
                                        <input type="text" className="form-control" id={'c_name_'+ti+'_'+i} defaultValue={b.name}/>
                                    </div>
                                    <div className="input-group col-lg-4">
                                        <div className="input-group-addon">TYPE</div>
                                        <select className="form-control" id={'c_type_'+ti+'_'+i}>{options}</select>
                                    </div>
                                    <div className="input-group col-lg-5">
                                        <div className="input-group-addon">URL/KEY</div>
                                        <input type="text" className="form-control" id={'c_key_'+ti+'_'+i} defaultValue={b.key?b.key:b.url}/>
                                    </div>
                                    <div className="input-group col-lg-1">
                                        <button type="button" data-index={i} data-ti={ti} data-id={ti+'_'+i} className="btn btn-sm btn-orange" onClick={this.addNewCSub.bind(this)}>新增二级</button>
                                    </div>
                                </div>
                            </form>);

                            xml.push(<div id={'cMenu_'+ti+'_'+i} key={'cMenu'+i+m.menuid} className="cMenu">
                                {menuXML}
                                {subMenu}
                            </div>);
                        });
                    }

                    operate = (<div key={ti} id={'cMenu_'+ti}>
                        <div style={{margin:'10px 50px 10px 0', overflow: 'hidden'}}>
                            <p className="pull-left">{tag.name}</p>
                            <a href="javascript:;" className="pull-right" data-ti={ti} data-index={index} data-id={tag.id} onClick={this.saveCMenu.bind(this)}
                               style={{marginRight:'10px'}}>保存</a>
                            <a href="javascript:;" className="pull-right" data-ti={ti} data-index={index} onClick={this.addOneCMenu.bind(this)}
                               style={{marginRight:'10px'}}>新增一级</a>
                        </div>
                        {xml}
                    </div>);
                });

                tagXML.push(operate);
            });
        }

        return tagXML;
    }

    // 新增一级个性化菜单
    addOneCMenu(e){
        let menuType = this.state.menuType,
            ti = e.target.dataset.ti,
            index = $('#cMenu_'+ti).find('.cMenu').length,
            options = '',
            form = document.createElement('div');

        for(let key in menuType){
            options += '<option value="'+key+'">'+menuType[key].type_name+'['+key+']</option>';
        }

        form.className = 'cMenu';
        form.id = 'cMenu_'+ti+'_'+index;

        form.innerHTML = '<form class="form-inline">' +
            '<div class="from-group menu-group row">' +
            '<div class="input-group col-lg-2">' +
            '<div class="input-group-addon">Name</div>' +
            '<input type="text" class="form-control" id="c_name_'+ti+'_'+index+'"/></div>' +
            '<div class="input-group col-lg-4"> ' +
            '<div class="input-group-addon">TYPE</div>' +
            '<select class="form-control" id="c_type_'+ti+'_'+index+'">'+options+'</select></div>' +
            '<div class="input-group col-lg-5">' +
            '<div class="input-group-addon">URL/KEY</div>' +
            '<input type="text" class="form-control" id="c_key_'+ti+'_'+index+'">' +
            '</div>' +
            '<div class="input-group col-lg-1">' +
            '<button type="button" data-index="'+index+'" data-ti="'+ti+'" data-id="'+ti+'_'+index+'" id="new2nd_'+ti+'_'+index+'" class="btn btn-sm btn-orange"}>新增二级</button>' +
            '</div>' +
            '</div>'+
            '</form>';

        document.getElementById('cMenu_'+ti).appendChild(form);

        $('#new2nd_'+ti+'_'+index).click(()=>{
            this.addNewCSub($('#new2nd_'+ti+'_'+index)[0]);
        });
    }

    // 新增二级个性化菜单
    addNewCSub(e){
        let menuType = this.state.menuType,
            id = e.target?e.target.dataset.id:e.dataset.id,
            ti = e.target?e.target.dataset.ti:e.dataset.ti,
            options = '',
            form = document.createElement('form');

        for(let key in menuType){
            options += '<option value="'+key+'">'+menuType[key].type_name+'['+key+']</option>';
        }

        form.className = 'form-inline sub sub-form-'+ti;
        form.innerHTML = '<div class="from-group menu-group row">' +
            '<div class="col-lg-2"></div>' +
            '<div class="input-group col-lg-2">' +
            '<div class="input-group-addon">Name</div>' +
            '<input type="text" class="form-control sub_name"/></div>' +
            '<div class="input-group col-lg-3"><div class="input-group-addon">TYPE</div>' +
            '<select class="form-control sub_type">'+options+'</select></div>' +
            '<div class="input-group col-lg-4">' +
            '<div class="input-group-addon">URL/KEY</div>' +
            '<input type="text" class="form-control sub_key" />' +
            '</div></div>';

        document.getElementById('cMenu_'+id).appendChild(form);
        $('#cMenu_'+id).find('#c_type_'+id).html(' ');
        $('#cMenu_'+id).find('#c_key_'+id).val(' ');
    }

    saveCMenu(e){
        let source = this.props.source,
            ti = e.target.dataset.ti,
            id = e.target.dataset.id,
            button = [],
            data = {};

        let thisSubMenu = $('#cMenu_'+ti).find('.cMenu');

        for(let i=0; i<thisSubMenu.length;i++){
            if($(thisSubMenu.get(i)).find('#c_type_'+ti+'_'+i).val()){
                let btn = {
                    type:$(thisSubMenu.get(i)).find('#c_type_'+ti+'_'+i).val(),
                    name:$(thisSubMenu.get(i)).find('#c_name_'+ti+'_'+i).val()
                };

                if($(thisSubMenu.get(i)).find('#c_type_'+ti+'_'+i).val() == 'view'){
                    btn.url = $(thisSubMenu.get(i)).find('#c_key_'+ti+'_'+i).val();
                }else{
                    btn.key = $(thisSubMenu.get(i)).find('#c_key_'+ti+'_'+i).val();
                }
                button.push(btn);

            }else{
                let forms = $(thisSubMenu.get(i)).find('.sub-form-'+ti),
                    sub = [];

                let btn = {
                    name:$(thisSubMenu.get(i)).find('#c_name_'+ti+'_'+i).val()
                };

                for(let j=0;j<forms.length;j++){
                    let subButton = {
                        type: $(forms.get(j)).find('.sub_type').val(),
                        name: $(forms.get(j)).find('.sub_name').val()
                    };

                    if($(forms.get(j)).find('.sub_type').val() == 'view'){
                        subButton.url = $(forms.get(j)).find('.sub_key').val();
                    }else{
                        subButton.key = $(forms.get(j)).find('.sub_key').val();
                    }

                    sub.push(subButton);
                }

                btn.sub_button = sub;
                button.push(btn);
            }
        }

        data.source = source;
        data.match_rule = {};
        data.match_rule.group_id = id;
        data.buttons = button;

        H.server.update_menu(data, (res)=>{
            if(res.code == 0) {
                H.Modal('操作成功');
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    render() {
        return (<div className="section-warp" style={{overflowY: 'scroll', height: '600px'}}>
            {this.createDesInfo()}
        </div>);
    }
}

export default ServiceWechatMenu;