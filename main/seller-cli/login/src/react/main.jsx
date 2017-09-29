
import Mobile from './views/mobile.jsx';
import Info from './views/info.jsx';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageStep: 1,
            tel: 0,
            re: null
        };
    }

    componentWillMount() {
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);

        H.weSign(['chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getLocalImgData']);

        console.log(';a');
        let query = window.location.search.substr(1).split('pageStatus');
        if(query.length>1){
            query = query[1].split('&')[0].substr(1);
        }

        if(query == 1){
            // 表明是重开店铺，在这里需要获取相应信息，打开第二步
            H.server.getReApply({}, (res)=>{
                if(res.code ==0 || res.status == 0){
                    this.setState({
                        pageStep: 2,
                        re: res.data
                    });
                }else{
                    H.toast(res.message);
                }
            });
        }
    }

    nextStep(tel){
        this.setState({
            pageStep: 2,
            tel: tel
        });
    }

    render() {
        return (<div id="login" className="login">
            {this.state.pageStep == 1?<Mobile nextStep={this.nextStep.bind(this)}/>
                :<Info tel={this.state.tel} re={this.state.re}/>}
        </div>);
    }
}

export default Main;