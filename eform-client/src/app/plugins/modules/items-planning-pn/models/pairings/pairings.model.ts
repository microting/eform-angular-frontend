export class PairingsModel {
  deviceUsers: string[];
  pairings: PairingModel[];
}

export class PairingModel {
  planningId: number;
  planningName: string;
  pairingValues: PairingValueModel[];
}

export class PairingValueModel {
  deviceUserId: number;
  paired: boolean;
  latestCaseStatus: number | null;
}
