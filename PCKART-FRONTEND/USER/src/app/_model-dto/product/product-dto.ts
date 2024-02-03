import { ProductResponse } from "./product-response"

export interface ProductDTO<T>{
  productResponse: ProductResponse
  imgdataModel: T
}


/*
"imgdataModel": 
        {
            "id": 1,
            "image": "f52sdg535fnfsf",
            "imgName": "aio-b.png",
            "imgType": "image/png"
        }

*/