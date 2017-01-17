import React, {
  Component,
  PropTypes,
} from 'react';
import {
  ART,
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
} from 'react-native';
import Morph from 'art/morph/path';

const {
  Group,
  Shape,
  Surface,
} = ART;

import fixture from './fixtures';
import { createLineGraph } from './graph-utils';

const PaddingSize = 20;
const TickWidth = PaddingSize * 2;
const graphSize = 300;
const AnimationDurationMs = 500;

export default class Graph extends Component {
  static propTypes = {
    yAccessor: PropTypes.func.isRequired,
  }

  state = {
    path: '',
  }

  componentWillMount() {
    this.computeNextState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.computeNextState(nextProps);
  }

  computeNextState(nextProps) {
    const {
      yAccessor,
    } = nextProps;

    const data = createLineGraph({
      data: fixture.daily.data,
      width: graphSize,
      height: graphSize,
      xAccessor: d => new Date(d.time * 1000),
      yAccessor,
    });

    this.setState({
      linePath: data.path,
      ticks: data.ticks,
      scale: data.scale,
    });

    // The first time this function is hit we need to set the initial
    // this.previousGraph value.
    if (!this.previousGraph) {
      this.previousGraph = data;
    }

    // Only animate if our properties change. Typically this is when our
    // yAccessor function changes.
    if (this.props === nextProps) {
      return;
    }

    const pathFrom = this.previousGraph.path;
    const pathTo = data.path;

    cancelAnimationFrame(this.animating);
    this.animating = null;

    // Opt-into layout animations so our y tickLabel's animate.
    // If we wanted more discrete control over their animation behavior
    // we could use the Animated component from React Native, however this
    // was a nice shortcut to get the same effect.
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        AnimationDurationMs,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      )
    );

    this.setState({
      // Create the ART Morph.Tween instance.
      linePath: Morph.Tween( // eslint-disable-line new-cap
        pathFrom,
        pathTo,
      ),
    }, () => {
      // Kick off our animations!
      this.animate();
    });

    this.previousGraph = data;
  }

  // This is where we animate our graph's path value.
  animate(start) {
    this.animating = requestAnimationFrame((timestamp) => {
      if (!start) {
        // eslint-disable-next-line no-param-reassign
        start = timestamp;
      }

      // Get the delta on how far long in our animation we are.
      const delta = (timestamp - start) / AnimationDurationMs;

      // If we're above 1 then our animation should be complete.
      if (delta > 1) {
        this.animating = null;
        // Just to be safe set our final value to the new graph path.
        this.setState({
          linePath: this.previousGraph.path,
        });

        // Stop our animation loop.
        return;
      }

      // Tween the SVG path value according to what delta we're currently at.
      this.state.linePath.tween(delta);

      // Update our state with the new tween value and then jump back into
      // this loop.
      this.setState(this.state, () => {
        this.animate(start);
      });
    });
  }

  render() {
    const { yAccessor } = this.props;

    const {
      linePath,
      ticks,
      scale,
    } = this.state;

    const tickXFormat = scale.x.tickFormat(null, '%b %d');

    return (
      <View style={styles.container}>
        <Surface width={graphSize} height={graphSize}>
          <Group x={0} y={0}>
            <Shape
              d={linePath}
              stroke="#000"
              strokeWidth={1}
            />
          </Group>
        </Surface>

        <View key={'ticksX'}>
          {ticks.map((tick, index) => {
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

        <View key={'ticksY'} style={styles.ticksYContainer}>
          {ticks.map((tick, index) => {
            const value = yAccessor(tick.datum);

            const tickStyles = {};
            tickStyles.width = TickWidth;
            tickStyles.left = tick.x - Math.round(TickWidth * 0.5);

            tickStyles.top = (tick.y + 2) - Math.round(TickWidth * 0.65);

            return (
              <View key={index} style={[styles.tickLabelY, tickStyles]}>
                <Text style={styles.tickLabelYText}>
                  {value}&deg;
                </Text>
              </View>
            );
          })}
        </View>

        <View key={'ticksYDot'} style={styles.ticksYContainer}>
          {ticks.map((tick, index) => (
            <View
              key={index}
              style={[styles.ticksYDot, {
                left: tick.x,
                top: tick.y,
              }]}
            />
          ))}
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
  ticksYContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  tickLabelY: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'transparent',
  },

  tickLabelYText: {
    fontSize: 12,
    textAlign: 'center',
  },

  ticksYDot: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: 'red',
    borderRadius: 100,
  },
});
