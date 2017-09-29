/*
* 更新搜索同义词，更新搜索自定义词库
* */

import React from 'react';
import BtnGroup from '../../../components/btn-group/btn_group.jsx';

class GoodsKeyWords extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 1,                 //当前操作是同义词还是自定义词库的状态;1为正在操作同义词，2为正在操作自定义词库;
            synonymyData: null,        //同义词的数据;
            customData: null          //自定义词库的数据;
        };
        this.getSynonymyData = this.getSynonymyData.bind(this);
    }

    componentWillMount() {
        this.getSynonymyData();
    }

    //获取同义词的数据;
    getSynonymyData() {
        H.server.search_synonym({}, (res) => {
            this.setState({synonymyData: res});
        });
    }

    //获取自定义词库;
    getCustomData() {
        H.server.search_custom({}, (res) => {
            this.setState({customData: res});
        });
    }

    //切换;
    setStatus(e) {
        let index = e.target.dataset.index;
        if(index == 1) {
            if(!this.state.synonymyData) {
                this.getSynonymyData();
            }
        }
        else {
            if(!this.state.customData) {
                this.getCustomData();
            }
        }
        this.setState({status: index});
    }

    //设置同义词的数据;
    setSynonymyData(e) {
        let val = e.target.value;
        this.setState({synonymyData: val});
    }

    //设置自定义词库;
    setCustomData(e) {
        let val = e.target.value;
        this.setState({customData: val});
    }

    //保存同义词;
    saveSynonymyData() {
        H.server.search_synonym_update({synonym: this.state.synonymyData}, (res) => {
            if(res.code == 0) {
                H.Modal('保存成功');
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //保存自定义词库;
    saveCustomData() {
        H.server.search_dict_update({dict: this.state.customData}, (res) => {
            if(res.code ==0) {
                H.Modal('保存成功');
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    render() {
        return (
            <div className="section-warp">
                <div className="section-filter">
                    <div className="filter-row">
                        <BtnGroup btnNames={['同义词', '自定义词库']} bindData={[1, 2]} clickCallback={this.setStatus.bind(this)}
                                  style="btn btn-lg" activeStyle="btn btn-lg btn-default" status={this.state.status}/>
                    </div>
                </div>
                <div className="section-table">
                    {
                        this.state.status == 1 ?
                            <div className="synonymy-words row">
                                <div className="col-lg-6">
                                    <p>每行一组,逗号分隔(不区分中英文逗号)</p>
                                    <textarea value={this.state.synonymyData} onChange={this.setSynonymyData.bind(this)} style={{width: '100%', height: '300px', padding: '5px'}}>
                                    </textarea>
                                    <div style={{textAlign: 'right'}}><btn className="btn btn-lg btn-default" onClick={this.saveSynonymyData.bind(this)}>保存</btn></div>
                                </div>
                            </div> :
                            <div className="custom-words row">
                                <div className="col-lg-6">
                                    <p>每行一个</p>
                                    <textarea value={this.state.customData} onChange={this.setCustomData.bind(this)} style={{width: '100%', height: '300px', padding: '5px'}}>
                                    </textarea>
                                    <div style={{textAlign: 'right'}}><btn className="btn btn-lg btn-default" onClick={this.saveCustomData.bind(this)}>保存</btn></div>
                                </div>
                            </div>
                    }
                </div>
            </div>
        );
    }
}

export default GoodsKeyWords;