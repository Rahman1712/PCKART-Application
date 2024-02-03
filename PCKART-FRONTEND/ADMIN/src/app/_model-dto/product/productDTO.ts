import { ProductResponse } from "./productResponse";

export interface ProductDTO<T,D>{
  productResponse: ProductResponse | undefined
  imgdata: T
  imgModel: D
}


/*
"imgModel": 
        {
            "id": 1,
            "filePath": "path\\images\\1\\",
            "imgName": "aio-b.png",
            "imgType": "image/png"
        }

*/