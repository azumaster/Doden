/*
**   给成员设置权限
 */
// import '../../../node_modules/rc-switch/assets/index.css';
// import Switch from 'rc-switch';
// function onChangeSwitch(value) {
//     console.log(`switch checked: ${value}`);
// }
import '../../less/common/switch.css';

class permissions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      permission: [],
      Dom : '',
      displayItem: [
        {
          icon: 'ticket',
          id: 'ticket',
          name: '销售单',
          style: {
            color: '#f05868'
          }
        },
        {
          icon: 'market',
          id: 'market',
          name: '市场管理',
          defaultChecked: false,
          style: {
            color: '#faab44'
          }
        },
        {
          icon: 'goods',
          id: 'goods',
          name: '商品改价',
          style: {
            color: '#a0cf69',
            fontSize: '1.6rem'
          }
        },
        {
          icon: 'blacklist',
          id: 'blacklist',
          name: '商品屏蔽',
          defaultChecked: false,
          style: {
            color: '#3dacfa'
          }
        },
        {
          icon: 'stick',
          id: 'stick',
          name: '商品置顶',
          style: {
            color: '#ff7246',
            fontSize: '1.6rem'
          }
        },
        {
          icon: 'dong',
          id: 'dong',
          name: '冻品商城',
          defaultChecked: false,
          style: {
            color: '#efcee8',
            fontSize: '1.4rem'
          }
        },
        {
          icon: 'shop-info',
          id: 'shop-info',
          name: '店铺信息',
          style: {
            color: '#48aecb',
            fontSize: '1.6rem'
          }
        },
        {
          icon: 'custom',
          id: 'custom',
          name: '客户管理',
          defaultChecked: false,
          style: {
            color: '#657de6'
          }
        },
        // {
        //   icon: 'member',
        //   id: 'member',
        //   name: '成员管理',
        //   style: {
        //     color: '#6acce8'
        //   }
        // },
        {
          icon: 'pay',
          id: 'pay',
          name: '收款管理',
          defaultChecked: false,
          style: {
            color: '#edc921'
          }
        }
      ],
      open_id: '',
      Dom: []
    };
    this.createScroll = this.createScroll.bind(this);
  }

  componentWillMount() {
    this.userPermission();
  }

  componentDidMount() {
    this.createScroll();
  }

  createScroll() {
    let scrollOptions = {
      zoom: true,
      scrollX: false,  //是不中可以横向滚动;
      scrollY: true,  //是否可以纵向滚动;
      mouseWheel: true, //是否监听鼠标滚轮;
      wheelAction: 'zoom',
      probeType: 2,
      preventDefault: false
    };

    var wrapper = document.getElementById('sellerMemberPermissions');
    let SCROLL = new IScroll(wrapper, scrollOptions);

    SCROLL.on('beforeScrollStart', () => {
      SCROLL.refresh();
    });
  }

  userPermission() {
    $.loading.show();
    $.req.userPermission({wechat_openid: $.getValueFromUrl('o_id')}, (res) => {
      $.loading.hide();
      if (parseInt(res.code) === 0) {
        this.setState({
          permission: res.data
        });
        this.setState({
          Dom: this.createElement()
        });
      } else {
        $.loading.hide();
        $.toast({text: res.message, icon: 'info'});
      }
    });
  }

  updatePermission(id, enabled) {

    let auto = setTimeout(() => {
      $.loading.show();
    }, 500);

    $.req.editPermission({
        wechat_openid: $.getValueFromUrl('o_id'),
        permission: id,
        enabled: enabled
      },
      (res) => {
        $.loading.hide();
        clearTimeout(auto);
        if (parseInt(res.code) !== 0) {
          $.loading.hide();
          $.toast({text: res.message, icon: 'info'});
        }
      });
  }

  onChangeSwitch(e) {
    this.updatePermission(e.target.value, e.target.checked ? 1 : 0);
  }
  createElement() {
    let el = [],
      permission = this.state.permission,
      items = this.state.displayItem;
    console.log(permission);
    for (let item in items) {
      console.log(permission.indexOf(items[item].id));
      el.push(
        <div className="permissions-item">
          <div className="flex flex-direction-row justify-center align-items-center permissions-item-content">
            <div className="item-icon">
              <i style={items[item].style} className={'icon ' + items[item].icon}/>
            </div>
            <div className="flex-item item-title">{items[item].name}</div>
            <div className="switch">
              <input
                value={items[item].id}
                className="zdp-switch zdp-switch-anim"
                onChange={this.onChangeSwitch.bind(this)}
                type="checkbox" defaultChecked={permission.indexOf(items[item].id) >= 0}/>
            </div>
          </div>
        </div>
      );
    }
    return el;
  }


  render() {
    return (<div id="sellerMemberPermissions">
      <div className="flex flex-direction-column permissions-content scroller">
        {this.state.Dom}
      </div>
    </div>);
  }
}

export default permissions;