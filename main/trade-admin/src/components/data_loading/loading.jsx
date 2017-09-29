import React from 'react';

class DataLoading extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="loadingToast" className="data-loading-toast">
                <div className="data-mask-transparent"></div>
                <div className="data-toast">
                    <div className="data-loading">
                        <div className="data-loading-leaf data-loading-leaf-0"></div>
                        <div className="data-loading-leaf data-loading-leaf-1"></div>
                        <div className="data-loading-leaf data-loading-leaf-2"></div>
                        <div className="data-loading-leaf data-loading-leaf-3"></div>
                        <div className="data-loading-leaf data-loading-leaf-4"></div>
                        <div className="data-loading-leaf data-loading-leaf-5"></div>
                        <div className="data-loading-leaf data-loading-leaf-6"></div>
                        <div className="data-loading-leaf data-loading-leaf-7"></div>
                        <div className="data-loading-leaf data-loading-leaf-8"></div>
                        <div className="data-loading-leaf data-loading-leaf-9"></div>
                        <div className="data-loading-leaf data-loading-leaf-10"></div>
                        <div className="data-loading-leaf data-loading-leaf-11"></div>
                    </div>
                    <p className="data-toast-content">数据加载中</p>
                </div>
            </div>
        );
    }
}

export default DataLoading;