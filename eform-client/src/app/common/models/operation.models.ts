export class OperationResult {
  constructor(public success: boolean, public message: string) {
  }
}

export class OperationDataResult<T> extends OperationResult {
  constructor(public success: boolean, public message: string, public model: T) {
    super(success, message);
  }
}
