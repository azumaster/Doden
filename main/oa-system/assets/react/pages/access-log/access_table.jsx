/*
* 访问日志-表格组件
* */
import React from 'react';
import Paging from '../../../components/page/paging.js';
import Table from '../../../components/table/tables.js';

/*
*传入的参数有headers, aboveTableResult, total, ,tableTile, result, setPageNumEvt
* */

class AccessTable extends React.Component{

    constructor(){
        super();
    }

    //数据类型转换表
    static defaultProps = {
        shopType:{
            11: '一批',
            12: '其他',
            21: '二批',
            22: '其他',
            23: '其他',
            24: '终端',
            25: '其他',
            26: '其他',
            31: '其他',
            100: '其他',
            0: '未注册'
        }
    };

    objChangeToArr(obj){
        let arr = [];
        for(let key in obj){
           arr.push(obj[key]);
        }
        return arr;
    }

    createHeader(){
        let result = this.objChangeToArr( this.props.aboveTableResult);
        let headers = [];
        this.props.headers.map((header, index) =>{
            headers.push(<span key={index}>{header}:{result[index]}</span>);
        });
        return(
            <h4>
                {headers}
            </h4>
        );
    }

    createRow(data, index){
        let dataArr = this.objChangeToArr(data);
        let row = [];
        dataArr.map((data, index) =>{
            if(index == 4){
                row.push(<td key={+new Date() + index}>{this.props.shopType[data]}</td>);
            }else{
                row.push(<td key={+new Date() + index}>{data}</td>);
            }
        });
        return(
            <tr key={index}>
                {row}
            </tr>
        );
    }

    createTable(){
        let total = this.props.total;
        let rows = [];
        this.props.result.map((data, index) => {
            return rows.push(this.createRow(data, index));
        });
        return(
            <div>
                {this.createHeader()}

                <Table titles={this.props.tableTile}>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>

                <Paging key={this.props.currentPage} maxPage={total%20 == 0 ? total/20 : parseInt(total/20+1)} clickCallback={this.setPageNum.bind(this)} />
            </div>
        );
    }

    setPageNum(page){
        this.props.setPageNum(page);
    }

    render(){
        return(
            <div>
                {this.createTable()}
            </div>
        );
    }

}
export  default AccessTable;