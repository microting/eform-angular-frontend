import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiBaseService} from 'src/app/common/services';
import {OperationDataResult, OperationResult} from 'src/app/common/models';
import {
  CalendarBoardModel,
  CalendarTaskCreateModel,
  CalendarTaskModel,
  CalendarTaskUpdateModel,
  RepeatDeleteScope,
  RepeatEditScope,
} from '../models';

export let BackendConfigurationPnCalendarMethods = {
  TasksWeek: 'api/backend-configuration-pn/calendar/tasks/week',
  Tasks: 'api/backend-configuration-pn/calendar/tasks',
  MoveTask: 'api/backend-configuration-pn/calendar/tasks/move',
  Boards: 'api/backend-configuration-pn/calendar/boards',
};

@Injectable({providedIn: 'root'})
export class BackendConfigurationPnCalendarService {
  constructor(private apiBaseService: ApiBaseService) {}

  getTasksForWeek(
    propertyId: number,
    weekStart: string,
    weekEnd: string,
    boardIds: number[],
    tagNames: string[],
    siteIds: number[] = []
  ): Observable<OperationDataResult<CalendarTaskModel[]>> {
    return this.apiBaseService.post(BackendConfigurationPnCalendarMethods.TasksWeek, {
      propertyId,
      weekStart,
      weekEnd,
      boardIds,
      tagNames,
      siteIds,
    });
  }

  createTask(model: CalendarTaskCreateModel): Observable<OperationResult> {
    return this.apiBaseService.post(BackendConfigurationPnCalendarMethods.Tasks, model);
  }

  updateTask(model: CalendarTaskUpdateModel, scope: RepeatEditScope): Observable<OperationResult> {
    return this.apiBaseService.put(BackendConfigurationPnCalendarMethods.Tasks, {...model, scope});
  }

  deleteTask(id: number, scope: RepeatDeleteScope, originalDate: string): Observable<OperationResult> {
    return this.apiBaseService.put(`${BackendConfigurationPnCalendarMethods.Tasks}/delete`, {id, scope, originalDate});
  }

  moveTask(id: number, newDate: string, newStartHour: number): Observable<OperationResult> {
    return this.apiBaseService.put(BackendConfigurationPnCalendarMethods.MoveTask, {id, newDate, newStartHour});
  }

  moveTaskWithScope(
    id: number,
    newDate: string,
    newStartHour: number,
    scope: 'this' | 'thisAndFollowing' | 'all',
    originalDate: string
  ): Observable<OperationResult> {
    return this.apiBaseService.put(BackendConfigurationPnCalendarMethods.MoveTask, {id, newDate, newStartHour, scope, originalDate});
  }

  toggleComplete(taskId: number, completed: boolean): Observable<OperationResult> {
    return this.apiBaseService.put(
      `${BackendConfigurationPnCalendarMethods.Tasks}/${taskId}/complete`,
      {completed}
    );
  }

  getBoards(propertyId: number): Observable<OperationDataResult<CalendarBoardModel[]>> {
    return this.apiBaseService.get(`${BackendConfigurationPnCalendarMethods.Boards}/${propertyId}`);
  }

  createBoard(model: {name: string; color: string; propertyId: number}): Observable<OperationResult> {
    return this.apiBaseService.post(BackendConfigurationPnCalendarMethods.Boards, model);
  }

  updateBoard(model: {id: number; name: string; color: string}): Observable<OperationResult> {
    return this.apiBaseService.put(BackendConfigurationPnCalendarMethods.Boards, model);
  }

  deleteBoard(id: number): Observable<OperationResult> {
    return this.apiBaseService.delete(`${BackendConfigurationPnCalendarMethods.Boards}/${id}`);
  }
}
