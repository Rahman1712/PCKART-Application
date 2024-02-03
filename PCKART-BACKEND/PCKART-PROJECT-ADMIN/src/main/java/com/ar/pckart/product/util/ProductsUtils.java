package com.ar.pckart.product.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.ClientResponse;

import com.ar.pckart.admin.config.ErrorResponse;
import com.ar.pckart.product.service.ProductServiceException;

import reactor.core.publisher.Mono;

public class ProductsUtils {
	
	//@Value("${images.folder.path}")
	private static String FOLDER_PATH = "path\\images\\";

	public static String getAuthenticationUsername() {
		Authentication authentication = SecurityContextHolder
				.getContext().getAuthentication();
		return authentication.getName();
	}
	
	public static Mono<? extends Throwable> handleErrorResponse(ClientResponse response) {
		return response.bodyToMono(ErrorResponse.class)
				.flatMap(errorBody -> {
					return Mono.error(new ProductServiceException(errorBody));
				});
	}

	public static File convertMultipartFileToFile(MultipartFile multipartFile) {
        File directory = new File(FOLDER_PATH);
        if (!directory.exists()) {
            directory.mkdirs();
        }
		File convertedFile = new File(FOLDER_PATH+multipartFile.getOriginalFilename());
		try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
			fos.write(multipartFile.getBytes());
		} catch (IOException e) {
			System.err.println("Multipart File Convert Error");
		}
		return convertedFile;
	}
	
	public static void deleteAllFilesInFolderAfterStream() {
		File directory = new File(FOLDER_PATH);
		for(String fileName : directory.list()) { // delete all inside files
			File currentFile = new File(directory.getPath(),fileName);
			currentFile.delete();
		}
		directory.delete();
	}
}
