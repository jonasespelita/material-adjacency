// import glgData from "./json/tc2_complete_data.json";
import glgData from "./json/tc2_complete_data_v2.4.json";

import _ from "lodash";
import React, { Component } from "react";
import LotGenProcessor from "./LotGenProcessorV2";
import {
  Button,
  ButtonGroup,
  Input,
  Form,
  FormGroup,
  Row,
  Col,
  Card,
  CardTitle,
  CardText,
  Table
} from "reactstrap";
import FeatherIcon from "feather-icons-react";

import "./Machine.css";

import {
  Hint,
  FlexibleWidthXYPlot,
  XAxis,
  VerticalGridLines,
  LineSeries,
  LabelSeries,
  MarkSeries,
  Crosshair
} from "react-vis";
import "react-vis/dist/style.css";

import Highlight from "./Highlight";

export default class Machine extends Component {
  curveSetting = "curveMonotoneX";

  state = {
    lastDrawLocation: null,
    lpts: [],
    lotPlots: [],
    equipPlots: [],
    lineSeries: [],
    crosshairValues: [],
    mode: "zoom",
    highlightedLot: null,
    selectedEquip: null,
    showCommonalitySidebar: false
  };

  componentDidMount() {
    const { lpts, lotPlots, pathsData, equipPlots } = LotGenProcessor(glgData);

    const lineSeries = pathsData.map((pathData, i) => (
      <LineSeries animation curve={this.curveSetting} data={pathData} key={i} />
    ));

    this.setState({ lpts, lotPlots, lineSeries, equipPlots });
  }

  setToolTips(value) {
    this.setState({
      crosshairValues: [{ x: value.x }, { x: 0 }],
      highlightedLot: value
    });
  }

  onMouseLeave() {
    this.setState({ crosshairValues: [], highlightedLot: null });
  }

  ///////////////////
  // Do the render //
  ///////////////////
  render() {
    const {
      lastDrawLocation,
      lpts,
      lotPlots,
      lineSeries,
      mode,
      highlightedLot,
      selectedEquip,
      equipPlots
    } = this.state;

    let hintContent;
    if (highlightedLot) {
      hintContent = (
        <div>
          <b>{highlightedLot.label}</b>
          <div>Equipment: {highlightedLot.details.equipment}</div>
          <div>Logpoint: {highlightedLot.details.lpt}</div>
          <div>Date: {highlightedLot.details.tranDttm}</div>
        </div>
      );
    }

    const padHighlightCoord = coord => {
      if (!coord) {
        return null;
      }
      return { x: coord.x, y: coord.y };
    };

    const hint = (
      <Hint value={padHighlightCoord(highlightedLot)}>
        <div className="my-tooltip">
          <div className="my-tooltiptext">{hintContent}</div>
        </div>
      </Hint>
    );

    const highlight = (
      <Highlight
        onBrushEnd={area => this.setState({ lastDrawLocation: area })}
        onDrag={area => {
          if (lastDrawLocation) {
            this.setState({
              lastDrawLocation: {
                bottom:
                  this.state.lastDrawLocation.bottom + (area.top - area.bottom),
                left:
                  this.state.lastDrawLocation.left - (area.right - area.left),
                right:
                  this.state.lastDrawLocation.right - (area.right - area.left),
                top: this.state.lastDrawLocation.top + (area.top - area.bottom)
              }
            });
          }
        }}
      />
    );

    let detailsCardContent;
    if (selectedEquip) {
      detailsCardContent = (
        <Card body>
          <CardTitle>{selectedEquip.label}</CardTitle>
          <CardText>Adjacent Lot Here</CardText>
          <Button onClick={() => this.setState({ selectedEquip: null })}>
            Close
          </Button>
        </Card>
      );
    }
    const detailsCard = (
      <div style={{ position: "fixed", top: 100, right: 10, width: "800px" }}>
        {detailsCardContent}
      </div>
    );

    let adjacentLotsCard;
    if (selectedEquip) {
      console.log(selectedEquip);
      const adjacentLotsTableRows = selectedEquip.details.equip.adjacentLots.map(
        (lot, i) => (
          <tr key={i}>
            <th>{lot.adjacentLot}</th>
            <td>{lot.equipment}</td>
            <td>{lot.startDttm}</td>
            <td>{lot.loginDttm}</td>
            <td>{lot.lastActDttm}</td>
            <td>{lot.currentLogpoint}</td>
            <td>{lot.lastLogpoint}</td>
          </tr>
        )
      );
      adjacentLotsCard = (
        <div
          className="row mt-1 "
          style={{
            height: "50%",
            position: "fixed",
            bottom: 0,
            width: "92%"
          }}
        >
          <Card body style={{ height: "100%" }}>
            <CardTitle>
              Equipment Details: {selectedEquip.label}{" "}
              <Button
                size="sm"
                onClick={() => this.setState({ selectedEquip: null })}
              >
                close
              </Button>
            </CardTitle>
            <CardText>
              Commonality:{" "}
              <b> {selectedEquip.details.equip.commonalityPercent}%</b>
              <br />
              <b>Adjacent Lots</b>{" "}
            </CardText>
            <div style={{ overflowY: "scroll" }}>
              <Table striped>
                <thead>
                  <tr>
                    <th>Lot</th>
                    <th>Equipment</th>
                    <th>Start Datetime</th>
                    <th>Login Datetime</th>
                    <th>Last Activity</th>
                    <th>Current Lpt</th>
                    <th>Last Lpt</th>
                  </tr>
                </thead>
                <tbody>{adjacentLotsTableRows}</tbody>
              </Table>
            </div>
          </Card>
        </div>
      );
    }

    const equipmentCommonalityDataRows = _.sortBy(
      equipPlots,
      e => e.details.equip.commonalityPercent * -1
    ).map((equipPlot, i) => (
      <tr key={i}>
        <td>{equipPlot.details.lpt.logpoint}</td>
        <td>{equipPlot.details.lpt.operation}</td>
        <td>{equipPlot.details.equip.equipment}</td>
        <td>{equipPlot.details.equip.commonalityPercent}</td>
      </tr>
    ));

    let commonalitySideBar = (
      <div
        className="col-md-5"
        style={{ position: "fixed", right: 0, height: "100%" }}
      >
        <div className="row" style={{ height: "100%" }}>
          <Card body>
            <CardTitle>Equipment Commonality</CardTitle>
            <div style={{ overflowY: "scroll" }}>
              <Table striped>
                <thead>
                  <tr>
                    <th>Lpt</th>
                    <th>Operation</th>
                    <th>Equipment</th>
                    <th>Commonality %</th>
                  </tr>
                </thead>
                <tbody>{equipmentCommonalityDataRows}</tbody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    );
    return (
      <main role="main" className="col-md-11 ml-sm-auto col-lg-11">
        <div className="row mt-1">
          <div className="col-md-6">
            <Form inline>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <ButtonGroup className="mr-sm-2">
                  <Button
                    color={this.state.mode == "zoom" ? "primary" : "secondary"}
                    onClick={() => this.setState({ mode: "zoom" })}
                  >
                    <FeatherIcon icon="search" />{" "}
                  </Button>{" "}
                  <Button
                    color={
                      this.state.mode == "select" ? "primary" : "secondary"
                    }
                    onClick={() => this.setState({ mode: "select" })}
                  >
                    <FeatherIcon icon="navigation" />
                  </Button>
                </ButtonGroup>
                <div>{mode}</div>
              </FormGroup>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Input type="input" placeholder="lot input" />
              </FormGroup>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Button
                  color={
                    this.state.showCommonalitySidebar ? "primary" : "secondary"
                  }
                  onClick={() =>
                    this.setState({
                      showCommonalitySidebar: !this.state.showCommonalitySidebar
                    })
                  }
                >
                  {" "}
                  <FeatherIcon icon="sidebar" />
                </Button>
              </FormGroup>
            </Form>
          </div>
          <div className="col-md-2" />
        </div>

        <div className="row">
          <div className="col-md-12">
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
              onMouseLeave={() => this.onMouseLeave()}
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

              <MarkSeries
                data={lotPlots}
                animation
                size={5}
                onValueMouseOut={() => this.onMouseLeave()}
                onValueClick={(d, info) => console.log(d, info)}
                onValueMouseOver={point => this.setToolTips(point)}
              />

              <LabelSeries
                allowOffsetToBeReversed={false}
                className="lots"
                data={lotPlots}
                animation
                labelAnchorX="middle"
                // onNearestXY={(value, { index }) => this.onNearestXY(value, index)}
              />

              <LabelSeries
                allowOffsetToBeReversed={false}
                className="equipments"
                data={equipPlots}
                animation
                labelAnchorX="middle"
                onValueClick={(d, info) => this.setState({ selectedEquip: d })}
                rotation={34}
                // onNearestXY={(value, { index }) => this.onNearestXY(value, index)}
              />

              {mode === "zoom" && highlight}
              {highlightedLot != null && hint}
            </FlexibleWidthXYPlot>
          </div>
          {this.state.showCommonalitySidebar && commonalitySideBar}
        </div>
        {selectedEquip && adjacentLotsCard}
      </main>
    );
  }
}
