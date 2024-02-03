package com.ar.pckart.product.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import com.ar.pckart.admin.config.JwtProductsService;
import com.ar.pckart.product.dto.ProductDetails;
import com.ar.pckart.product.dto.ProductResponse;
import com.ar.pckart.product.model.Product;
import com.ar.pckart.product.util.ProductsUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

	private final WebClient webClient;
	private final JwtProductsService jwtProductsService;

	@Value("${product.service.api.url.add}")
	private String PRODUCT_SERVICE_URL_ADD;
	
	@Value("${product.service.api.url.delete}")
	private String PRODUCT_SERVICE_URL_DELETE;
	
	@Value("${product.service.api.url.update}")
	private String PRODUCT_SERVICE_URL_UPDATE;
	
	@Value("${product.service.api.url.update_active}")
	private String PRODUCT_SERVICE_URL_UPDATE_ACTIVE;
	
	@Value("${product.service.api.url.getbyid}")
	private String PRODUCT_SERVICE_URL_GETBYID;

	public ProductResponse getProductById(Long id) {
		ProductResponse produstResponse = webClient.get()
				.uri(PRODUCT_SERVICE_URL_GETBYID + id)
				.accept(MediaType.APPLICATION_JSON)
				.retrieve()
				.onStatus(HttpStatusCode::isError, response-> ProductsUtils.handleErrorResponse(response))
				.bodyToMono(ProductResponse.class)
				.block();
		return produstResponse;
	}

	public ProductDetails addProduct(MultipartFile file, MultipartFile[] files,
			Product product) {
		
		MultiValueMap<String, Object> formData = new LinkedMultiValueMap<>();
		formData.add("file", new FileSystemResource(ProductsUtils.convertMultipartFileToFile(file)));
		for (int i = 0; i < files.length; i++) {
			formData.add("files", new FileSystemResource(ProductsUtils.convertMultipartFileToFile(files[i])));
		}
		formData.add("product", product);
 
		ProductDetails productDetails = 
				webClient.post()
				.uri(PRODUCT_SERVICE_URL_ADD)
				.header(HttpHeaders.AUTHORIZATION,
						"Bearer "+jwtProductsService.generateToken(ProductsUtils.getAuthenticationUsername()))
				.header("Username", ProductsUtils.getAuthenticationUsername())
				.accept(MediaType.APPLICATION_JSON)
				.contentType(MediaType.MULTIPART_FORM_DATA)
				.body(BodyInserters.fromMultipartData(formData))
				.retrieve()
				.onStatus(HttpStatusCode::isError, response-> ProductsUtils.handleErrorResponse(response))
				.bodyToMono(ProductDetails.class)
				.block();
		
		ProductsUtils.deleteAllFilesInFolderAfterStream();
		
		return productDetails;
	}

	public ProductDetails updateProductById(Long id,
			MultipartFile file, MultipartFile[] files,
			Product product) {
		
		MultiValueMap<String, Object> formData = new LinkedMultiValueMap<>();
		formData.add("file", new FileSystemResource(ProductsUtils.convertMultipartFileToFile(file)));
		for (int i = 0; i < files.length; i++) {
			formData.add("files", new FileSystemResource(ProductsUtils.convertMultipartFileToFile(files[i])));
		}
		formData.add("product", product);

		ProductDetails productDetails = webClient.put()
				.uri(PRODUCT_SERVICE_URL_UPDATE+id)
				.header(HttpHeaders.AUTHORIZATION,
						"Bearer "+jwtProductsService.generateToken(ProductsUtils.getAuthenticationUsername()))
				.header("Username", ProductsUtils.getAuthenticationUsername())
				.accept(MediaType.APPLICATION_JSON)
				.contentType(MediaType.MULTIPART_FORM_DATA)
				.body(BodyInserters.fromMultipartData(formData))
				.retrieve()
				.onStatus(HttpStatusCode::isError, response-> ProductsUtils.handleErrorResponse(response))
				.bodyToMono(ProductDetails.class).block();

		ProductsUtils.deleteAllFilesInFolderAfterStream();
		
		return productDetails;
	}

	public String deleteProductById(Long id) {
		return webClient.delete()
		.uri(PRODUCT_SERVICE_URL_DELETE+id)
		.header(HttpHeaders.AUTHORIZATION,
				"Bearer "+jwtProductsService.generateToken(ProductsUtils.getAuthenticationUsername()))
		.header("Username", ProductsUtils.getAuthenticationUsername())
		.retrieve()
		.onStatus(HttpStatusCode::isError, response-> ProductsUtils.handleErrorResponse(response))
		.bodyToMono(String.class)
		.block();
	}

	public String updateActiveById(Long id, boolean active) {
		return webClient.put()
				.uri(PRODUCT_SERVICE_URL_UPDATE_ACTIVE+id+"/"+active)
				.header(HttpHeaders.AUTHORIZATION,
						"Bearer "+jwtProductsService.generateToken(ProductsUtils.getAuthenticationUsername()))
				.header("Username", ProductsUtils.getAuthenticationUsername())
				.retrieve()
				.onStatus(HttpStatusCode::isError, response-> ProductsUtils.handleErrorResponse(response))
				.bodyToMono(String.class)
				.block();
	}
	
	
}

