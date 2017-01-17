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

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Graph />
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
