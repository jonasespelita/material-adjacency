import React, { Component, Fragment } from "react";
import { testJsonData } from "./test-json";

import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries,
  LabelSeries,
  MarkSeries
} from "react-vis";
import "react-vis/dist/style.css";

import Highlight from "./Highlight";

export default class Machine extends Component {
  curveSetting = "curveMonotoneY";

  state = {
    lastDrawLocation: null,
    lpts: [],
    lots: [
      { x: 0, y: 15, label: "lot1" },
      { x: 1, y: 15, label: "lot1" },
      { x: 2, y: 15, label: "lot1" },
      { x: 3, y: 15, label: "lot1" },
      { x: 0, y: 14, label: "lot2" },
      { x: 2, y: 14, label: "lot2" },
      { x: 3, y: 14, label: "lot2" },
      { x: 1, y: 13, label: "lot3" },
      { x: 1, y: 12, label: "lot4" }
    ],
    lineSeries: [
      <LineSeries
        animation
        curve={this.curveSetting}
        data={[
          { x: 0, y: 15 },
          { x: 1, y: 15 },
          { x: 2, y: 15 },
          { x: 3, y: 15 }
        ]}
      />,
      <LineSeries
        animation
        curve={this.curveSetting}
        data={[
          { x: 0, y: 15 },
          { x: 1, y: 15 },
          { x: 2, y: 14 },
          { x: 3, y: 14 }
        ]}
      />,
      <LineSeries
        animation
        curve={this.curveSetting}
        data={[{ x: 0, y: 14 }, { x: 2, y: 14 }, { x: 3, y: 14 }]}
      />,
      <LineSeries
        animation
        curve={this.curveSetting}
        data={[{ x: 1, y: 13 }, { x: 2, y: 14 }, { x: 3, y: 14 }]}
      />,
      <LineSeries
        animation
        curve={this.curveSetting}
        data={[{ x: 1, y: 12 }, { x: 2, y: 14 }, { x: 3, y: 14 }]}
      />
    ]
  };

  render() {
    const { lastDrawLocation, lpts, lots, lineSeries } = this.state;

    return (
      <main role="main" className="col-md-10 ml-sm-auto col-lg-10">
        <div className="row">
          <FlexibleWidthXYPlot
            animation
            height={500}
            xPadding={10}
            yPadding={10}
            xDomain={
              lastDrawLocation && [
                lastDrawLocation.left,
                lastDrawLocation.right
              ]
            }
            yDomain={
              lastDrawLocation && [
                lastDrawLocation.bottom,
                lastDrawLocation.top
              ]
            }
          >
            <VerticalGridLines tickValues={[...Array(lpts.length).keys()]} />

            <XAxis
              tickFormat={(val, idx) => {
                return lpts[val];
              }}
            />

            {lineSeries}

            <MarkSeries data={lots} animation size={20} />
            <LabelSeries
              allowOffsetToBeReversed={false}
              className="lots"
              data={lots}
              animation
              labelAnchorX="middle"
              labelAnchorY="middle"
            />

            <Highlight
              onBrushEnd={area => this.setState({ lastDrawLocation: area })}
              onDrag={area => {
                if (lastDrawLocation) {
                  this.setState({
                    lastDrawLocation: {
                      bottom:
                        this.state.lastDrawLocation.bottom +
                        (area.top - area.bottom),
                      left:
                        this.state.lastDrawLocation.left -
                        (area.right - area.left),
                      right:
                        this.state.lastDrawLocation.right -
                        (area.right - area.left),
                      top:
                        this.state.lastDrawLocation.top +
                        (area.top - area.bottom)
                    }
                  });
                }
              }}
            />
          </FlexibleWidthXYPlot>
        </div>

        <div className="row">
          <h1>Data here</h1>
        </div>
      </main>
    );
  }
}
