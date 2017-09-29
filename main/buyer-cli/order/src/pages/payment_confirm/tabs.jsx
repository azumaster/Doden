import React from 'react';

class Tabs extends React.Component {
    constructor(props){
        super(props);
    }

    static propTypes = {
        selectIndex : React.PropTypes.number.isRequired,
        handleChange : React.PropTypes.func.isRequired
    }

    render() {
        return (
            <div className="section-region section-tabs">
                {this.props.regions.map(( el, index ) => {
                    return (
                        <a
                            href="#" key={index}
                            className={this.props.selectIndex === index ? 'on' : ''}
                            onClick={() => {this.props.handleChange(el.area_id, index);}}
                        >{el.area_name}</a>
                    );
                })}
            </div>
        );
    }
}

export default Tabs;