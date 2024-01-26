export interface TimerModel {
  timeLine: Array<BreakModel | BlindModel>;
  currentTimeLineIndex: number;
  isRunning: boolean;
  // time from start of current timeline item
  currentTimeSec: number;
  // how much player has to pay to enter
  entryFee: number;
  entryCap: number;
  players: PlayerModel[];

}

export interface BreakModel {
  durationSec: number;
  type: 'break';
}

export interface BlindModel {
  durationSec: number;
  type: 'blind';
  smallBlind: number;
  bigBlind: number;
}

export interface PlayerModel {
  name: string;
  buyIns: number;
}

// export const placesDistribution = (buyIns: number): Array<number> => {
//   if (buyIns < 10) {
//     return [1];
//   } else if (buyIns < 17) {
//     return [0.6, 0.4];
//   } else if (buyIns < 24) {
//     return [0.5, 0.35, 0.15];
//   } else if (buyIns < 30) {
//     return [0.45, 0.3, 0.15, 0.1];
//   }
//   return [0.4, 0.25, 0.15, 0.1, 0.05];
// }

export interface PrizeDistribution {
  percentage: number;
  buyInsToNextLevel: number;
}

export const placesDistribution = (totalBuyIns: number): Array<PrizeDistribution> => {
  const thresholds = [10, 17, 24, 30];
  const percentageDistributions = [
    [1],
    [0.6, 0.4],
    [0.5, 0.35, 0.15],
    [0.45, 0.3, 0.15, 0.1],
    [0.4, 0.25, 0.15, 0.1, 0.05]
  ];

  let nextLevelThreshold = thresholds.find(threshold => totalBuyIns < threshold) || 0;
  let buyInsToNextLevel = nextLevelThreshold - totalBuyIns;
  buyInsToNextLevel = buyInsToNextLevel > 0 ? buyInsToNextLevel : 0;

  let distributionIndex = thresholds.findIndex(threshold => totalBuyIns < threshold);
  if (distributionIndex === -1) {
    distributionIndex = percentageDistributions.length - 1; // Use the last distribution if over all thresholds
  }

  return percentageDistributions[distributionIndex].map(percentage => ({
    percentage,
    buyInsToNextLevel
  }));
};
