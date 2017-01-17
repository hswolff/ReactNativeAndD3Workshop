import React, {
  Component,
  PropTypes,
} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Graph from './Graph';
import ControlButton from './ControlButton';

export default class App extends Component {
  state = {
    showMax: true,
  };

  onChange = (newVal) => {
    const showMax = newVal === 'max';
    if (this.state.showMax !== showMax) {
      this.setState({ showMax });
    }
  };

  setMax = this.onChange.bind(null, 'max');
  setMin = this.onChange.bind(null, 'min');

  render() {
    let yAccessor;
    if (this.state.showMax) {
      yAccessor = d => d.temperatureMax;
    } else {
      yAccessor = d => d.temperatureMin;
    }

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <ControlButton active={this.state.showMax} onPress={this.setMax}>
            Max
          </ControlButton>
          <Graph yAccessor={yAccessor} />
          <ControlButton active={!this.state.showMax} onPress={this.setMin}>
            Min
          </ControlButton>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
