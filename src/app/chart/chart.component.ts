import { Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FromToModel } from '../models/fromToModel';
import { getChartData, loadChartData } from '../state/actions/chart.actions';
import { selectChart } from '../state/reducers/chart.reducer';
import { ChartService } from './chart.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

declare var $: any;
declare const google;

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.less']
})
export class ChartComponent implements OnInit {

  constructor(private chartService: ChartService, private _store: Store, private responsive: BreakpointObserver) {
    let t = this;
    google.charts.load('visualization', '1', { 'packages': ['line', 'corechart'] });
    google.charts.setOnLoadCallback(function () { t.googleLoaded = true; });

    this.responsive.observe(Breakpoints.HandsetPortrait)
      .subscribe(result => {
        this.isPhonePortrait = false; 

        if (result.matches) {
          this.isPhonePortrait = true;
        }

  });
  }

  private ngUnsubscribe: Subject<any> = new Subject();

  mappedToArray;
  dates;
  googleLoaded: boolean = false;
  fromToModel: FromToModel = new FromToModel();
  noData: boolean = true;
  isPhonePortrait:boolean = false;
  dateFormat:string = 'dd/mm/yy'

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.drawChart();
  }

  ngOnInit(): void {
    this.getData();
    this._store.select(selectChart).subscribe((res) => {
      if (res && res.length) {
        this.noData = false
        this.dates = res.map(x => new Date(x.Date));
        this.mappedToArray = res.map(d => [new Date(d.Date), d.ActiveJobs, d.ComulativeJobView, d.ComulativePredictedeJobView]);
        this.mappedToArray = [['Date', 'Active Jobs', 'Comulative Job View', 'Comulative Predictede Job View'], ...this.mappedToArray];
        setTimeout(() => {
          this.drawChart();
        }, 10);
      }
      else
        this.noData = true;
    });

  }

  getData() {
    let fromTo = { ...this.fromToModel };
    this._store.dispatch(loadChartData({ fromTo: fromTo }));
  }



  drawChart() {
    if (!this.googleLoaded) {
      setTimeout(() => {
        this.drawChart();
      }, 1000);
    }
    else {
      var data = google.visualization.arrayToDataTable(this.mappedToArray);

      var date_formatter = new google.visualization.DateFormat({
        pattern: "MMM dd, yyyy"
      });
      date_formatter.format(data, 0);

      var classicOptions = {
        legend: { position: 'bottom', alignment: 'center' },
        chartArea: {
          top: 50,
          height: '40%' 
        },
        title: 'Cumulative job views vs.prediction',
        pointSize: 10,
        focusTarget: 'category',
        colors: ['#5E5E5E', "#8FBC8F", '#247BA0'],
        // Gives each series an axis that matches the vAxes number below.
        series: {
          0: { targetAxisIndex: 1, type: 'bars' },
          1: { targetAxisIndex: 0, },
          2: { targetAxisIndex: 0, pointShape: 'circle', lineDashStyle: [2, 2] },
        },
        vAxes: {
          // Adds titles to each axis.
          0: { title: 'Job Views' },
          1: { title: 'Jobs' }
        },
        hAxis: {
          gridlines: {
            count: 0,
            color: 'transparent'
          },
          format: 'MMM dd, yyyy',
          ticks: this.dates,
          textStyle: {
            color: 'gray',
            fontSize: 10,
            bold: false
          },
          slantedText: true, slantedTextAngle: 60
        },
        vAxis: {
          gridlines: {
            count: 3
          }
        }
      };

      var chartDiv = document.getElementById('chart_div');
      var classicChart = new google.visualization.LineChart(chartDiv);
      classicChart.draw(data, classicOptions);
    }

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
