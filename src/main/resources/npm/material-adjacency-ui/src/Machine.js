// import glgData from "./json/tc2_complete_data.json";
import glgData from "./json/tc2_complete_data_v2.0.json";

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
  CardText
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
    lineSeries: [],
    crosshairValues: [],
    mode: "zoom",
    highlightedLot: null,
    selectedLot: null
  };

  componentDidMount() {
    const { lpts, lotPlots, pathsData } = LotGenProcessor(glgData);

    const lineSeries = pathsData.map((pathData, i) => (
      <LineSeries animation curve={this.curveSetting} data={pathData} key={i} />
    ));

    this.setState({ lpts, lotPlots, lineSeries });
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
      selectedLot
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
    if (selectedLot) {
      detailsCardContent = (
        <Card body>
          {" "}
          <CardTitle>{selectedLot.label}</CardTitle>
          <CardText>Adjacent Lot Here</CardText>
          <Button onClick={() => this.setState({ selectedLot: null })}>
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

    return (
      <main role="main" className="col-md-11 ml-sm-auto col-lg-11">
        <div className="row mt-1">
          <div className="col-md-5">
            <Form inline>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <ButtonGroup className="mr-sm-2">
                  <Button onClick={() => this.setState({ mode: "zoom" })}>
                    {" "}
                    <FeatherIcon icon="search" />{" "}
                  </Button>{" "}
                  <Button onClick={() => this.setState({ mode: "select" })}>
                    {" "}
                    <FeatherIcon icon="navigation" />
                  </Button>
                </ButtonGroup>{" "}
                <div>{mode}</div>
              </FormGroup>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Input type="input" placeholder="lot input" />
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
                onValueClick={(d, info) => this.setState({ selectedLot: d })}
                // onNearestXY={(value, { index }) => this.onNearestXY(value, index)}
              />

              {mode === "zoom" && highlight}
              {highlightedLot != null && hint}
            </FlexibleWidthXYPlot>
          </div>
          {selectedLot != null && detailsCard}
          <div className="col-md-3" style={{ position: "fixed", right: 0 }}>
            <div className="row" style={{ height: "100%" }}>
              <Card body>
                <CardTitle>Equipment Commonality</CardTitle>
                <CardText>table data goes here</CardText>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Consequuntur esse in, adipisci quia, molestiae voluptates
                  magni, unde ipsam sed deserunt asperiores incidunt tenetur?
                  Laboriosam dolorum, consectetur rerum, nesciunt tempora ipsa.
                </p>
              </Card>
            </div>
          </div>
        </div>
        <div
          className="row mt-1 "
          style={{
            height: "50%",
            position: "fixed",
            bottom: 0,
            width: "92%",
            display: "none"
          }}
        >
          <Card body>
            <CardTitle>Adjacent Lots</CardTitle>
            <CardText>table data goes here</CardText>
            <div style={{ overflowY: "scroll" }}>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur esse in, adipisci quia, molestiae voluptates magni,
                unde ipsam sed deserunt asperiores incidunt tenetur? Laboriosam
                dolorum, consectetur rerum, nesciunt tempora ipsa.
              </p>
            </div>
          </Card>
        </div>
      </main>
    );
  }
}
