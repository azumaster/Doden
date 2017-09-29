/*
* 底部加载时没有数据可加载显示内容*/

class DataEnd extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <footer className="product-footer">
                <div className="product-footer-info">
                    <p>这已经是我的底线了</p>
                </div>
            </footer>
        );
    }
}

export default DataEnd;