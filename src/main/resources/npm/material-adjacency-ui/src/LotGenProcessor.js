import _ from "lodash";

const LotGenProcessor = jsonData => {
	console.log(jsonData);
	const glg = jsonData.glgData;

	// mother lot
	const motherLots = glg.filter(lot => lot.parent === null);
	console.log({ motherLots });

	// child lots
	const childLots = glg.filter(lot => lot.parent !== null);

	console.log({ childLots });

	const lotPlots = [];
	const pathsData = [];

	// plot mother lots
	motherLots.forEach((mLot, i) => {
		console.log({ mLot, i });
		lotPlots.push({
			x: 0,
			y: motherLots.length - i - 1,
			label: mLot.lot,
			details: mLot
		});
	});

	// plot child lots

	while (childLots.length) {
		const curLot = childLots.shift();
		console.log({ curLot });

		// find ur parents
		const pLotIdxs = lotPlots.reduce((pLotIdxs, lotPlot, idx) => {
			if (lotPlot.details.id == curLot.parent) {
				pLotIdxs.push({ pLot: lotPlot, pIdx: idx });
			}
			return pLotIdxs;
		}, []);

		console.log({ pLotIdxs });
		pLotIdxs.forEach(pLotIdx => {
			const { pLot } = pLotIdx;
			console.log(
				`${pLot.details.id}|${pLot.details.lot} => ${curLot.id}|${
					curLot.lot
				}`
			);
		});

		if (pLotIdxs.length) {
			// x = max(x) of pLots + 1
			const x =
				pLotIdxs
					.map(pLotIdx => pLotIdx.pLot.x)
					.reduce((maxX, x) => Math.max(maxX, x)) - 1;

			// y = max(y of current x ) -1
			const y =
				lotPlots
					.filter(lotPlot => lotPlot.x === x)
					.reduce((minY, lotPlot) => Math.min(minY, lotPlot.y), 1) -
				1;

			console.log({
				x,
				y
			});

			lotPlots.push({ x, y, label: curLot.lot, details: curLot });

			// generate lines from parent
			// find existing path to join with

			const pLotCoords = pLotIdxs.map(pLotIdx => {
				return { x: pLotIdx.pLot.x, y: pLotIdx.pLot.y };
			});
			console.log({ pLotCoords });
			pLotCoords.forEach(pLotCoord => {
				// find path where last coord is compatible
				const pathData = pathsData.find(pathData => {
					const lastCoord = _.last(pathData);
					if (lastCoord) {
						return (
							lastCoord.x == pLotCoord.x &&
							lastCoord.y == pLotCoord.y
						);
					} else {
						return false;
					}
				});

				if (pathData) {
					// append child coord
					pathData.push({ x, y });
				} else {
					// create from parent to child
					pathsData.push([
						{ x: pLotCoord.x, y: pLotCoord.y },
						{ x, y }
					]);
				}
			});
		}
	}

	const lpts = _.reverse(jsonData.logpointOrder.map(lpt => lpt.logpoint));

	console.log({ lotPlots });
	console.log({ lpts });
	console.log({ pathsData });
	return { lpts, lotPlots, pathsData };
};

export default LotGenProcessor;
