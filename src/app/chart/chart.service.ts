import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
//import { ChartState } from '../state/reducers/chart.reducer';
import * as ChartActions from '../state/actions/chart.actions';
import { environment } from 'src/environments/environment';
import { ChartDataModel } from '../state/reducers/chart.reducer';


@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private _httpClient: HttpClient) { }
  getChartData(fromTo) {
    return this._httpClient.post<ChartDataModel[]>(environment.baseUrl + 'Job', fromTo);
  }
}
