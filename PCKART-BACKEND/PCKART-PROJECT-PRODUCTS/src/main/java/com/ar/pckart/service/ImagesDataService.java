package com.ar.pckart.service;

import java.io.IOException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ar.pckart.model.ImageModel;
import com.ar.pckart.model.ImagesData;
import com.ar.pckart.repo.ImageModelRepo;
import com.ar.pckart.repo.ImagesDataRepo;
import com.ar.pckart.util.ImageUtils;

@Service
public class ImagesDataService {
	
	@Autowired private ImagesDataRepo imageDataRepo;
	@Autowired private ImageModelRepo imageModelRepo;

	public ImagesData saveImages(MultipartFile imageFile, 
			MultipartFile[] subImagesFiles ,
			Long productId) throws IOException {
		
		ImagesData imgData = new ImagesData();
		imgData.setProductId(productId);
		
        if(imageFile != null) {
        	ImageModel mainImgMode = ImageModel.builder()
        		.image(ImageUtils.compress(imageFile.getBytes()))
        		.imgName("PROD_MAIN_"+productId)  //.imgName(imageFile.getOriginalFilename())
        		.imgType(imageFile.getContentType())
        		.build();
        	imgData.setProductMainImage(mainImgMode);
        }
        
        Set<ImageModel> subImagesModelSet = new HashSet<>(); 
        for(int i=0; i< subImagesFiles.length; i++) {
        	if(subImagesFiles[i] != null) {
        		ImageModel subImageModel = ImageModel.builder()
        				.image(ImageUtils.compress(subImagesFiles[i].getBytes()))
                		.imgName("PROD_SUB_"+productId+"_"+i)  //.imgName(subImagesFiles[i].getOriginalFilename())
                		.imgType(subImagesFiles[i].getContentType())
                		.build();
        		subImagesModelSet.add(subImageModel);
        	}
        }
        imgData.setProductSubImages(subImagesModelSet);
        
		return imageDataRepo.save(imgData);
	}

	public Optional<ImagesData> findImageDataByParentId(Long parentId){
		return imageDataRepo.findByProductId(parentId);
	}
	
	public ImagesData updateImages(MultipartFile imageFile,
	        MultipartFile[] subImagesFiles,
	        Long productId) throws IOException {

	    Optional<ImagesData> imageDataOptional = findImageDataByParentId(productId);
	    if (!imageDataOptional.isPresent()) {
	        throw new IllegalArgumentException("ImagesData entity not found for productId: " + productId);
	    }
	    ImagesData imgData = imageDataOptional.get();

	    // Delete the associated images
	    deleteImagesInDB(imgData);

	    // Update the productMainImage
	    if (imageFile != null) {
	        ImageModel mainImgMode = ImageModel.builder()
	        		.image(ImageUtils.compress(imageFile.getBytes()))
	                .imgName("PROD_MAIN_"+productId)  //.imgName(imageFile.getOriginalFilename())
	                .imgType(imageFile.getContentType())
	                .build();
	        imgData.setProductMainImage(mainImgMode);
	    }

	    // Update the productSubImages
	    Set<ImageModel> subImagesModelSet = new HashSet<>();
	    for (int i = 0; i < subImagesFiles.length; i++) {
	        if (subImagesFiles[i] != null) {
	            ImageModel subImageModel = ImageModel.builder()
	            		.image(ImageUtils.compress(subImagesFiles[i].getBytes()))
	                    .imgName("PROD_SUB_"+productId+"_"+i)  // .imgName(subImagesFiles[i].getOriginalFilename())
	                    .imgType(subImagesFiles[i].getContentType())
	                    .build();
	            subImagesModelSet.add(subImageModel);
	        }
	    }
	    imgData.setProductSubImages(subImagesModelSet);

	    return imageDataRepo.save(imgData);
	}
	
	//THIS DELETE FOR UPDATION AND DELETION
	private void deleteImagesInDB(ImagesData imageData) {  
		// Delete the associated productMainImage
        if (imageData.getProductMainImage() != null) {
            ImageModel mainImage = imageData.getProductMainImage();
            imageData.setProductMainImage(null); // Remove the association
            imageDataRepo.save(imageData); // Save the updated ImagesData entity
            imageModelRepo.delete(mainImage); // Delete the associated ImageModel
        }
        // Delete the associated productSubImages
        Set<ImageModel> subImages = imageData.getProductSubImages();
        if (subImages != null && !subImages.isEmpty()) {
            imageData.setProductSubImages(null); // Remove the association
            imageDataRepo.save(imageData); // Save the updated ImagesData entity
            imageModelRepo.deleteAll(subImages); // Delete the associated ImageModels
        }
	}

	public void deleteImageDataAndFolder(Long productid) {
	    Optional<ImagesData> imageDataOptional = imageDataRepo.findByProductId(productid);
	    if (imageDataOptional.isPresent()) {
	        ImagesData imageData = imageDataOptional.get();
	        
	        deleteImagesInDB(imageData);
	        
	        // Delete the ImagesData entity
	        imageDataRepo.deleteById(imageData.getImageid());
	    }
	} 
}
