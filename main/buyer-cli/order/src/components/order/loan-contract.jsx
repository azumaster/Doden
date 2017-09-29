/*
* xy 2017.07.11
* 借款合同;
* */
import React from 'react';

class LoanContract extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.applyData
        }
    }

    componentWillMount() {
        if(!this.state.data) {
            H.server.getApplyData({}, (res) => {
                if(res.code == 0) {
                    this.setState({data: res.data});
                    this.props.setApplyData(res.data);
                }else {
                    H.dialog(res.message);
                }
            });
        }
    }

    componentDidMount() {
        this.scrollCreator();
    }

    scrollCreator(){
        // 创建iscroll实例
        var wrapper = document.getElementById("LoanContract"),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false,
                topOffset: 50
            });
        SCROLL.on('beforeScrollStart', () => {
            SCROLL.refresh();
        });
    }

    render() {
        let data = this.state.data,
            xml = null;
        if(data) {
            if(data.identity_data && data.bank_data) {
                xml = (
                    <div className="content">
                        <h1>借款合同</h1>
                        <p>编号：</p>
                        <p>借款人：<span className="border-bottom color-red" style={{marginRight: '10px'}}>{data.identity_data.name}</span><span style={{display: 'inline-block'}}>证件号码：<span className="border-bottom color-red">{data.identity_data.id_card}</span></span></p>
                        <p>出借人：详见本合同第一条</p>
                        <p>居间人：上海宝象金融信息服务有限公司</p>
                        <p>本合同使用说明：</p>
                        <p>1、借款人、出借人已事先阅读并认可居间人提供的借款合同样本，并确认本合同第一条项下的借款信息正确无误。具体出借人及每个出借人的出借金额等详细信息将于满标后展示在相应列表项下。</p>
                        <p>2、本合同采用电子合同形式，各方均认可该电子合同的法律效力。</p>
                        <p>经居间人的居间介绍，出借人、借款人通过居间人官网（www.bxjr.com ）、居间人合法运营的手机应用程序、居间人合法运营的微信服务号等平台（以上总称“宝象金融平台”）以及出借人、借款人在宝象金融平台使用的有密码保护的个人账户，就有关借款事项，各出借人、借款人、居间人达成协议如下：</p>
                        <h2>一、借款的基本条款</h2>
                        <p>1、借款信息</p>
                        <p className="flex-box">借款期限<span className="flex-num1 color-red" style={{display: 'inline-block', textAlign: 'right'}}>{this.props.param.apply_data.loan_period}天</span></p>
                        <p className="flex-box">年利率（单利）：<span className="flex-num1 color-red" style={{display: 'inline-block', textAlign: 'right'}}>{this.props.data.year_interest_rate}</span></p>
                        <p className="flex-box">借款开始日：<span className="flex-num1 color-red" style={{display: 'inline-block', textAlign: 'right'}}>{H.time.timeStamp(this.props.data.status_date).date}</span></p>
                        <p className="flex-box">借款到期日：<span className="flex-num1 color-red" style={{display: 'inline-block', textAlign: 'right'}}>{H.time.timeStamp(this.props.data.expire_date).date}</span></p>
                        <p className="flex-box">还款方式：<span className="flex-num1 color-red" style={{display: 'inline-block', textAlign: 'right'}}>按日计息，随借随还</span></p>
                        <p className="flex-box">借款用途：<span className="flex-num1 color-red" style={{display: 'inline-block', textAlign: 'right'}}>找冻品网上购买冻品</span></p>
                        <p>2.出借人</p>
                        <table>
                            <tbody>
                            <tr className="out">
                                <th>姓名</th>
                                <th>证件号码</th>
                                <th>出借金额（元）</th>
                                <th>到期本息总额（元）</th>
                            </tr>
                            <tr>
                                <td>胡小宇</td>
                                <td>1</td>
                                <td>12</td>
                                <td>123</td>
                            </tr>
                            </tbody>
                        </table>
                        <p>*借款开始日以满标审核后生成的借款日期为准。<span className="color-red bg-yellow">如借款到期日遇到法定节假日或公休日，还款日期不顺延，借款人应按本合同第二条第4款约定进行还款。</span></p>
                        <h2>二、借款发放及还款</h2>
                        <p className="color-red">1、出借人在同意向借款人出借相应款项时，已委托居间人在借款列表满标且通过居间人的终审时将该笔借款直接划付至借款人在宝象金融平台开立的账户或该账户绑定的银行卡账户，或者划付至由借款人指定的第三方交易场景合作方账户（以放款通知书为准）。借款人指定的第三方交易场景合作方账户信息如下：</p>
                        <p className="color-red">户名：<span className="border-bottom red_ bank_">{data.identity_data.name}</span>；</p>
                        <p className="color-red">账号：<span className="border-bottom red_ bank_">{data.bank_data.debit_card.card_number}</span>；</p>
                        <p className="color-red">开户行名称（到支行）：<span className="border-bottom red_ bank_">{data.bank_data.debit_card.open_bank_branch}</span>。</p>
                        <p className="color-red">由于借款人绑定的银行卡或指定的第三方交易场景合作方账户信息错误，造成借款人或者指定的第三方交易场景合作方无法及时收到该笔借款的，由借款人自行承担一切后果。</p>
                        <p className="color-red">2、出借人委托居间人将本合同第一条约定的出借款项划入借款人在第二条第1款指定账户则视为出借人履行了借款发放义务，借款人应按约履行偿还全部借款本息及费用的义务。</p>
                        <p>3、借款人承诺按照本合同约定的时间和金额按期足额向出借人还款。</p>
                        <p>4、<span className="color-red bg-yellow">借款人须在借款到期还款日当日（最迟于当日24:00前）或之前将本合同规定的偿还本息数额充值到借款人在宝象金融平台的账户，遇到法定节假日或公休日时还款日期不进行顺延。</span></p>
                        <p>5、借款人应按居间人指示向宝象金融平台充值进行还款，若因余额不足导致扣款失败的，借款人须自行承担逾期还款的全部法律责任。</p>
                        <p>6、 若借款人的任何一期还款不足以偿还应还本金、利息、费用和逾期违约金的，出借人之间同意按照出借金额的相应比例收取还款。如借款人还款不足以偿还约定的费用、逾期违约金、利息及本金的，各方确认：借款人的每一笔还款，应优先全额归还的顺序依次为：费用、逾期违约金、正常利息、本金。</p>
                        <p>7、借款人的最后一期还款必须包含全部剩余本金、利息及其他根据本合同产生的全部费用。</p>
                        <p>8、经居间人确认同意，借款人有权提前偿还全部或部分借款，但应承担相应违约责任。</p>
                        <p>9、如借款人需更换已绑定的银行账户，须于居间人或第三方支付公司完成相关操作前向居间人提出，并征得居间人同意。如借款人未及时提出申请或未按居间人要求提出申请的，须自行承担由此产生的一切损失及责任。</p>
                        <p>三、出借人、借款人（合称“双方”）的权利和义务</p>
                        <p>1、双方已认真阅读和理解本合同所有内容并自愿按本合同相关约定履行各自的权利义务。</p>
                        <p>2、出借人有自行选择借款人，并最终决定是否出借资金给特定借款人的权利。</p>
                        <p>3、任何一方在宝象金融平台的账户对本合同进行操作成功确认时，即视为该方接受本合同条款内容并受此内容之拘束；各方均对本合同进行操作成功确认时，本合同即成立。</p>
                        <p>4、通过宝象金融平台提供的服务，出借人向借款人成功出借资金时，本合同生效。</p>
                        <p>5、双方应妥善保管自己宝象金融平台的注册用户名和密码，自行承担因注册用户名和密码丢失、泄露或允许他人使用所产生的一切后果。任何一方通过用户名和密码登录的任何操作均视为该方本人真实意思表示。</p>
                        <p>6、双方应基于合法目的使用宝象金融平台，不得以该平台从事任何违法、违纪行为。</p>
                        <p>7、双方有义务在宝象金融平台上真实、准确、完整地填写其个人信息（包括但不限于电子邮件地址、手机号码等）。因双方个人操作不当或填写的个人信息有误造成的法律后果、经济损失均由其个人自行承担。</p>
                        <p>8、借款人及出借人在此不可撤销地同意由居间人直接从宝象金融平台账户扣划相应金额用于支付借款人、出借人应付的平台服务费、利息、本金、逾期违约金及其他费用。</p>
                        <p>9、出借人在此不可撤销地授权居间人并同意居间人转委托第三方根据本合同提供借款催收及追偿的管理服务，同时出借人应积极协助居间人或居间人转委托的第三方向借款人追偿（包括但不限于签署、提供法律文件和相应书面材料等）。</p>
                        <p>10、借款人在申请及实现借款的全过程中，必须如实提供所要求提供的个人信息及材料，并且借款人在此不可撤销地授权居间人为了促成本合同借款行为之目的通过其他合法渠道查询借款人的个人信息及材料；借款人同意居间人可以通过任何第三方渠道验证借款人所提供信息的真实性，记录在征信机构的个人信用信息库中；且借款人应在所提供信息被认定为虚假时承担所有后果和法律责任。</p>
                        <p>11、自本合同成立之日起至所有本息、各项服务费用、平台费用及违约金（如有）全部清偿前，出借人和借款人及双方的本人、家庭联系人及紧急联系人的工作单位、居住地址、住所电话、手机号码、账户信息、电子邮箱如出现变更的，应在变更后三日内通过宝象金融平台向其他各方提供变更后的最新信息。若因任何一方未及时提供最新信息或提供虚假信息而导致自身和/或任何其他方遭受的损失均由该未及时提交真实信息的一方承担。</p>
                        <p>12、成功借款后，居间人或居间人委托的第三方依据出借人的委托要求借款人按本合同约定进行还款时，借款人有义务无条件及时按照居间人或居间人委托的第三方发出的要求进行还款。</p>
                        <p>13、出借人、居间人或委托的第三方有权检查、监督借款的使用情况，有权要求借款人定期报告或告知出借人资金支付情况。</p>
                        <p>14、本合同有效期内，借款人发生本合同第七条第11项所列违约情况时，居间人有权代表出借人宣布本合同提前到期终止，而无须为正当行使上述权力所引起的任何损失负责。</p>
                        <p>15、借款人未履行还款义务，出借人、居间人可以就借款人的违约行为对外进行公开披露。</p>
                        <p>16、借款人有权按照本合同约定取得和使用借款。</p>
                        <p>17、借款人保证不以与任何第三方发生纠纷为理由拒绝履行还款义务。</p>
                        <p>18、本合同有效期内，若借款人涉及重大诉讼或仲裁，可能影响按期支付本合同的借款本息时，借款人应立即书面通知居间人，并落实出借人认可的债权保全措施。发生此等情况，出借人有权提前收回借款本息。</p>
                        <p>四、居间人的权利与义务</p>
                        <p>1、居间人应按照本合同的约定，恪尽职守，以诚实、信用、谨慎、有效管理的原则为出借人、借款人进行服务。</p>
                        <p>2、居间人对出借人、借款人的个人信息、资产情况及其他服务相关信息和资料依法保密。</p>
                        <p>3、就借款人提供的个人信息及居间人或居间人委托的第三方通过合法渠道获取的与其相关的个人信息，居间人有权为本合同目的自行管理并使用。</p>
                        <p>4、居间人承诺为出借人提供与借款人相关的信用资质审核服务，但对借款人的借款不承担保证责任。</p>
                        <p>5、居间人有权或委托第三方通过借款人提供的个人信用信息及行为记录为借款人提供借款相关的信用审核服务，并为借款人提供相关建议。</p>
                        <p>6、借款人同意，为促成借款人获得借款需要在宝象金融平台对借款人及借款用途的相关信息进行公开，居间人不承担由此信息公布造成的任何法律后果。</p>
                        <p>五、关于各方承诺与保证</p>
                        <p>1、出借人、借款人各自在此确认为具有完全民事权利能力和完全民事行为能力的自然人，有权签订并履行本合同。</p>
                        <p>2、出借人承诺并保证其自身为宝象金融平台注册用户并在本合同有效期内保持宝象金融平台注册用户身份；其提供的资金来源合法。</p>
                        <p>3、出借人承诺已充分了解融资项目信贷风险，并确认具有相应的风险认知和承受能力。</p>
                        <p>4、 借款人应根据居间人的要求如实向出借人和居间人或居间人委托的第三方提供个人情况（包括但不限于姓名、身份证号、学历、联系方式、联系地址、职业信息、联 系人信息等）以及借款用途等相关信息。借款人承诺并保证其向出借人和居间人及居间人委托的第三方提供的所有信息均为真实、完整和有效的。</p>
                        <p>5、借款人如因工作单位、职位、工作地点等变化或发生任何其他有可能影响或导致借款人经济状况恶化或还款能力减低的事件时，都必须在前述事件发生之日起2个工作日内书面通知居间人及居间人委托的第三方。</p>
                        <p>6、借款人承诺不得挪用本合同借款资金用于其他本合同所约定以外之用途。</p>
                        <p>7、各方承诺，不得利用宝象金融平台进行信用卡套现、洗钱或其他违法、违纪行为，否则应依法承担由此产生的法律责任和后果。</p>
                        <p>8、各方确认，借款人/出借人授权和委托居间人按照本合同约定实施的行为或采取的措施所带来的法律后果均由借款人/出借人个人承担。</p>
                        <p>六、费用标准及结算</p>
                        <p>居间人有权基于本合同项下的居间服务及相关增值服务等向借款人或出借人收取费用。具体收费项目、收费标准及收费方式等以宝象金融平台公布的内容或《信用咨询及管理服务协议》的约定为准。</p>
                        <p>七、逾期还款及违约情形</p>
                        <p>1、借款人同意，若借款人逾期未还款，出借人可以通过发布借款人的信息或悬赏方式追索债权。</p>
                        <p>2、若借款人逾期归还本金或利息的，<span className="color-red">以逾期支付的全部本金和利息为基数计算逾期违约金，逾期违约金费率较正常借款利率上浮50%，自到期还款日（T日）的【T+1】日起计收，直至借款人清偿本合同项下所有逾期违约金、费用、利息及本金为止。</span></p>
                        <p>3、借款人逾期还款的，居间人有权将借款人的“逾期记录” 记入网站的信用记录及国家和地方的公民征信系统，出借人及居间人不承担任何法律责任。</p>
                        <p>4、借款人逾期还款的，经居间人确认，出借人有权在通知借款人的情况下将全部或者部分债权转让给任何第三方（包括但不限于专业的商账追收公司等）。</p>
                        <p>5、借款人逾期还款的，出借人或居间人均有权通过任何方式向任何人披露借款人的联系方式及其个人信息和资料。</p>
                        <p>6、 借款人未按附件的还款计划偿还本息的，或借款人在逾期后出现逃避、拒绝沟通或拒绝承认欠款事实等恶意行为，本合同项下全部本息、逾期违约金、服务 费等视同提前到期，出借人和居间人有权要求借款人提前一次性清偿本合同项下尚未偿付的全部本金、利息、逾期违约金、服务费及根据本合同或相关合同（包括《借款咨询及管理服务协议》）产生的其他全部费用。</p>
                        <p>7、为集中维护各出借人权利，如借款人逾期还款的，或借款人在逾期后出现逃避、拒绝沟通或拒绝承认欠款事实等恶意行为的，全体出借人一致同意将本合同项下债权无偿转让给居间人，由居间人或居间人委托的第三方统一向借款人追索。出借人应当自行承担因债权无法追索产生的一切法律责任及结果。</p>
                        <p>8、 根据前述本条第7项约定进行债权转让时，全体出借人委托居间人向借款人注册时填写的注册邮箱、绑定的手机号码发送债权转让通知书，或通过站内信方式发送债权转让通知，自发出通知之日起债权转至居间人。经追索实现的债权款项在扣除为实现债权支付的相关费用，包括但不限于诉讼保全费用、公证费用、执行费用、律 师费用及诉讼费用后，由居间人划转至各个出借人。</p>
                        <p>9、若借款方逾期还款是由于互联网自身不稳定性（包括但不限于黑客攻击、电</p>
                        <p>信设备故障、网络供应商技术故障等）而导致的，居间人不承担任何责任。</p>
                        <p>10、发生下列任何一项或几项情形的，视为借款人违约：</p>
                        <p>（1）借款人违反本合同中的任何条款；</p>
                        <p>（2）借款人本人因丧失民事行为能力、被宣告失踪、死亡；</p>
                        <p>（3）借款人下落不明、死亡或丧失民事行为能力后无继承人或其法定继承人、受遗赠人、监护人或财产代管人拒绝为借款人履行偿还借款本息的义务；</p>
                        <p>（4）根据担保条款的约定（如有），因担保人（物）发生变故，致使担保人需提前履行义务或出借人提前处分抵（质）押物的；</p>
                        <p>（5）借款人未按合同规定用途使用借款；</p>
                        <p>（6）借款人拒绝或阻挠出借人、居间人或居间人委托的第三方对借款使用情况进行监督检查；</p>
                        <p>（7）借款人向出借人、居间人提供虚假的证明材料；</p>
                        <p>（8）借款人与其他法人或经济组织签订有损出借人权益的合同和协议；</p>
                        <p>（9）设有第三方保证或（和）抵（质）押的借款合同（如有），保证人违反保证合同或丧失承担连带责任能力，或（和）抵押人（出质人）违反抵（质）押合同， 或抵（质）押物因意外毁损不足以清偿本合同项下的借款本息时，借款人无法落实符合出借人要求的新保证或新的抵（质）押；</p>
                        <p>（10）借款人出现欠息或逾期情况。</p>
                        <p>11）借款人涉嫌刑事犯罪，被依法限制人身自由、被刑事拘留、逮捕，可能判刑的或已经判刑的；</p>
                        <p>（12）借款人套取借款相互借贷牟取非法收入的。</p>
                        <p>（13）借款人或担保人（如有）转移、处分全部或大部分可供贷款人方便执行承担还款责任的财产，失去偿债能力、担保还款能力的；</p>
                        <p>（14）借款人发生其它足以影响其偿债能力或缺乏偿债诚意的行为及其他可能影响归还贷款人借款本息的行为。</p>
                        <p>（15）借款人在借款后出现逃避、拒绝沟通或拒绝承认欠款事实等恶意行为的；</p>
                        <p>11、出借人在此不可撤销地委托授权居间人在借款人出现本条第10项所述的情形或根据居间人合理判断借款人可能发生本条第10项所述的情形时，居间人有权自行采取本条列明的救济措施中的任何一项或几项，以保护出借人的合法权益：</p>
                        <p>（1）立即暂缓、取消发放全部或部分借款；</p>
                        <p>（2）宣布已发放借款全部提前到期，借款方应立即偿还所有应付款；</p>
                        <p>（3）解除本合同；</p>
                        <p>（4）采取法律、法规以及本合同约定的其他救济措施</p>
                        <p>12、因借款人逾期还款及其他违约行为，导致出借人、债权受让人等依据本合同对借款人进行追讨、起诉时，借款人除应支付欠款本息、逾期违约金等费用外，还应支付出 借人、债权受让人等因此产生的各种费用，包括但不限于：律师费、往返追讨、诉讼产生的交通差旅费、调查费、财产保全费、诉讼费、公证费、催讨广告费、担保费等所有合理开支均由借款人承担。</p>
                        <p>八、债权转让</p>
                        <p>1、借款人同意，出借人依据宝象金融平台规则和本合同约定将本合同项下的债权转让与第三人的，由出借人委托宝象金融平台通过向借款人注册时填写的注册邮箱、绑定的手机号码发送债权转让通知书，或通过站内信方式发送债权转让通知，即视为通知已经送达。</p>
                        <p>2、在出借人的债权转让后，借款人需对新债权人继续履行本合同下其对出借人的所有义务，不得以未接到债权转让通知为由拒绝履行还款义务。</p>
                        <p>九、特别条款</p>
                        <p>1、借款人不得将所借款项用于任何违法活动（包括但不限于赌博、吸毒、贩毒、卖淫嫖娼等），否则一经发现，出借人和或居间人有权立即向公安等有关行政机关举报，追回赃款并追究借款人的刑事责任。</p>
                        <p>2、借款人不得将所借款项用于生产经营和消费以外的范畴（包括但不限于股票，基金，期货等金融产品的投资，房地产及房地产信托投资，彩票）。</p>
                        <p>3、本借款合同中的每一出借人与借款人之间的借款均是相互独立的，一旦借款人逾期未归还借款本息，任何一出借人有权单独对该出借人未收回的借款本息向借款人追索或者提起诉讼。</p>
                        <p>4、出借人出借本金所获得的收益（包括但不限于利息和罚息等）应纳税款由出借人自行申报及缴纳。</p>
                        <p>5、居间人既不是借贷关系主体，也不是该借贷关系中的担保方或保证方。因借款人违反本合同造成出借人任何损失，居间人不向出借人承担任何风险和责任。</p>
                        <p>十、法律适用和管辖</p>
                        <p>1、本合同的签订、履行、终止或解释均适用中华人民共和国法律，本合同项下任一条款如与中华人民共和国法律中的强制性规范相抵触，应在该等强制性规范所不禁止的最大限度内进行解释和执行，且任何该等与强制性规范相抵触的约定不应影响本合同其他条款的效力。</p>
                        <p>2、如因本合同的签订、履行、终止或解释产生任何争议，各方应友好协商解决。协商不成的，任何一方有权向上海市浦东新区人民法院提起诉讼。</p>
                        <p>3、在诉讼期间，本合同中不涉及争议的条款仍须履行，各方均不得以解决争议为由拒不履行其在本合同项下的任何义务。</p>
                        <p>十一、其他</p>
                        <p>1、本合同经出借人和借款人在宝象金融平台以线上点击确认的方式，居间人在后台确认的方式订立。本合同各方委托居间人保管所有与合同有关的书面文件或电子信息。</p>
                        <p>2、本合同采用电子文本形式制成，并在宝象金融平台保留存档；双方同意，双方有争议的，则以宝象金融平台所保留的文档版本以及居间人的解释为准。</p>

                        <p className="font-weight">附件：</p>
                        <table>
                            <tbody>
                            <tr>
                                <th>还款日期</th>
                                <th>应还本金/元</th>
                                <th>应还利息/元</th>
                            </tr>
                            <tr>
                                <td>{H.time.timeStamp(this.props.data.expire_date).date}</td>
                                <td>{this.props.param.apply_data.loan_money/100}</td>
                                <td>{this.props.param.apply_data.interest/100}</td>
                            </tr>
                            </tbody>
                        </table>
                        <p className="font-weight">风险提示：借款人与出借人遵循：“借贷自愿、诚实守信、责任自负、风险自担”原则承担借贷风险。</p>

                        <p>借款人：{data.identity_data.name}</p>
                        <p>出借人：</p>
                        <p>居间人：上海宝象金融信息服务有限公司</p>
                        <p>签订时间：</p>
                        <p>签订地点：上海市浦东新区</p>
                    </div>
                );
            }
        }

        return (
            <div id="LoanContract" className="loan-contract">
                <div className="scroller">
                    {xml}
                </div>
            </div>
        );
    }
}

export default LoanContract;