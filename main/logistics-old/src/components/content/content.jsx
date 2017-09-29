import React from 'react';
import OptionCell from '../../common/option-cell.jsx';

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    carCode: '川M 33291',
                    name: '黄师傅',
                    address: ['海霸王', '简阳', '资阳', '安岳', '海霸王', '资阳'],
                    time: [1, 2, 3, 4],
                    phoneNo: 15208888888,
                    info: '一般来说7点就装满'
                },
                {
                    carCode: '川M 33291',
                    name: '黄师傅',
                    address: ['海霸王', '简阳', '资阳', '安岳'],
                    time: [1, 2, 3, 4],
                    phoneNo: 15208888888,
                    info: '一般来说7点就装满'
                },
                {
                    carCode: '川M 33291',
                    name: '黄师傅',
                    address: ['海霸王', '简阳', '资阳', '安岳'],
                    time: [1, 2, 3, 4],
                    phoneNo: 15208888888,
                    info: '一般来说7点就装满'
                },
                {
                    carCode: '川M 33291',
                    name: '黄师傅',
                    address: ['海霸王', '简阳', '资阳', '安岳'],
                    time: [1, 2, 3, 4],
                    phoneNo: 15208888888,
                    info: '一般来说7点就装满'
                }
            ]
        };
    }
    tell = (tel) => {
        console.log(tel);
    }
    render = () => {
        var data = {'title': '发货区域', 'val': 1, 'select': '海霸王', 'optionArr': ['海霸王', '青白江']};
        return (
            <div id="wrapper">
                <div id="scroller">
                    <div className="top-btn-group">
                        <div className="share-btn"><button>分享给好友</button></div>
                        <div className="add-btn"><button>添加司机</button></div>
                    </div>
                    <div className="cell-warp">
                        <OptionCell data={data} />
                        <OptionCell data={data} />
                    </div>
                    <div className="content">
                        {
                            this.state.data.map((d, index) => {
                                let addrStr = [];
                                for(let i = 0 ; i < d.address.length ; i++) {  //组合地址;
                                    addrStr.push(<span key={i}>{d.address[i]}</span>);
                                }
                                let timeStr = [];
                                for(let i = 0 ; i < d.time.length ; i++){
                                    timeStr.push(<span key={i}>{d.time[i]}</span>);
                                }
                                return (
                                    <div className="list" key={index} >
                                        <div className="username">
                                            <div>
                                                <p>{d.carCode}</p><p>{d.name}</p>
                                            </div>
                                        </div>
                                        <div className="info">
                                            <section className="address-list">
                                                {addrStr}
                                            </section>
                                            <section className="explain">
                                                <div className="explain-mes">
                                                    {timeStr}
                                                </div>
                                                <div className="explain-tel"><button onClick={this.tell.bind(this, d.phoneNo)}>联系司机</button></div>
                                            </section>
                                            <p className="remark">备注：{d.info}</p>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className="pullUp">
                        {/*<span className="pullUpIcon">&nbsp;</span>
                         <span className="pullUpLabel">Loading...</span>*/}
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;