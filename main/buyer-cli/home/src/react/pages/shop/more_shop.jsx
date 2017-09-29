/**
 * 店铺搜索页
 * 店铺列表用的shopList这个组件
 * @author: 魏华东
 */

import ShopList from './../search/ShopList.jsx';

class MoreShop extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        let route = '/more',
            keyWords = '',
            areaId = '2';

        return (
            <ShopList route={route} keyWords={keyWords} areaId={areaId} type="more" />
        );
    }
}

export default MoreShop;