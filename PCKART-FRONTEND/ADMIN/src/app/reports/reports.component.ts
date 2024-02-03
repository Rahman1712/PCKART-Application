import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { ImageProcessingService } from '../_services/image-processing-service.service';
import { UserService } from '../_services/user.service';
import { OrderDTO } from '../_model-dto/order/order-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { PdfGeneratorService } from '../_services/pdf-generator.service';

Chart.register(...registerables);

interface ordersData { date:any, count:number, sum:number, quantity: number};

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit{

  orderDtosList: OrderDTO[] = [];
  orderAllDetailsList: ordersData[] = [];
  duration: any = 'DAILY';

  public ordersList: any[] = [];
  public pageNum: number = 1;
  public limit: number = 10;
  public sortField: string = 'orderDate';
  public sortDir: string = 'desc';
  public totalItems: number;
  public reverseSortDir: string;
  public totalPages: number;
  public startCount: number;
  public endCount: number;

  orderChart: Chart
  ordersChartHeader : string = 'This Month';

  public ordersPdfList: any[] = [];
  
  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessingService,
    private userService: UserService,
    private pdfGeneratorService: PdfGeneratorService,
  ){}
  
  ngOnInit(): void {
    this.getOrdersWithPagination(this.pageNum,this.limit,this.sortField,this.sortDir);
  }


  async loadReportDats(dataTime: any){
    this.ordersList = [];
    this.duration = dataTime;
    this.getOrdersWithPagination(this.pageNum,this.limit,this.sortField,this.sortDir);
  }


    // to create 1 to totalNum sequence array
    range(totalNum: number): number[]{
      return Array(totalNum).fill(0).map((x,index) => index + 1);
    }
    rangeStart(start:number, totalNum: number): number[]{
      return Array(totalNum-start).fill(0).map((x,index) => index + 1+ start);
    }

    public getOrdersWithPagination(pageNum:number,limit: number, sortField: string, sortDir: string){
  
      this.userService.getDayOrderAllDetailsPagination(pageNum, limit, sortField, sortDir, this.duration)
      .subscribe({
        next: (res: any) =>{
          console.log(res);

          // this.ordersList = res.listOrders;

          const ordersData: any[][] = res.listOrders;
          ordersData.forEach(item =>{
            this.ordersList.push({
              date: item[0],
              count: item[1],
              sum: item[2],
              quantity: item[3],
            });
          });

          this.pageNum = res.pageNum;
          this.limit = res.limit;
          this.sortField = res.sortField;
          this.sortDir = res.sortDir;
          this.totalItems = res.totalItems;
          this.reverseSortDir = res.reverseSortDir;
          this.totalPages = res.totalPages;
          this.startCount = res.startCount;
          this.endCount = res.endCount;

          this.fetchDataAndRenderChart(this.duration, this.ordersList);
        },
        error: (error: HttpErrorResponse) =>{
          alert(error.message);
        }
      });
    }


    async fetchDataAndRenderChart(filterType: string, chartData: any) {
      try {
          const chartdata: any[] = chartData;
          //const labeldata: any[] = chartdata.map(item => item[0]);
          // const salesdata: any[] = chartdata.map(item => item[2]);
          let labeldata: any[] = chartdata.map(item => item.date);
          let salesdata: any[] = chartdata.map(item => item.sum);
  
          let label = 'monthly data';
          switch(filterType){
            case 'DAILY':
              label = 'this month sales';
              this.ordersChartHeader = 'This Month';
  
              if(labeldata.length > 0){
                for(let i = 1;i <= new Date(labeldata[labeldata.length-1]).getDay(); i++){
                  let date = new Date();
                  let month = date.getMonth();
                  let year = date.getFullYear();
                  let dateValString =  i < 10 ? (month < 10 ? `${year}-0${month}-0${i}` : `${year}-${month}-0${i}`) : (month < 10 ? `${year}-0${month}-${i}`: `${year}-${month}-${i}`) ;
                  const index = labeldata.indexOf(dateValString);
                  if(index == -1){
                    salesdata.unshift(0)
                  }
                }
              }
  
              labeldata = [];
              for(let i=1 ; i< this.daysInCurrentMonth(); i++){
                labeldata.push(i)
                // let date = new Date();
                //   let month = date.getMonth();
                //   let year = date.getFullYear();
                //   i < 10 ? labeldata.push(`${year}-${month}-0${i}`) : labeldata.push(`${year}-${month}-${i}`) ;
                //   i < 10 ? (month < 10 ? labeldata.push(`${year}-0${month}-0${i}`) : labeldata.push(`${year}-${month}-0${i}`)) :
                //    (month < 10 ? labeldata.push(`${year}-0${month}-${i}`): labeldata.push(`${year}-${month}-${i}`)) ;
              }
  
              break;
            // case 'WEEKLY':
            //   label = 'this week sales';
            //   this.salesChartHeader = 'This Week';
            //   const weekNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            //   if(labeldata.length > 0){
            //     for(let i = 0;i <= weekNames.indexOf(labeldata[labeldata.length-1]); i++){  // day number kittan current
            //       const index = labeldata.indexOf(weekNames[i]);
            //       if(index == -1){
            //         salesdata.unshift(0)
            //       }
            //     }
            //   }
  
            //   labeldata = weekNames;
            //   break;
            case 'MONTHLY':
              label = 'monthly sales in this year';
              this.ordersChartHeader = 'This Year';
              const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
              for(let i = 0;i <= monthNames.indexOf(labeldata[labeldata.length-1]); i++){  // month number kittan current
                const index = labeldata.indexOf(monthNames[i]);
                if(index == -1){
                  salesdata.unshift(0)
                }
              }
  
              labeldata = monthNames;
              break;
            case 'YEARLY':
              label = 'yearly sales';
              this.ordersChartHeader = 'Yearly';
              break;
            default:
              label = 'this month sales';
              this.ordersChartHeader = 'This Month';
              break;
          }
          
          this.RenderChart(label,labeldata, salesdata, 'line', 'linechart');
      } catch (error) {
          console.log(error);
      }
    }

    daysInCurrentMonth(): number{
      let date = new Date();
      let month = date.getMonth();
      let year = date.getFullYear();
  
      return new Date(year, month + 1, 0).getDate();
    }


    RenderChart(label:any, labeldata: any, maindata:any, type:any, id:any) { 
      if(this.orderChart != undefined){ this.orderChart.destroy(); }
      const ctx : any = document.getElementById(id);
  
      this.orderChart = new Chart(ctx, {
        type: type,
        data: {
          labels: labeldata,
          datasets: [{
            label: label,
            data: maindata,
            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              offset: true
              // beginAtZero: true
            },
            x: {
              offset: true
            }
          },
          pan: {
            enabled: true
          }
        }
      });
    }

    generatePDF() {
      this.ordersPdfList = [];
      this.userService.getDayOrderAllDetails(this.duration)
      .subscribe({
        next: (ordersData: any[]) =>{
          ordersData!.forEach(item =>{
            this.ordersPdfList.push({
              date: item[0],
              count: item[1],
              sum: item[2].toFixed(2),
              quantity: item[3],
            });
          });

          const headers = ['date', 'count', 'sum', 'quantity'];
          const filename = 'orders';
          this.pdfGeneratorService.generatePDFWithTable(this.ordersPdfList, headers, filename);
        },
        error: error => console.log(error)
      })

    }

    // async loadDataForPdf(dataTime: any){
    //   this.duration = dataTime;
    //   this.getOrdersWithPagination(this.pageNum,this.limit,this.sortField,this.sortDir);
  
    //   const ordersData = await this.userService.getDayOrderAllDetails(dataTime).toPromise();
    //   ordersData!.forEach(item =>{
    //     this.ordersPdfList.push({
    //       date: item[0],
    //       count: item[1],
    //       sum: item[2],
    //       quantity: item[3],
    //     });
    //   });
     
    // }
  
}


/*

async loadReportDats(dataTime: any){
    this.duration = dataTime;
    this.getOrdersWithPagination(this.pageNum,this.limit,this.sortField,this.sortDir);

    // const ordersData: any[][] = await this.getOrderSalesDetails(dataTime);
    // ordersData.forEach(item =>{
    //   this.orderAllDetailsList.push({
    //     date: item[0],
    //     count: item[1],
    //     sum: item[2],
    //     quantity: item[3],
    //    });
    // });
    // console.log(this.orderAllDetailsList)
  }


  async getOrderSalesDetails(filterType: string): Promise<any[][]> {
    try {
        let response: any;
        
        switch (filterType) {
            case 'DAILY':
                response = await this.userService.getDayOrderAllDetails().toPromise();
                break;
            case 'WEEKLY':
                response = await this.userService.getWeekOrderDetails().toPromise();
                break;
            case 'MONTHLY':
                response = await this.userService.getMonthlyOrderDetails().toPromise();
                break;
            case 'YEARLY':
                response = await this.userService.getDayOrderAllDetails().toPromise();
                break;
            default:
                response = await this.userService.getDailyOrderDetails().toPromise();
                break;
        }
        
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
  }

*/