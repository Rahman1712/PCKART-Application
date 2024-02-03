import { Component,OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { ProductDTO } from '../_model-dto/product/productDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { ImageProcessingService } from '../_services/image-processing-service.service';
import { map } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { UserService } from '../_services/user.service';
import { OrderDTO } from '../_model-dto/order/order-dto';
import { OrderStatus } from '../_model-dto/order/order-status';

Chart.register(...registerables);

interface mostsell { id:number, name:string, price:number, quantity: number, revenue: number};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessingService,
    private userService: UserService,
  ){}


  countOfProds : string;
  limit: number = 5;
  recentProductsLimit: ProductDTO<any,any>[];
  mostSellProducts: mostsell[] = [];

  lessQuantityProducts: ProductDTO<any,any>[] = [];
  moreQuantityProducts: ProductDTO<any,any>[] = [];
  mostOrderProducts: any[] = [];

  countOfUsers : number = 0;
  countOfOrders : number = 0;
  salesAmount: number = 0;
  orderDtosList: OrderDTO[] = [];
  orderLimit: number = 10;


  chartdata: any;
  labeldata: any[] = [];
  realdata: any[] = [];

  salesChartHeader : string = 'This Month';
  salesChart: Chart
  
  orderStatusChart: Chart


  ngOnInit(): void {
    this.countOfProductsFunction();
    this.recentProductsFunction();
    this.countOfUsersFunction();
    this.getTotalSumOfPaidTotalPrice();
    this.recentOrdersFunction(this.orderLimit);
    this.getProductsWithQuantitySort(5, 'desc');
    this.getProductsWithQuantitySort(5, 'asc');
    this.getMostSellProducts();
    this.getMostOrderProductsQuantity(5);

    this.fetchDataAndRenderChart('DAY');
    this.orderStatusGraph('pie')
  }
  
  countOfProductsFunction(){
    this.productService.countOfProducts()
    .subscribe({
      next: (response: string) => this.countOfProds = response ,
      error: (error: HttpErrorResponse) => console.log(error.message)
    })
  }

  countOfUsersFunction(){
    this.userService.countOfUsers()
    .subscribe({
      next: (response: number) => this.countOfUsers = response ,
      error: (error: HttpErrorResponse) => console.log(error.message)
    })

    this.userService.countOfOrders()
    .subscribe({
      next: (response: number) => this.countOfOrders = response ,
      error: (error: HttpErrorResponse) => console.log(error.message)
    })
  }
  getTotalSumOfPaidTotalPrice(){
    this.userService.getTotalSumOfPaidTotalPrice().subscribe(salesAmount => this.salesAmount = salesAmount);
  }

  getMostSellProducts(){
    this.userService.getMostSellProducts().subscribe(items =>  //id,name,price,quantity,revenue
    {
      this.mostSellProducts = items.map(item => ({
        id: item[0],
        name: item[1],
        price: item[2],
        quantity: item[3],
        revenue: item[4]
       }));
    });
  }
  
  getMostOrderProductsQuantity(limit: number){
    this.userService.getMostOrderProductsQuantity(limit).subscribe(items =>{  // id,name,quantity
      items.forEach((item,i) => {
        this.productService.getProductDetailsMainImageById(item[0])
        .pipe(
          map((product:ProductDTO<any,any>, i) => 
            this.imageProcessingService.createMainImageToProdDto(product)
          )
        )
        .subscribe({
          next:(productDto: ProductDTO<any,any>) =>{
            this.mostOrderProducts.push({
              id: item[0],
              name: item[1],
              quantity: item[2],
              productDto: productDto
            });
          },
          error: (error: HttpErrorResponse) => console.log(error)
        });
        
      })
    });
  }

  async fetchDataAndRenderChart(filterType: string) {
    try {
        const chartdata: any[][] = await this.getOrderSalesDetails(filterType); 
        //const labeldata: any[] = chartdata.map(item => item[0]);
        // const salesdata: any[] = chartdata.map(item => item[1]);
        let labeldata: any[] = chartdata.map(item => item[0]);
        let salesdata: any[] = chartdata.map(item => item[1]);

        let label = 'monthly data';
        switch(filterType){
          case 'DAY':
            label = 'this month sales';
            this.salesChartHeader = 'This Month';

            if(labeldata.length > 0){
              for(let i = 1;i <= labeldata[labeldata.length-1]; i++){
                const index = labeldata.indexOf(i);
                if(index == -1){
                  salesdata.unshift(0)
                }
              }
            }

            labeldata = [];
            for(let i=1 ; i< this.daysInCurrentMonth(); i++){
              labeldata.push(i)
            }

            break;
          case 'WEEKLY':
            label = 'this week sales';
            this.salesChartHeader = 'This Week';
            const weekNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            if(labeldata.length > 0){
              for(let i = 0;i <= weekNames.indexOf(labeldata[labeldata.length-1]); i++){  // day number kittan current
                const index = labeldata.indexOf(weekNames[i]);
                if(index == -1){
                  salesdata.unshift(0)
                }
              }
            }

            labeldata = weekNames;
            break;
          case 'MONTHLY':
            label = 'monthly sales in this year';
            this.salesChartHeader = 'This Year';
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
            this.salesChartHeader = 'Yearly';
            break;
          default:
            label = 'this month sales';
            this.salesChartHeader = 'This Month';
            break;
        }
        
        this.RenderChart(label,labeldata, salesdata, 'line', 'linechart');
    } catch (error) {
        console.log(error);
    }
  }

  async getOrderSalesDetails(filterType: string): Promise<any[][]> {
    try {
        let response: any;
        
        switch (filterType) {
            case 'DAY':
                response = await this.userService.getDailyOrderDetails().toPromise();
                break;
            case 'WEEKLY':
                response = await this.userService.getWeekOrderDetails().toPromise();
                break;
            case 'MONTHLY':
                response = await this.userService.getMonthlyOrderDetails().toPromise();
                break;
            case 'YEARLY':
                response = await this.userService.getYearlyOrderDetails().toPromise();
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

  RenderChart(label:any, labeldata: any, maindata:any, type:any, id:any) { 
    if(this.salesChart != undefined){ this.salesChart.destroy(); }
    const ctx : any = document.getElementById(id);

    this.salesChart = new Chart(ctx, {
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

  daysInCurrentMonth(): number{
    let date = new Date();
    let month = date.getMonth();
    let year = date.getFullYear();

    return new Date(year, month + 1, 0).getDate();
  }

  recentOrdersFunction(limit: number){
    this.userService.getTopLimitOrdersByOrderDate(limit)
    .subscribe({
      next: (orderList: OrderDTO[]) =>{
        this.orderDtosList = orderList;
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
      }
    })
  }

  recentProductsFunction(){
    this.productService.getTopLimitProductsWithImagesByAddedAt(this.limit)
    .pipe(
      map((x:ProductDTO<any,any>[], i) => 
        x.map((product: ProductDTO<any,any>) => 
          this.imageProcessingService.createMainImageToProdDto(product)
        )
      )
    )
    .subscribe({
      next: (response: ProductDTO<any,any>[]) => {
        console.log(response)
        this.recentProductsLimit = response ;
      },
      error: (error: HttpErrorResponse) => console.log(error.message)
    })
  }

  getProductsWithQuantitySort(limit: number, sort: string = 'asc'){
    this.productService.getProductsWithQuantitySort(limit, sort)
    .pipe(
      map((x:ProductDTO<any,any>[], i) => 
        x.map((product: ProductDTO<any,any>) => 
          this.imageProcessingService.createMainImageToProdDto(product)
        )
      )
    )
    .subscribe({
      next: (response: ProductDTO<any,any>[]) => {
        sort == 'asc' ? this.lessQuantityProducts = response : this.moreQuantityProducts = response ;
      },
      error: (error: HttpErrorResponse) => console.log(error.message)
    })
  }

  bgBadgeSelect(orderStatus: any): string{
    switch(orderStatus){
      case OrderStatus.ORDERED : return 'bg-light text-success';
      case OrderStatus.SHIPPED : return 'bg-primary';
      case OrderStatus.CANCELLED : return 'bg-danger';
      case OrderStatus.PROCESSING : return 'bg-warning';
      case OrderStatus.DELIVERED : return 'bg-success';
      case OrderStatus.RETURN_REQUESTED : return 'bg-secondary';
      case OrderStatus.RETURNED : return 'bg-secondary';
      default : return 'bg-success';
    }
  }

  orderStatusGraph(chartType: any) {
    this.userService.getOrderStatusCounts()
    .subscribe({
      next: (res: any[]) =>{
          const chartdata: any[][] = res;
          const labeldata: any[] = chartdata.map(item => item[0]);
          const realdata: any[] = chartdata.map(item => item[1]);

          const colorData: any[] = [];
          const borderColorData: any[] = [];
          for(let i=0;i<labeldata.length;i++){
            const R = Math.floor(Math.random() * 255) + 1;
            const G = Math.floor(Math.random() * 255) + 1;
            const B = Math.floor(Math.random() * 255) + 1;

            colorData.push(`rgba(${R}, ${G}, ${B}, 0.2)`);
            borderColorData.push(`rgba(${R}, ${G}, ${B}, 1)`);
          }
          
          this.OrderStatusChartFunction('order status data',labeldata, realdata, colorData, borderColorData, chartType, 'orderChart'); // pie bar doughnut polarArea radar
      },
      error: error=> console.log(error)
    });
  }

  OrderStatusChartFunction(label:any, labeldata: any, maindata:any, colorData:any, borderColorData:any, type:any, id:any) {
    if(this.orderStatusChart != undefined){ this.orderStatusChart.destroy(); }
    const ctx : any = document.getElementById(id);

    this.orderStatusChart = new Chart(ctx, {
      type: type,
      data: {
        labels: labeldata,
        datasets: [{
          label: label,
          data: maindata,
          backgroundColor: colorData,
          borderColor: borderColorData,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }


}
