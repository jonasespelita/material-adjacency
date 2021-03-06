import _ from "lodash";

const LotGenProcessor = jsonData => {
  const lotPlots = [];
  const lpts = [];
  const pathsData = [];
  const equipPlots = [];

  console.log(jsonData);
  const glg = jsonData.glgData;
  console.log({ glg });

  //////////////////
  // process lpts //
  //////////////////
  const lptPlots = jsonData.logpointOrder.map((lpt, i) => {
    return {
      id: lpt.id,
      lpt: lpt.logpoint,
      operation: lpt.operation,
      name: `${lpt.logpoint}-${lpt.operation}`,
      x: i - jsonData.logpointOrder.length + 1
    };
  });
  console.log({ lptPlots });
  lpts.push(..._.reverse(lptPlots.map(lptPlot => lptPlot.name)));

  ///////////////////////
  // process equipment //
  ///////////////////////
  jsonData.logpointOrder.forEach((lpt, i) => {
    const equipments = lpt.equipments;
    let equipY = 0;
    equipments.forEach((equip, j) => {
      equipPlots.push({
        x: i - jsonData.logpointOrder.length + 1,
        y: equipY * -1,
        label: equip.equipment,
        lots: equip.lotIds,
        details: {equip,lpt}
      });
      equipY += equip.lotIds.length + 1;
    });
  });
  console.log({ equipPlots });

  let mLotY = 0;
  let curMLotY = 0;
  ///////////////////////
  // process geneology //
  ///////////////////////
  glg.forEach((lot, i) => {
    // derive lpt from id
    lot.lpt = lptPlots.find(lptPlot => lptPlot.id === lot.lptOpnSeqId).lpt;
    if (_.isEmpty(lot.parentIds)) {
      ////////////////
      // mother lot //
      ////////////////
      const curEquipPlot = equipPlots.find(
        equipPlot =>
          equipPlot.label === lot.equipment &&
          _.includes(equipPlot.lots, lot.id)
      );
      const y =
        curEquipPlot.y -
        curEquipPlot.lots.findIndex(equipLotId => equipLotId === lot.id) -
        1;

      const x = lptPlots.find(lptPlot => lptPlot.id == lot.lptOpnSeqId).x;
      console.log("plotting", lot, { x: 0, y: curMLotY });
      lotPlots.push({
        x,
        y,
        label: lot.lot,
        details: lot
      });
    } else {
      ///////////////
      // child lot //
      ///////////////

      // find child's plotted parents
      const pLotIdxs = lotPlots.reduce((pLotIdxs, lotPlot, idx) => {
        if (lot.parentIds.find(parentId => parentId === lotPlot.details.id)) {
          pLotIdxs.push({ pLot: lotPlot, pIdx: idx });
        }
        return pLotIdxs;
      }, []);

      // debug relationship
      pLotIdxs.forEach(pLotIdx => {
        const { pLot } = pLotIdx;
        console.log(
          `${pLot.details.id}|${pLot.details.lot} => ${lot.id}|${lot.lot}`
        );
      });

      if (_.isEmpty(pLotIdxs)) {
        console.error("lot parent was not plot!", lot);
      } else {
        /////////////////////////////
        // generate coords for lot //
        /////////////////////////////

        // x = match designated lptOpnSeqId
        const x = lptPlots.find(lptPlot => lptPlot.id == lot.lptOpnSeqId).x;

        // y = match desidnated equip + plotted length
        // const y =
        //   lotPlots
        //     .filter(lotPlot => lotPlot.x === x)
        //     .reduce(
        //       (minY, lotPlot) => Math.min(curMLotY + 1, minY, lotPlot.y),
        //       curMLotY + 1
        //     ) - 1;

        const curEquipPlot = equipPlots.find(
          equipPlot =>
            equipPlot.label === lot.equipment &&
            _.includes(equipPlot.lots, lot.id)
        );
        const y =
          curEquipPlot.y -
          curEquipPlot.lots.findIndex(equipLotId => equipLotId === lot.id) -
          1;

        console.log("plotting", lot, { x, y });
        lotPlots.push({ x, y, label: `${lot.lot}`, details: lot });

        // update mLotY in case next lot is a mother lot
        mLotY = Math.min(mLotY, y);

        //////////////////////////////////
        // generate lines for pLot->lot //
        //////////////////////////////////

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
              return lastCoord.x == pLotCoord.x && lastCoord.y == pLotCoord.y;
            } else {
              return false;
            }
          });

          if (pathData) {
            // append child coord
            pathData.push({ x, y });
          } else {
            // create from parent to child
            pathsData.push([{ x: pLotCoord.x, y: pLotCoord.y }, { x, y }]);
          }
        });
      }
    }
  });

  return { equipPlots, lpts, lotPlots, pathsData };
};

export default LotGenProcessor;
