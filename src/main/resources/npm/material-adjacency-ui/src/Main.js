import React, { Component } from "react";
import "./Main.css";

import { Graph } from "react-d3-graph";

import { Sankey } from "react-vis";

import { ResponsiveSankey } from "@nivo/sankey";
import * as d3 from "d3";

import VisTest from "./VisTest";

// graph payload (with minimalist structure)
const data = {
  nodes: [
    { id: "12312", x: 200, y: 100 },
    { id: "125125", x: 20, y: 30 },
    { id: "236427", x: 20, y: 150 }
  ],
  links: [
    { source: "12312", target: "236427" },
    { source: "125125", target: "12312" }
  ]
};

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
  nodeHighlightBehavior: true,
  node: {
    color: "lightgreen",
    size: 520,
    highlightStrokeColor: "blue"
  },
  link: {
    highlightColor: "lightblue"
  },
  staticGraph: true
};

const nodes = [
  { name: "213098484", x0: 100, x1: 100 },
  { name: "124124", x0: 399 },
  { name: "124126", x0: 399 },
  { name: "1241267", x0: 399 },
  { name: "23535" }
];
const links = [
  { source: 0, target: 1, value: 10 },
  { source: 0, target: 2, value: 10 },
  { source: 1, target: 3, value: 5 },
  { source: 1, target: 4, value: 5 },
  { source: 2, target: 3, value: 5 },
  { source: 2, target: 4, value: 5 },
  { source: 3, target: 4, value: 10 }
];

export default class Main extends Component {
  componentDidMount() {
    const y = d3.scaleLinear().range([520, 0]);
    const vis = d3.select("#sample-graph-graph-wrapper svg g");

    const nodes = [{ x: 30, y: 50 }, { x: 50, y: 80 }, { x: 90, y: 120 }];
    vis
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-123)
          .tickFormat("")
      );
  }

  render() {
    return (
      <main role="main" className="col-md-10 ml-sm-auto col-lg-10">
        <div style={{ height: 400 }}>
          <VisTest />
        </div>
        <Graph id="sample-graph" data={data} config={myConfig} />
        <div id="test" />
        <Sankey nodes={nodes} links={links} width={500} height={500} />
        <div className="pt-3 px-4">
          <h1>Hello World</h1>
        </div>
        <div style={{ height: 400 }}>
          <ResponsiveSankey
            data={{
              nodes: [
                {
                  id: "John",
                  color: "hsl(216, 70%, 50%)"
                },
                {
                  id: "Raoul",
                  color: "hsl(93, 70%, 50%)"
                },
                {
                  id: "Jane",
                  color: "hsl(250, 70%, 50%)"
                },
                {
                  id: "Marcel",
                  color: "hsl(18, 70%, 50%)"
                },
                {
                  id: "Ibrahim",
                  color: "hsl(149, 70%, 50%)"
                },
                {
                  id: "Junko",
                  color: "hsl(186, 70%, 50%)"
                },
                {
                  id: "Lyu",
                  color: "hsl(193, 70%, 50%)"
                },
                {
                  id: "André",
                  color: "hsl(19, 70%, 50%)"
                },
                {
                  id: "Maki",
                  color: "hsl(97, 70%, 50%)"
                },
                {
                  id: "Véronique",
                  color: "hsl(67, 70%, 50%)"
                },
                {
                  id: "Thibeau",
                  color: "hsl(215, 70%, 50%)"
                },
                {
                  id: "Josiane",
                  color: "hsl(192, 70%, 50%)"
                },
                {
                  id: "Raphaël",
                  color: "hsl(84, 70%, 50%)"
                }
              ],
              links: [
                {
                  source: "Maki",
                  target: "Josiane",
                  value: 88
                },
                {
                  source: "Maki",
                  target: "Lyu",
                  value: 125
                },
                {
                  source: "Ibrahim",
                  target: "André",
                  value: 16
                },
                {
                  source: "Ibrahim",
                  target: "John",
                  value: 84
                },
                {
                  source: "Raphaël",
                  target: "Josiane",
                  value: 15
                },
                {
                  source: "Raphaël",
                  target: "Junko",
                  value: 5
                },
                {
                  source: "André",
                  target: "Maki",
                  value: 16
                },
                {
                  source: "Josiane",
                  target: "Raoul",
                  value: 132
                },
                {
                  source: "Junko",
                  target: "Jane",
                  value: 168
                },
                {
                  source: "Véronique",
                  target: "Jane",
                  value: 101
                },
                {
                  source: "Raoul",
                  target: "John",
                  value: 78
                },
                {
                  source: "Jane",
                  target: "Raoul",
                  value: 161
                },
                {
                  source: "Marcel",
                  target: "Raphaël",
                  value: 68
                },
                {
                  source: "John",
                  target: "Lyu",
                  value: 22
                },
                {
                  source: "Thibeau",
                  target: "Raoul",
                  value: 118
                }
              ]
            }}
            margin={{
              top: 40,
              right: 160,
              bottom: 40,
              left: 50
            }}
            align="justify"
            colors="d310"
            nodeOpacity={1}
            nodeWidth={18}
            nodeBorderColor="inherit:darker(0.8)"
            linkHoverOthersOpacity={0.1}
            enableLinkGradient={true}
            labelPosition="outside"
            labelOrientation="vertical"
            labelPadding={16}
            labelTextColor="inherit:darker(1)"
            animate={true}
            motionStiffness={120}
            motionDamping={11}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                translateX: 130,
                itemWidth: 100,
                itemHeight: 14,
                itemDirection: "right-to-left",
                itemsSpacing: 2,
                itemTextColor: "#999",
                symbolSize: 14,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#000"
                    }
                  }
                ]
              }
            ]}
          />
        </div>
      </main>
    );
  }
}
