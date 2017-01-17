/* eslint-disable react/no-array-index-key */
import React, {
  Component,
  PropTypes,
} from 'react';
import {
  ART,
  Dimensions,
  LayoutAnimation,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const {
  Group,
  Shape,
  Surface,
} = ART;

export default class Graph extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Surface width={200} height={200}>
          <Group x={0} y={0}>
            <Shape
              d="M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80"
              stroke="#000"
              strokeWidth={1}
            />
          </Group>
        </Surface>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
});
