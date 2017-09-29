import React from 'react';
/*
* 带操作的表格
* values: []    //是一个对象数组
* headlines: [] //标题数组
* style: ''     //表格样式待商讨是否需要
* operate: {    //需要添加操作的列
*   column: btnGroup
* }
* */
class Table extends React.Component{

    constructor(){
        super();
    }

    objChangeToArr(obj){
        let arr = [];
        for(let key in obj){
            arr.push(obj[key]);
        }
        return arr;
    }

    //创建表格标题
    createHead(){
        let headlines = this.props.headlines,
            len = headlines.length,
            head = new Array(len);
        for(var i=0; i<len; i++){
            head[i] = (<th key={i}>{headlines[i]}</th>);
        }
        return(
            <tr>
                {head}
            </tr>
        );
    }

    //创建表格内容
    createBody(){
        let values = this.props.values,
            len = this.props.values.length,
            rows = new Array(len),
            objLen = this.props.headlines.length,
            operate = this.props.operate;
        for(var i=0; i<len; i++){
            let value = this.objChangeToArr(values[i]),
                row = new Array(objLen);
            for(var j=0; j<objLen; j++){
                row[j] = (<td key={j}>{ !operate ? value[j] : operate[j]}</td>);
            }
            rows[i] = (<tr key={i}>{row}</tr>);
        }
        return rows;
    }

    render(){
        return(
            <table className="table">
                <thead>
                    {this.createHead()}
                </thead>

                <tbody>
                    {this.createBody()}
                </tbody>
            </table>
        );
    }

}
export default Table;