import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { PrService } from '../../services/pr.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cdk-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.scss']
})
export class LineGraphComponent implements OnInit {

  public Total:any;
  
  constructor(private document:PrService) { }

  ngOnInit() {
    setTimeout(() => {
        this.createLineChart();
    },500)

    this.document.PRTotalJan()
    .subscribe(data => {
      let result:any = data;
      this.Total = result;
      console.log(this.Total)
    });
  }
  
  createLineChart() {
    
    let totaldata = [];
    for (const div of this.Total) {
        const prmonth:string = div.month;
        const prtotal:any = div.total;
          totaldata.push(prtotal);
        };

      let chart = new Chart('line-graph', {
                type: 'line',
                data: {
                    labels: ["January", "February", "March", "April", "May", "June", "July", "August","September",'October','November','December'],
                    /*labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug","Sep",'Oct','Nov','Dec'],*/
                    datasets: [{
                        backgroundColor: 'rgba(92, 107, 192, 0.36)',
                        borderColor: 'rgba(92, 107, 192,.5)',
                        data: totaldata,
                        label: 'Total',
                        fill: 'start'
                    }]
                },
                options: {
                    elements : {
                        line: {
                            tension: 0.000001
                        }
                    },
                    legend: {
                        display: false
                    },
                    maintainAspectRatio: false,
                    plugins: {
                        filler: {
                            propagate: false
                        }
                    },
                    title: {
                        display: true,
                        text: ''
                    }
                }
        })
  }

}
