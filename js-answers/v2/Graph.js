import React, {
  Component,
  PropTypes,
} from 'react';
import {
  ART,
  StyleSheet,
  View,
} from 'react-native';

const {
  Group,
  Shape,
  Surface,
} = ART;

import fixture from './fixtures';
import { createLineGraph } from './graph-utils';

export default class Graph extends Component {
  render() {
    const size = 200;
    const data = createLineGraph({
      data: fixture.daily.data,
      width: size,
      height: size,
      xAccessor: d => new Date(d.time * 1000),
      yAccessor: d => d.temperatureMax,
    });

    return (
      <View style={styles.container}>
        <Surface width={size} height={size}>
          <Group x={0} y={0}>
            <Shape
              d={data.path}
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
