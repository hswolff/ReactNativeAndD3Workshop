import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as d3Array from 'd3-array';

const d3 = {
  scale,
  shape,
};

export function createLineGraph({
  data,
  xAccessor,
  yAccessor,
  width,
  height,
}) {
  const lastDatum = data[data.length - 1];

  const scaleX = d3.scale.scaleTime()
    .domain([new Date(data[0].time * 1000), new Date(lastDatum.time * 1000)])
    .range([0, width]);

  // Collect all y values.
  const allYValues = data.reduce((all, datum) => {
    all.push(yAccessor(datum));
    return all;
  }, []);

  // Get the min and max y value.
  const extentY = d3Array.extent(allYValues);
  const scaleY = d3.scale.scaleLinear()
    .domain([extentY[0], extentY[1]]).nice()
    // We invert our range so it outputs using the axis that React uses.
    .range([height, 0]);

  const lineShape = d3.shape.line()
    .x(d => scaleX(xAccessor(d)))
    .y(d => scaleY(yAccessor(d)));

  return {
    path: lineShape(data),
  };
}
