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
import com.ar.pckart.product.model.Brand;
import com.ar.pckart.product.util.ProductsUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BrandService {

	private final WebClient webClient;
	private final JwtProductsService jwtProductsService;
	
	@Value("${brand.service.api.url.add}")
	private String BRAND_SERVICE_URL_ADD;
	
	@Value("${brand.service.api.url.delete}")
	private String BRAND_SERVICE_URL_DELETE;
	
	@Value("${brand.service.api.url.update}")
	private String BRAND_SERVICE_URL_UPDATE;

	
	public Brand addBrand(MultipartFile file, String name) {
		MultiValueMap<String, Object> formData = new LinkedMultiValueMap<>();
		formData.add("file", new FileSystemResource(ProductsUtils.convertMultipartFileToFile(file)));
		formData.add("name", name);
		
		Brand brand = webClient.post()
		.uri(BRAND_SERVICE_URL_ADD)
		.header(HttpHeaders.AUTHORIZATION,
				"Bearer "+jwtProductsService.generateToken(ProductsUtils.getAuthenticationUsername()))
		.header("Username", ProductsUtils.getAuthenticationUsername())
		.accept(MediaType.APPLICATION_JSON)
		.contentType(MediaType.MULTIPART_FORM_DATA)
		.body(BodyInserters.fromMultipartData(formData))
		.retrieve()
		.onStatus(HttpStatusCode::isError, response-> ProductsUtils.handleErrorResponse(response))
		.bodyToMono(Brand.class)
		.block();
		
		ProductsUtils.deleteAllFilesInFolderAfterStream();
		
		return brand;
	}


	public String updateBrand(Long id, String name, MultipartFile file) {
		MultiValueMap<String, Object> formData = new LinkedMultiValueMap<>();
		formData.add("file", new FileSystemResource(ProductsUtils.convertMultipartFileToFile(file)));
		formData.add("name", name);
		
		String updateMessage = webClient.put()
		.uri(BRAND_SERVICE_URL_UPDATE+id)
		.header(HttpHeaders.AUTHORIZATION,
				"Bearer "+jwtProductsService.generateToken(ProductsUtils.getAuthenticationUsername()))
		.header("Username", ProductsUtils.getAuthenticationUsername())
		.accept(MediaType.APPLICATION_JSON)
		.contentType(MediaType.MULTIPART_FORM_DATA)
		.body(BodyInserters.fromMultipartData(formData))
		.retrieve()
		.onStatus(HttpStatusCode::isError, response-> ProductsUtils.handleErrorResponse(response))
		.bodyToMono(String.class).block();
		
		ProductsUtils.deleteAllFilesInFolderAfterStream();
		
		return updateMessage;
	}


	public String deleteBrand(Long id) {
		return webClient.delete()
				.uri(BRAND_SERVICE_URL_DELETE+id)
				.header(HttpHeaders.AUTHORIZATION,
						"Bearer "+jwtProductsService.generateToken(ProductsUtils.getAuthenticationUsername()))
				.header("Username", ProductsUtils.getAuthenticationUsername())
				.retrieve()
				.onStatus(HttpStatusCode::isError, response-> ProductsUtils.handleErrorResponse(response))
				.bodyToMono(String.class)
				.block();
	}
	
	
	
}
