import { FileHandle } from "../file-handle.model";

export class Admin{
  id: number;
	fullname: string;
	email: string;
	mobile: string;
	username: string;
	password: string;
	role: string;
  image: any;
  imageName: string;
  imageType: string;
  enabled: boolean;
  nonLocked: boolean;

  adminImage: FileHandle;
}