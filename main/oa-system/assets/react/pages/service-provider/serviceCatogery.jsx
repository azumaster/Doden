/**
 * Created by Doden on 2017.03.03
 */

import React from 'react';

class ServiceCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortList:[]
        };
    }

    componentWillMount(){
        this.getData();
    }

    getData(){
        H.server.category_list({}, (res)=>{
            if(res.code == 0) {
                this.setState({
                    sortList: res.data
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    createCategoryList(){
        let categoryList = this.state.sortList,
            categoryDivs = [];

        categoryList.map((category, index)=>{
            categoryDivs.push(<div key={index} data-valu={category.sort_value} className="category-divs">{category.type_name}</div>);
        });

        return (<div className="category-list">
            {categoryDivs}
        </div>);
    }

    addNewCategory(){
        H.Modal({
            title: '新增分类',
            content: '<form class="form-inline">' +
            '<div class="form-group">' +
            '<label>分类名：</label>' +
            '<input id="serviceCategoryName" type="text" class="form-control">' +
            '</div></form>',
            okText: '确认新增',
            cancel: true,
            okCallback: ()=>{
                H.server.add_category({sort_name: $('#serviceCategoryName').val()}, (res)=>{
                    if(res.code == 0) {
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

    render() {
        return (<div className="section-warp">
            <div className="section-filter">
                <form className="form-inline">
                    <div className="filter-row">
                        <button type="button" className="btn btn-lg btn-orange" onClick={this.addNewCategory.bind(this)}>新增分类</button>
                    </div>
                </form>
            </div>
            <div className="section-table" >
                {this.createCategoryList()}
            </div>
        </div>);
    }
}

export default ServiceCategory;