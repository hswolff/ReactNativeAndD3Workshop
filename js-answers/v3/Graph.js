import React, {
  Component,
  PropTypes,
} from 'react';
import {
  ART,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const {
  Group,
  Shape,
  Surface,
} = ART;

import fixture from './fixtures';
import { createLineGraph } from './graph-utils';

const PaddingSize = 20;
const TickWidth = PaddingSize * 2;

export default class Graph extends Component {
  render() {
    const size = 300;
    const data = createLineGraph({
      data: fixture.daily.data,
      width: size,
      height: size,
      xAccessor: d => new Date(d.time * 1000),
      yAccessor: d => d.temperatureMax,
    });

    const tickXFormat = data.scale.x.tickFormat(null, '%b %d');

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

        <View key={'ticksX'}>
          {data.ticks.map((tick, index) => {
            const tickStyles = {};
            tickStyles.width = TickWidth;
            tickStyles.left = tick.x - (TickWidth / 2);

            return (
              <Text key={index} style={[styles.tickLabelX, tickStyles]}>
                {tickXFormat(new Date(tick.datum.time * 1000))}
              </Text>
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  tickLabelX: {
    position: 'absolute',
    bottom: 0,
    fontSize: 12,
    textAlign: 'center',
  },
});
