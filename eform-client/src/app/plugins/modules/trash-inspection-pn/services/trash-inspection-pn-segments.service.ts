import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models/operation.models';

import {
  SegmentPnModel,
  SegmentPnRequestModel,
  SegmentPnUpdateModel,
  SegmentsPnModel,
} from '../models';
import { ApiBaseService } from 'src/app/common/services';

export let TrashInspectionPnSegmentMethods = {
  Segments: 'api/trash-inspection-pn/segments',
};
@Injectable({
  providedIn: 'root',
})
export class TrashInspectionPnSegmentsService {
  constructor(private apiBaseService: ApiBaseService) {}

  getAllSegments(
    model: SegmentPnRequestModel
  ): Observable<OperationDataResult<SegmentsPnModel>> {
    return this.apiBaseService.get(
      TrashInspectionPnSegmentMethods.Segments,
      model
    );
  }

  getSingleSegment(
    fractionId: number
  ): Observable<OperationDataResult<SegmentPnModel>> {
    return this.apiBaseService.get(
      TrashInspectionPnSegmentMethods.Segments + '/' + fractionId
    );
  }

  updateSegment(model: SegmentPnUpdateModel): Observable<OperationResult> {
    return this.apiBaseService.put(
      TrashInspectionPnSegmentMethods.Segments,
      model
    );
  }

  createSegment(model: SegmentPnModel): Observable<OperationResult> {
    return this.apiBaseService.post(
      TrashInspectionPnSegmentMethods.Segments,
      model
    );
  }

  deleteSegment(segmentId: number): Observable<OperationResult> {
    return this.apiBaseService.delete(
      TrashInspectionPnSegmentMethods.Segments + '/' + segmentId
    );
  }
}
