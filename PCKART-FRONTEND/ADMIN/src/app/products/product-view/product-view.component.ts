import { Component, Inject , OnInit} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FileHandle } from 'src/app/_model-dto/file-handle.model';
import { ProductDTO } from 'src/app/_model-dto/product/productDTO';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {

  productDto: ProductDTO<any,any>;
  selectedProductIndex = 0;

  constructor(
    private activatedRoute: ActivatedRoute
    // @Inject(MAT_DIALOG_DATA)  public data: FileHandle,
    ){}

  ngOnInit(): void {
    this.productDto = this.activatedRoute.snapshot.data['productDto'];
    // this.receiveImages()
    console.log(this.productDto)
  }

  changeIndex(index: number){
    this.selectedProductIndex = index;
  }

  receiveImages(){
    // console.log(this.data);
  }

}
