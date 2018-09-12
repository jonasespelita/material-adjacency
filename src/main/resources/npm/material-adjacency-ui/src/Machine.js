import React, { Component } from "react";
import LotGenProcessor from "./LotGenProcessorV2";
import glgData from "./json/response-data-export.json";
import { Button, ButtonGroup } from "reactstrap";
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
		highlightedLot: null
	};

	setToolTips(value) {
		this.setState({
			crosshairValues: [{ x: value.x }, { x: 0 }],
			highlightedLot: value
		});
	}

	onMouseLeave() {
		this.setState({ crosshairValues: [], highlightedLot: null });
	}

	componentDidMount() {
		const { lpts, lotPlots, pathsData } = LotGenProcessor(glgData);

		const lineSeries = pathsData.map((pathData, i) => (
			<LineSeries animation curve={this.curveSetting} data={pathData} key={i} />
		));

		this.setState({ lpts, lotPlots, lineSeries });
	}
	render() {
		const {
			lastDrawLocation,
			lpts,
			lotPlots,
			lineSeries,
			mode,
			highlightedLot
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
		const hint = (
			<Hint value={highlightedLot}>
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

		return (
			<main role="main" className="col-md-10 ml-sm-auto col-lg-10">
				<div className="row mt-1">
					<div className="col-md-10">
						<Button onClick={() => this.setState({ mode: "zoom" })}>
							{" "}
							<FeatherIcon icon="search" />{" "}
						</Button>{" "}
						<Button onClick={() => this.setState({ mode: "select" })}>
							{" "}
							<FeatherIcon icon="navigation" />
						</Button>{" "}
						<div>{mode}</div>
					</div>
				</div>
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
							onValueMouseOver={point => this.setToolTips(point)}
							onValueMouseOut={() => this.onMouseLeave()}
						/>

						<LabelSeries
							allowOffsetToBeReversed={false}
							className="lots"
							data={lotPlots}
							animation
							labelAnchorX="middle"
							// onNearestXY={(value, { index }) => this.onNearestXY(value, index)}
						/>

						{mode === "zoom" && highlight}
						{highlightedLot != null && hint}
					</FlexibleWidthXYPlot>
				</div>
			</main>
		);
	}
}
