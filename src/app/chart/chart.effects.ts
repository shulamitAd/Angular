import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError, exhaustMap } from 'rxjs/operators';
import { getChartData, loadChartData } from '../state/actions/chart.actions';
import { ChartService } from './chart.service';
 
@Injectable()
export class ChartEffects {


  data$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadChartData),
      exhaustMap(action =>
        this.chartService.getChartData(action.fromTo).pipe(
          map(data => getChartData({ chartData:data })),
          catchError(() => EMPTY)
        )
      )
    )
  );
 
  constructor(
    private actions$: Actions,
    private chartService: ChartService
  ) {}
}