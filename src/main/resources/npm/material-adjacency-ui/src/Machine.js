import React, { Component } from "react";
import LotGenProcessor from "./LotGenProcessorV2";
import glgData from "./json/response-data-export.json";

import './Machine.css'

import {
  FlexibleWidthXYPlot,
  XAxis,
  VerticalGridLines,
  LineSeries,
  LabelSeries,
  MarkSeries
} from "react-vis";
import "react-vis/dist/style.css";

import Highlight from "./Highlight";

export default class Machine extends Component {
  curveSetting = "curveMonotoneX";

  state = {
    lastDrawLocation: null,
    lpts: [],
    lotPlots: [],
    lineSeries: []
  };
  
  componentDidMount() {
    const { lpts, lotPlots, pathsData } = LotGenProcessor(glgData);

    const lineSeries = pathsData.map((pathData,i) => (
      <LineSeries animation curve={this.curveSetting} data={pathData} key={i}/>
    ));

    this.setState({ lpts, lotPlots, lineSeries });
  }
  render() {
    const { lastDrawLocation, lpts, lotPlots, lineSeries } = this.state;

    return (
      <main role="main" className="col-md-10 ml-sm-auto col-lg-10">
        <div className="row">
          <FlexibleWidthXYPlot
            animation
            height={700}
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
            <VerticalGridLines
              animation
              tickValues={[...Array(lpts.length).keys()].map(i => i * -1)}
            />

            <XAxis
              animation
              tickFormat={(val, idx) => {
                return lpts[val * -1];
              }}
            />

            {lineSeries}

            <MarkSeries data={lotPlots} animation size={5} />
            <LabelSeries
              allowOffsetToBeReversed={false}
              className="lots"
              data={lotPlots}
              animation
              labelAnchorX="middle"
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
