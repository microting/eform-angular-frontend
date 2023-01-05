export enum CaseStatusEnum {
  SavedLocally = 0,
  ReadyForServer = 33,
  ReceivedByServer = 66,
  ReadyForDevice = 70,
  RetrievedByDevice = 77,
  Completed = 100,
  SystemError = 110,
}
