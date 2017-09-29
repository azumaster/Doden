/**
 * Created by Doden on 2017.03.08
 */


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noPermission : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbkAAAFdCAMAAACpX+OOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA39pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmM2NmZTQ3YS05NTZkLTQ1NzAtODZiMi0xMzY5NDRiYzNmNWMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkU2QTE2Q0I3RDZDMTFFN0E0QzJCOENBODBEOTVCMkYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkU2QTE2Q0E3RDZDMTFFN0E0QzJCOENBODBEOTVCMkYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjAwNWM0OGUzLTBmNjAtNmU0NS05YzU3LTkyY2EzMjY4YWE5OCIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmNlOWVmZTJhLTQyZWUtMTE3YS04NDBlLWRmZjhlOTI1MjU0NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pid5RpMAAADAUExURcLExMrNzbq7u+rq6tfX1/n5+uLi4vT09NbW1t3d3ebm5vz8/PDw8O7u7pubm+Tk5PLy8uzs7KSkpODg4NHR0efo6LGxsdbY2Obo6OTm5uPk5dTU1Ors7Nrb287Pz+fn5+7w8Onq6+Xl5evr69LT0+np6e3t7e3u7uDi4sfIyPf399TW1u/v79/f3////+Lj5OHh4be4uP7+/vb29vX29vb39/Hy8vP09PPz8/b297+/v/X19fHx8f39/fj4+P///xLZxWAAAABAdFJOU////////////////////////////////////////////////////////////////////////////////////wDCe7FEAAAdCUlEQVR42uydCXeiyraAFUVaMR05xvY9c5UXCObCcUggAy2i//9fPWUssIAqBkXd+651V7cN6uGzdu25GnuQ65QGPAIgBwLkQIAckAMBciBADsiBADkQIAcC5IAcCJADAXJADgTIgQA5ECAH5C4hk9nsvzpQuj5ycvMg/wOUro9c90huCpSulNwYKAE5IAfkgByQuzVyX/93lPGR3L/OHz+B1VWQ+2/zRJYroFV/cmYTI32gVX9y/8GRA4/8Csh94sh9A60r2OeUWZzb7H8B1lXYlrbx+fn55diW48+j8MAK/DkgB+SAHJADckCuHrKE/NyVklscyf0n9RL+Z65Ia0KRRnOTBXLnkP/8+6+S8s+6qaypRfy2gdxlRR9I61wy6dtA7oLCiuvc0vsL5C4mg3UhWayA3EVk9bYuKLIO5C4h83VhaelA7vzSX5cgApA7uxgRtWeyvE0mLCdMkDtNIHdmsRFv4IFfUYm9DdlNWCB3XgmtE5FdUQsfeu8vQO68jlzw5BV7lUN0IXgDjf7T+e2L0vrmgVwRu3KUC9xB5AA9LbbeU8OVV0UHcrS7nL9RSXxOcCu756Oj2+kUtRFKUwBydMIFpuEqt2j+e9AUcdq/GlGZ6kCORvxdqqfnJ7d68RUuhaZ8asTlXx3IUYjvEnwXALey/EVHnjV4bpzKFMhR/PT9Z84XIaf7m+WO9HN7Aa6nX7PgzwKQI5ad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',
      permission : [],
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
          id: 'price',
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
          id: 'mall',
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
        {
          icon: 'member',
          id: 'member',
          name: '成员管理',
          style: {
            color: '#6acce8'
          }
        },
        {
          icon: 'pay',
          id: 'pay',
          name: '收款管理',
          defaultChecked: false,
          style: {
            color: '#edc921'
          }
        }
      ]
    };
  }

  componentWillMount() {
    this.getData();
    document.addEventListener('touchmove', function (e) {
      e.preventDefault();
    }, false);
    sessionStorage.clear();
  }

  toNewPage(url) {
    window.location.href = '#/seller/' + url;
  }

  getData() {

    let auto = setTimeout(() => {
      $.loading.show();
    }, 500);

    $.req.permission({}, (res) => {
      $.loading.hide();
      clearTimeout(auto);
      if (parseInt(res.code) === 0) {
        if ( res.data.length > 0 ) {
          this.setState({
            permission: res.data
          });
          this.setState({
            Dom: this.createElement()
          });
        } else {

          this.setState({
            Dom : <div className="flex flex-direction-column justify-center align-items-center no-permission">
              <img className="grid-col-8" src={this.state.noPermission}/>
              <p>您的权限还未被开启!</p>
              <p>请联系管理员开启权限~</p>
            </div>
          });
        }
      } else {
        $.toast({text: res.message, icon: 'info'});
      }
    });
  }

  createElement() {
    let items = this.state.displayItem,
    el = [];

    for ( let item in items ) {

      if ( this.state.permission.indexOf('all') >= 0 ) {
        el.push(
          <div className="grid-col-4" onClick={this.toNewPage.bind(this, items[item].id)}>
            <div className="seller-home-link text-center">
              <i className={'icon ' + items[item].icon}/><h4>{items[item].name}</h4>
            </div>
          </div>);
      } else {

        if ( this.state.permission.indexOf(items[item].id) >= 0 && items[item].id !== 'member') {
          el.push(
            <div className="grid-col-4" onClick={this.toNewPage.bind(this, items[item].id)}>
              <div className="seller-home-link text-center">
                <i className={'icon ' + items[item].icon}/><h4>{items[item].name}</h4>
              </div>
            </div>);
        }

      }

    }

    return el;
  }

  render() {
    return (<div id="sellerHome">
      <div className="grid-row seller-home">
        {this.state.Dom}
      </div>
    </div>);
  }
}

export default Home;