export const testJsonData = {
  glgData: [
    {
      id: "1000",
      lot: "9999999",
      logpoint: "4000",
      entity: "E765",
      facility: "TIPI",
      transactionDate: "2018-06-01 10:54",
      parent: null
    },
    {
      id: "1001",
      lot: "9999999",
      logpoint: "3900",
      entity: "F145",
      facility: "TIPI",
      transactionDate: "2018-05-30 08:30",
      parent: "1001"
    },
    {
      id: "1002",
      lot: "8888888",
      logpoint: "3900",
      entity: "F146",
      facility: "TIPI",
      transactionDate: "2018-05-30 07:30",
      parent: "1000"
    },
    {
      id: "1003",
      lot: "7777777",
      logpoint: "3800",
      entity: "A980",
      facility: "TIPI",
      transactionDate: "2018-05-29 11:45",
      parent: "1002"
    },
    {
      id: "1004",
      lot: "6666666",
      logpoint: "3700",
      entity: "B145",
      facility: "TIPI",
      transactionDate: "2018-05-28 03:45",
      parent: "1003"
    },
    {
      id: "1005",
      lot: "5555555",
      logpoint: "3700",
      entity: "B146",
      facility: "TIPI",
      transactionDate: "2018-05-28 03:47",
      parent: "1003"
    },
    {
      id: "1006",
      lot: "7777777",
      logpoint: "3700",
      entity: "B146",
      facility: "TIPI",
      transactionDate: "2018-05-28 13:45",
      parent: "1003"
    }
  ],

  logpointOrder: [
    {
      logpoint: "3700",
      logpointDesc: "MARK SINGULATE"
    },
    {
      logpoint: "3800",
      logpointDesc: "DIE ATTACH"
    },
    {
      logpoint: "3900",
      logpointDesc: "MOLD"
    },
    {
      logpoint: "4000",
      logpointDesc: "WIRE BOND"
    }
  ],

  entityData: [
    {
      entity: "E765",
      contFailPercent: "0.0",
      adjacentLots: [
        {
          lot: "9999991",
          contFailPercent: "0.0004",
          goodBad: "G",
          transDateOnEntity: "2018-06-01 10:54"
        },
        {
          lot: "9999992",
          contFailPercent: "0.0001",
          goodBad: "G",
          transDateOnEntity: "2018-06-01 10:56"
        },
        {
          lot: "9999993",
          contFailPercent: "0.0001",
          goodBad: "G",
          transDateOnEntity: "2018-06-01 11:00"
        },
        {
          lot: "9999999",
          contFailPercent: "0.0000",
          goodBad: "G",
          transDateOnEntity: "2018-06-01 11:07"
        }
      ]
    },
    {
      entity: "F145",
      contFailPercent: "0.75",
      adjacentLots: [
        {
          lot: "9999994",
          contFailPercent: "0.0014",
          goodBad: "B",
          transDateOnEntity: "2018-05-30 10:54"
        },
        {
          lot: "9999995",
          contFailPercent: "0.0016",
          goodBad: "B",
          transDateOnEntity: "2018-05-30 10:54"
        },
        {
          lot: "9999996",
          contFailPercent: "0.0014",
          goodBad: "B",
          transDateOnEntity: "2018-05-30 10:54"
        },
        {
          lot: "9999999",
          contFailPercent: "0.0005",
          goodBad: "G",
          transDateOnEntity: "2018-05-30 11:07"
        }
      ]
    }
  ]
};
