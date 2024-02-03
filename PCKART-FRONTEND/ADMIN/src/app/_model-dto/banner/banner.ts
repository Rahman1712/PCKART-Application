import { FileHandle } from "../file-handle.model";
import { ProductResponse } from "../product/productResponse";

export class Banner{
  id: string;
  bannerHeader: string;
  description1: string;
  description2: string;
  bannerImage: any;
  imageName: string;
  imageType: string;
  // productId: number;
  // productName: string;
  product: any;
  enabled: boolean;

  bannerImageFile: FileHandle;
}


	// private Long id;
	// private String name;
	// private Brand brand; 
	// private double price;
	// private int quantity;
	// private float discount;
	// private Category category;
	// private String color;
	// private String description;
	// private Map<String,String> specs;
	// private LocalDateTime added_at;  
	// private boolean active = true;