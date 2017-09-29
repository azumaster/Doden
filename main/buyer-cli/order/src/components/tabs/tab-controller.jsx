import React from 'react';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import SwipeableViews from 'react-swipeable-views';
import TabContent from './content.jsx';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 10,
    height: 510,
    background: 'skyblue',
  },
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
    };
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  }

  render() {
    return (
      <div>
        <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}
          className={"aaa"}
          initialSelectedIndex={2}
          inkBarStyle={{background:"red"}}
          style={{background:"black"}}
        >
          <Tab label="tab one" value={0} />
          <Tab label="tab two" value={1} />
          <Tab label="tab Three" value={2} />
          <Tab label="tab Four" value={3} />
        </Tabs>
        <SwipeableViews
          disabled={false}
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <div id="a" style={styles.slide}>
            <TabContent/>
          </div>

          <div style={styles.slide}>
            slide n2
          </div>

          <div style={styles.slide}>
            slide n3
          </div>

          <div style={styles.slide}>
            slide n4
          </div>
        </SwipeableViews>
      </div>
    );
  }
}

export default Main;

