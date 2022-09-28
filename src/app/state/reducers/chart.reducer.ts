import * as ChartActions from '../actions/chart.actions';
import { createReducer, on, Action, createFeatureSelector, createSelector } from '@ngrx/store';

export interface ChartDataModel {
    Date: string;
    ActiveJobs: number;
    ComulativeJobView: number;
    ComulativePredictedeJobView: number;
}

export const initialState: ReadonlyArray<ChartDataModel> = [];

export const chartReducer = createReducer(
  initialState,
  on(ChartActions.getChartData, (state, { chartData }) => chartData)
);

export const selectChart = createFeatureSelector<ReadonlyArray<ChartDataModel>>('chartData');


