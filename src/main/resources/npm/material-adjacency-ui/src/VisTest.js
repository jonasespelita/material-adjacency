import React, { Component, Fragment } from "react";

import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries,
  LabelSeries
} from "react-vis";
import "react-vis/dist/style.css";

export default class VisTest extends Component {
  render() {
    const axisStyle = {
      ticks: {
        fontSize: "14px",
        color: "#333"
      },
      title: {
        fontSize: "16px",
        color: "#333"
      }
    };

    return (
      <Fragment>
        <FlexibleWidthXYPlot animation height={500}>
          <VerticalGridLines />
          <XAxis
            hideLine
            title="X"
            labelFormat={v => `Value is ${v}`}
            labelValues={[2]}
            tickValues={[1, 1.5, 2, 3]}
            style={axisStyle}
          />

          <LabelSeries
            
            allowOffsetToBeReversed
            data={[
              { x: 1, y: 10, label: "woah!", style: { fontSize: 10 } },
              { x: 2, y: 5, label: "dope city", yOffset: 5 },
              { x: 3, y: 15, label: "cool Dog friend", xOffset: 5, rotation: 34 }
            ]}
          />

          <YAxis hideTicks />
          <LineSeries
          curve={'curveMonotoneX'}
            data={[{ x: 1, y: 10 }, { x: 2, y: 5 }, { x: 3, y: 15 }]}
          />
           <LineSeries
           curve={'curveMonotoneX'}
            data={[{ x: 3, y: 8 }, { x: 2, y: 5 }, { x: 4, y: 12 }]}
          />
        </FlexibleWidthXYPlot>
 
      </Fragment>
    );
  }
}
