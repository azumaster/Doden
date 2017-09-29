/**
 * 选择省市县的弹窗
 * 注意问题：只能选择2级和3级的。。。因为自己写的，所以问题有点多
 * Created by Doden on 2017.05.22
 */

import React from 'react';

class Cascade extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 0,
            final:false,
            currentChoice: [],
            currentScroll: []
        };
    }

    componentWillMount(){
        let address = this.props.address;
        if(this.state.currentStep == 0){
            this.setState({
                currentChoice: this.props.current?this.props.current:[],
                currentScroll: this.props.current?this.props.current[2]?address[this.props.current.length-1][this.props.current[0].id][this.props.current[1].id]:address[this.props.current.length-1][this.props.current[0].id]:address[0],
                currentStep: this.props.current?this.props.current.length-1:0,
                final: this.props.current?true:false
            });
        }
    }

    componentDidMount(){
        this.createScroll();
        $('#cascadeBody').animate({bottom: 0}, 300);
    }

    createScroll(){
        let scrollOptions = {
            zoom: true,
            scrollX: false,  //是不中可以横向滚动;
            scrollY: true,  //是否可以纵向滚动;
            mouseWheel: true, //是否监听鼠标滚轮;
            wheelAction: 'zoom',
            probeType: 2,
            preventDefault: false
        };

        let SCROLL = new IScroll('#cascadeList', scrollOptions);
        this.SCROLL = SCROLL;

        SCROLL.on('beforeScrollStart', () => {
            SCROLL.refresh();
        });
    }

    createTopAddress(){
        let currentChoice = this.state.currentChoice,
            ps = [];

        if(currentChoice.length>0){
            currentChoice.map((current, index)=>{
                let currentC = currentChoice[this.state.currentStep],
                    className = '';
                if(currentC){
                    if(currentC.id == current.id && index == this.state.currentStep){
                        className = 'active';
                    }
                }
                ps.push(<p key={index} className={className} data-step={index} onClick={this.changeTop.bind(this)}
                           data-id={current.id}>{current.name}</p>);
            });

            if(!this.state.final){
                ps.push(<p className="active" key={currentChoice.length}>请选择</p>);
            }
        }else{
            ps.push(<p className="active" key={0}>请选择</p>);
        }

        return ps;
    }

    createScrollBody(){
        let scroll = this.state.currentScroll,
            scrollBody = [];

        scroll.map((s, i)=>{
            let current = this.state.currentChoice[this.state.currentStep],
                className = '';
            if(current){
                if(current.id == s.id) className = 'active';
            }
            scrollBody.push(<p onClick={this.choice.bind(this)} className={className} key={i} data-id={s.id}>{s.name}</p>);
        });

        return scrollBody;
    }

    changeTop(e){
        let step = e.target.dataset.step,
            id = step==0?0:this.state.currentChoice[step-1].id,
            scroll = this.props.address[step];

        if(step == 1){
            scroll = this.props.address[step][id];
        }else if(step == 2){
            scroll = this.props.address[step][this.state.currentChoice[step-2].id][id];
        }

        this.SCROLL.scrollTo(0, 0, 0, 0);
        this.setState({
            currentStep: step,
            currentScroll: scroll
        });
    }

    choice(e){
        let step = this.state.currentStep,
            currentId = e.target.dataset.id,
            currentName = e.target.innerHTML;

        step++;
        this.setState({
            final: false
        });

        if(this.props.address[step]){
            let address,
                currentChoice = this.state.currentChoice;

            if(step==1){
                address = this.props.address[step][currentId];
            }else if(step==2){
                address = this.props.address[step][this.state.currentChoice[step-2].id][currentId];
            }

            if(currentChoice.length>step){
                currentChoice.splice(step, currentChoice.length-step);
            }
            currentChoice[step-1] = {id: currentId, name: currentName};
            if(step==1){
                if(this.props.address[step][currentId][0]){
                    if(this.props.address[step][currentId][0]){
                        this.setState({
                            currentChoice: currentChoice,
                            currentScroll: address,
                            currentStep: step
                        });
                        this.SCROLL.scrollTo(0, 0, 0, 0);
                    } else{
                        currentChoice[step-1] = {id: currentId, name: currentName};
                        this.setState({
                            currentChoice: currentChoice,
                            currentStep: 0
                        });
                    }

                }else {
                    let currentChoice = this.state.currentChoice;
                    currentChoice[step-1] = {id: currentId, name: currentName};

                    this.setState({
                        currentChoice: currentChoice,
                        final: true
                    });
                }

            }else if(step == 2){

                if(this.props.address[step][this.state.currentChoice[step-2].id][currentId][0]){
                    // currentChoice.push(this.props.address[step][this.state.currentChoice[step-2].id][currentId][0]);
                    this.setState({
                        currentChoice: currentChoice,
                        currentScroll: address,
                        currentStep: step
                    });
                    this.SCROLL.scrollTo(0, 0, 0, 0);
                }else{
                    currentChoice[step-1] = {id: currentId, name: currentName};
                    this.setState({
                        currentChoice: currentChoice,
                        currentStep: 1,
                        final: true
                    });
                }
            }
        }else{
            let currentChoice = this.state.currentChoice;
            currentChoice[step-1] = {id: currentId, name: currentName};

            this.setState({
                currentChoice: currentChoice,
                final: true
            });
        }
    }

    cancel(current){
        $('#cascadeBody').animate({bottom: '-60%'}, 300);
        setTimeout(()=>{
            this.props.close && this.props.close(current);
        }, 300);
    }

    submit(){
        let currentChoice = this.state.currentChoice;
        if(this.state.final){
            this.cancel(currentChoice);
        }else{
            H.toast('请选择完整的地址');
            this.cancel({});
        }
    }

    render() {
        return (<div id="cascade" className="cascade-mask">
            <div id="cascadeBody" className="cascade">
                <div className="cascade-title">{this.props.title}</div>
                <div className="cascade-info">{this.createTopAddress()}</div>
                <div className="cascade-list" id="cascadeList">
                    <div className="scroller">
                        {this.createScrollBody()}
                    </div>
                </div>
                <div className="cascade-footer">
                    <div className="cascade-btn cancel" onClick={this.cancel.bind(this)}>取消</div>
                    <div className="cascade-btn submit" onClick={this.submit.bind(this)}>提交</div>
                </div>
            </div>
        </div>);
    }
}

export default Cascade;