/*
*品牌管理
* */
import React from 'react';
import Paging from '../../../components/page/paging.js';
import Table from '../../../components/table/tables.js';
import Modal from '../../../components/modal/modal.js';

class BrandManagement extends React.Component{

    constructor(){
        super();
        this.state = {
            currentPage: 0, //0初始页 1 搜索页
            data: {},
            brands: [],
            page: 1, //页数
            size: 20,
            id: '',
            brand: '',
            keyWords: '',
            status: false,
            operator: function(){} //是添加还是修改
        };
        this.initialData = this.initialData.bind(this);
        this.getSearchData = this.getSearchData.bind(this);
        this.freshData = this.freshData.bind(this);
    }

    //数据初始化
    componentWillMount(){
        this.initialData();
    }

    //获得表格数据
    initialData(){
        let para = {
            page: this.state.page,
            size: this.state.size
        };
        H.server.goods_brands_list(para, (res) => {
            if(res.code == 0){
                this.setState({
                    data: res.data,
                    brands: res.data.brands
                }, this.hideModal);
            }else{
                this.hideModal();
                H.Modal(res.message);
            }
        });
    }

    getSearchData(){
        let para = {
            page: this.state.page,
            size: this.state.size,
            brand: this.state.brand
        };
        H.server.goods_brands_list(para, (res)=>{
            if(res.code == 0){
                this.setState({
                    data: res.data,
                    brands: res.data.brands
                });
            }else{
                this.hideModal();
                H.Modal(res.message);
            }
        });
    }
    
    //点击页数时刷新数据
    freshData(){
        if(this.state.currentPage == 0){
            this.initialData();
        }else{
            this.getSearchData();
        }
    }
    
    //搜索栏
    createSearchFilter(){
        return(
            <div className="section-filter">
                <form className="form-inline">
                    <div className="filter-row">
                        <div className="search-bar">
                            <input className="form-control" type="text" placeholder="请输入品牌名" value={this.state.brand} onChange={this.inputBrand.bind(this)}/>
                            <btn className="btn  btn-sm" onClick={this.search.bind(this)}>搜索</btn>
                            <btn className="btn  btn-lg right" onClick={this.showModal.bind(this, null, 1, null)}>新增品牌</btn>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    createRow(brand, index){
        return(
            <tr key={index}>
                <td>{index+1}</td>
                <td>{brand.id}</td>
                <td>{brand.brand}</td>
                <td>{brand.key_words}</td>
                <td>
                    <a href="javascript:;" onClick={this.showModal.bind(this, index, 2, brand)}>修改</a>
                    <a href="javascript:;" onClick={this.delete.bind(this, brand, index)}>删除</a>
                </td>
            </tr>
        );
    }

    createTable(){
        let total = this.state.data.total;
        let size = this.state.size;
        let rows = [];
        this.state.brands.map((brand, index)=>{
            rows.push(this.createRow(brand, index));
        });
        let titles = ['序号', '品牌ID', '品牌名', '关键字/别名', '操作'];
        return(
            <div>
                <Table titles = {titles}>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
                <Paging key={this.state.currentPage} maxPage={total%size == 0 ? total/size : parseInt(total/size+1)}
                        clickCallback={this.setPageNum.bind(this)}/>
            </div>
        );
    }

    modify(index){
        let data = this.state.brands;
        data[index].id = this.state.id;
        data[index].brand = this.state.brand;
        data[index].key_words = this.state.keyWords;

        let para = {
            id: this.state.id,
            brand: this.state.brand,
            key_words: this.state.keyWords
        };
        H.server.goods_brands_update(para, (res)=>{
            if(res.code == 0){
                this.setState({
                    brands: data
                }, this.hideModal);
                H.Modal('修改成功');
            }else{
                this.hideModal();
                H.Modal(res.message);
            }
        });
    }

    addBrand(){
        if(this.state.keyWords == '' || this.state.brand == '') {
            this.hideModal();
            H.Modal('请填写信息');
            return;
        }
        let para = {
            brand: this.state.brand,
            key_words: this.state.keyWords
        };
        H.server.goods_brands_add(para, (res)=>{
            if(res.code == 0){
                this.setState({
                    currentPage: 0,
                    page: 1
                }, this.initialData);
                H.Modal('添加成功');
            }else{
                this.hideModal();
                H.Modal(res.message);
            }
        });
    }

    delete(brand, index){
        let data = this.state.brands;
        let para = {
            id: brand.id
        };
        H.server.goods_brands_delete(para, (res)=>{
            if(res.code == 0){
                data.splice(index, 1);
                this.setState({
                    brands: data
                });
                this.hideModal();
                H.Modal('删除成功');
            }else{
                this.hideModal();
                H.Modal(res.message);
            }
        });
    }

    search(){
        if(this.state.brand == ''){
            H.Modal('请输入后搜索');
            return ;
        }
        this.setState({
            currentPage: 1,
            page: 1
        }, () =>{
            this.getSearchData();
        });
    }

    showModal(index, operator, brand ){
        this.setState({
            status: true
        }, ()=>{
            if(operator == 1){
                this.setState({
                    id: '',
                    brand: '',
                    keyWords: ''
                }, ()=>{
                    this.setState({
                        operator: this.addBrand
                    });
                });
            }else{
                this.setState({
                    id: brand.id,
                    brand: brand.brand,
                    keyWords: brand.key_words
                }, ()=>{
                    this.setState({
                        operator: this.modify.bind(this, index)
                    });
                });
            }
        });
    }

    inputBrand(e){
        let brand = e.target.value;
        this.setState({
            brand: brand
        });
    }

    inputKeyWords(e){
        let val = e.target.value;
        this.setState({
            keyWords: val
        });
    }

    setPageNum(page){
        this.setState({
            page: page.page
        }, this.freshData);
    }

    hideModal(){
        this.setState({
            status: false
        });
    }

    modal(){
        return(
            <Modal confirm="保存" cancel="关闭" confirmCallback={this.state.operator.bind(this)} cancelCallback={this.hideModal.bind(this)} header="品牌信息">
                <p>ID:{this.state.id ? this.state.id : null}</p>
                <p>品牌名:<input type="text" value={this.state.brand} onChange={this.inputBrand.bind(this)}/></p>
                <p><span style={{verticalAlign :'top'}}>关键字:</span><textarea rows="4" value={this.state.keyWords} onChange={this.inputKeyWords.bind(this)}/></p>
            </Modal>
        );
    }

    render(){
        if(!this.state.brands) return null;
        return(
            <div className="section-warp">
                {this.createSearchFilter()}
                <div className="section-table" >
                    {this.createTable()}
                </div>
                {this.state.status ? this.modal() : null}
            </div>
        );
    }

}
export default BrandManagement;