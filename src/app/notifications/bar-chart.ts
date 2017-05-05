import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.html'
})
export class BarChartComponent {
  @Input() data:any;
  @Input() count:number;
  barChartLabels:string[] = [];
  barChartData: any[] = [];
  barChartOptions:any = {};

  ngOnInit() {
    let extractedData = [];
    this.barChartLabels =  Object.keys(this.data);
    
    for(let key in this.data) {
        if(this.data.hasOwnProperty(key)) {
            extractedData.push((Number(this.data[key]) / this.count * 100).toFixed(2));
        }
    }
    this.barChartData = [
      {
              label: 'percentage',
              data: extractedData,
              borderWidth: 1
      }
    ];

    this.barChartOptions = {
    scaleShowVerticalLines: true,
    responsive: true,
    scales: {
            xAxes: [{
                ticks: {
                     min: 0,
                     max: 100,
                     callback: function(value) {
                         return value + "%"
                     }
                 }
            }]
    }
  };
    
  }
  
  public barChartType:string = 'horizontalBar';
  public barChartLegend:boolean = true;
 
  
  
 
}