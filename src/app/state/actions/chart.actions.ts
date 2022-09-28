import { createAction, props } from '@ngrx/store';
import { ChartDataModel } from '../reducers/chart.reducer';


export const getChartData = createAction('[Chart Service] getChartData', props<{ chartData: ReadonlyArray<ChartDataModel> }>());

export const loadChartData = createAction('[Chart Service] loadChartData', props<{ fromTo:any }>());
