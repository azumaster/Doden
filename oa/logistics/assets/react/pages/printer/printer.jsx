/**
 * 打印机配置
 * @author 魏华东
 * @date 2017.1.6
 */

class Printer extends React.Component {
    constructor(props){
        super(props);
    }

    componentWillMount() {
        if($('#printScript').length<=0){
            let printScript = '<script id="printScript" type="text/javascript" src="/js/LodopFuncs.js">';
            $('body').append(printScript);
        }
    }

    componentDidMount() {
        H.Modal({
            title:'警告',
            content:'每次更换电脑或清除浏览器缓存之后，需重新至本页面配置打印机。',
            okText: '我知道了',
            okCallback:()=>{
                // 获取打印机信息
                this.createPrinter();
                // 设定打印机选项
                this.setPrinter();
            }
        });
    }

    // 获取系统打印机信息
    createPrinter() {
        LODOP = getLodop();

        let iPrinterCount = LODOP.GET_PRINTER_COUNT(); // 获取系统打印机的数量

        for(let i=0; i<iPrinterCount;i++){
            let option = $('<option></option>');
            option.html(LODOP.GET_PRINTER_NAME(i));
            option.val(i);

            $('#waybill, #tag, #bill, #driver, #label').append(option);
        }
    }

    setPrinter() {

        if (localStorage.getItem('print')) {
            let printConfig = JSON.parse(localStorage.getItem('print'));

            console.log(printConfig);

            for(let i=0; i<LODOP.GET_PRINTER_COUNT(); i++) {
                if(LODOP.GET_PRINTER_NAME(i) == printConfig.waybillPrinter){
                    $('#waybill').get(0).selectedIndex = i;
                }
                if(LODOP.GET_PRINTER_NAME(i) == printConfig.tagPrinter){
                    $('#tag').get(0).selectedIndex = i;
                }
                if(LODOP.GET_PRINTER_NAME(i) == printConfig.billPrinter){
                    $('#bill').get(0).selectedIndex = i;
                }
                if(LODOP.GET_PRINTER_NAME(i) == printConfig.driverPrinter){
                    $('#driver').get(0).selectedIndex = i;
                }
                if(LODOP.GET_PRINTER_NAME(i) == printConfig.labelPrinter){
                    $('#label').get(0).selectedIndex = i;
                }
            }
        }
    }

    // 保存打印机
    savePrint() {
        let printConfig = {
            waybillPrinter: $('#waybill').find('option:selected').text(),
            tagPrinter: $('#tag').find('option:selected').text(),
            billPrinter: $('#bill').find('option:selected').text(),
            driverPrinter: $('#driver').find('option:selected').text(),
            labelPrinter: $('#label').find('option:selected').text()
        };

        H.Modal({
            content: '确认保存打印机配置？',
            cancel:true,
            okText: '确认保存',
            okCallback: ()=>{
                localStorage.setItem('print', JSON.stringify(printConfig));
            }
        });
    }

    render(){
        return(
            <div className="goods-info-ctrl">
                <div className="goods-info container-fluid">
                    <h3 className="title">打印机配置</h3>
                    <hr/>
                    <div className="goods-info-content">
                        <h4 className="text-left text-warning">警告：每次更换电脑或清除浏览器缓存之后，需重新至本页面配置打印机。</h4>
                        <div className="panel panel-default col-lg-6" style={{padding:0}}>
                            <div className="panel-body col-lg-12">
                                <div className="row form-group">
                                    <div className="col-lg-2 text-right form-control-static">配送单</div>
                                    <div className="col-lg-8">
                                        <select id="waybill" className="form-control"></select>
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <div className="col-lg-2 text-right form-control-static">货品标签</div>
                                    <div className="col-lg-8">
                                        <select id="tag" className="form-control"></select>
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <div className="col-lg-2 text-right form-control-static">收据</div>
                                    <div className="col-lg-8">
                                        <select id="bill" className="form-control"></select>
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <div className="col-lg-2 text-right form-control-static">司机单</div>
                                    <div className="col-lg-8">
                                        <select id="driver" className="form-control"></select>
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <div className="col-lg-2 text-right form-control-static">运单标签</div>
                                    <div className="col-lg-8">
                                        <select id="label" className="form-control"></select>
                                    </div>
                                </div>
                            </div>
                            <div className="panel-footer col-lg-12"><a href="javascript:;" className="btn btn-default btn-lg" onClick={this.savePrint.bind(this)}>保存配置</a></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Printer;