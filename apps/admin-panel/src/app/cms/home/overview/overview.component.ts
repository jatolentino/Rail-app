import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from '@antv/g2';
import { ApolloQueryResult } from '@apollo/client/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartTimeframe, IncomeChartGQL, OverviewQuery, RequestsChartGQL } from '@rail/admin-panel/generated/graphql';
import { firstValueFrom, map, Observable } from 'rxjs';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html'
})
export class OverviewComponent implements OnInit {
  query?: Observable<ApolloQueryResult<OverviewQuery>>;
  incomeMode = ChartTimeframe.Yearly;
  requestMode = ChartTimeframe.Yearly;
  public chartTimeframe = ChartTimeframe;

  private chartRequests!: Chart;
  private chartIncome!: Chart;

  isChartIncomeEmpty = false;
  isChartRequestsEmpty = false;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private route: ActivatedRoute,
    private incomeChartGQL: IncomeChartGQL,
    private requestsChartGQL: RequestsChartGQL,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.query = this.route.data.pipe(map(data => data.overview));
    this.refreshIncome();
    this.refreshRequests();
  }

  async refreshIncome() {
    const result = await firstValueFrom(this.incomeChartGQL.fetch({ timeframe: this.incomeMode }));
    this.isChartIncomeEmpty = (result.data.incomeChart.items.length == 0);
    if (this.isChartIncomeEmpty) {
      this.chartIncome.clear();
      return;
    }
    const timeFormat = this.getTimeFormatForQuery(this.incomeMode);
    result.data.incomeChart.items.forEach(result => {
      result.time = formatDate(result.time, timeFormat, this.locale);
      result.sum = parseFloat(result.sum.toFixed(2));
    });
    this.chartIncome.data(result.data.incomeChart.items);
    this.chartIncome.interval().position('time*sum').color('currency');
    this.chartIncome.render();
    this.chartIncome.interaction('active-region');
  }

  async refreshRequests() {
    const result = await firstValueFrom(this.requestsChartGQL.fetch({ timeframe: this.requestMode }));
    this.isChartRequestsEmpty = (result.data.requestChart.items.length == 0);
    if (this.isChartRequestsEmpty) {
      this.chartRequests.clear();
      return;
    }
    const timeFormat = this.getTimeFormatForQuery(this.requestMode);
    result.data.requestChart.items.forEach(result => {
      result.time = formatDate(result.time, timeFormat, this.locale);
      result.count = parseFloat(result.count.toString());
      result.status = this.translateService.instant(`enum.request.${result.status}`)
    });
    this.chartRequests.data(result.data.requestChart.items);
    this.chartRequests.interval().adjust('stack').position('time*count').color('status');
    this.chartRequests.render();
    this.chartRequests.interaction('active-region');
  }

  getTimeFormatForQuery(q: ChartTimeframe): string {
    switch (q) {
      case (ChartTimeframe.Daily):
        return 'h"';
      case (ChartTimeframe.Weekly):
        return 'W,y';
      case (ChartTimeframe.Monthly):
        return 'M/d';
      case (ChartTimeframe.Yearly):
        return 'MMM y';
    }
  }

  colorForCount(count: number) {
    if (count == 0) {
      return '#87d068';
    } else if (count < 10) {
      return 'orange';
    } else {
      return '#CF1322';
    }
  }

  onChartRequestsInit(chartInstance: Chart): void {
    this.chartRequests = chartInstance;
  }

  onChartIncomeInit(chartInstance: Chart): void {
    this.chartIncome = chartInstance;
  }
}