package com.ar.pckart.admin.service;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ar.pckart.admin.config.JwtService;
import com.ar.pckart.admin.config.JwtUsersService;
import com.ar.pckart.admin.dto.AdminDTO;
import com.ar.pckart.admin.dto.AuthenticationRequest;
import com.ar.pckart.admin.dto.AuthenticationResponse;
import com.ar.pckart.admin.dto.RegisterRequest;
import com.ar.pckart.admin.model.Admin;
import com.ar.pckart.admin.model.Role;
import com.ar.pckart.admin.repo.AdminRepository;
import com.ar.pckart.admin.util.ImageUtils;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {
	
	private final AdminRepository repository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final JwtUsersService jwtUsersService; // to connect users ms
	private final AuthenticationManager authenticationManager;
	
	public AuthenticationResponse register(RegisterRequest request) {
		var admin = Admin.builder()
				.fullname(request.getFullname())
				.email(request.getEmail())
				.mobile(request.getMobile())
				.username(request.getUsername())
				.password(passwordEncoder.encode(request.getPassword()))
				.role(Role.valueOf(request.getRole()))
				.nonLocked(true)
				.enabled(true)
				.build();

		repository.findByUsername(request.getUsername()).ifPresent(
				u-> {
					throw new AdminLoginException("username "+u.getUsername()+" already exist");
				});
		
		repository.save(admin);
		
		var jwtToken = jwtService.generateToken(new AdminUserDetails(admin));
		return AuthenticationResponse.builder()
				.token(jwtToken)
				.build();
	}

	public AuthenticationResponse authenticate(AuthenticationRequest request) {
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						 request.getUsername(),
						 request.getPassword()
						 )
				);
		
		var admin = repository.findByUsername(request.getUsername())
				.orElseThrow();
		var jwtToken = jwtService.generateToken(new AdminUserDetails(admin));
		return AuthenticationResponse.builder()
				.token(jwtToken)
				.username(admin.getUsername())
				.role(admin.getRole().name())
				.build();
	}
	
	public AdminDTO findById(Long id){
		Admin admin = repository.findById(id).get();
		if(admin.getImage()!=null && admin.getImage().length>0) {
			admin.setImage(ImageUtils.decompress(admin.getImage()));
		}
		return AdminToAdminDto(admin);
	}
	
	public AdminDTO findByUsername(String username) {
		Admin admin = repository.findByUsername(username).get();
		if(admin.getImage()!=null && admin.getImage().length>0) {
			admin.setImage(ImageUtils.decompress(admin.getImage()));
		}
		return AdminToAdminDto(admin);
	}
	
	public List<AdminDTO> allAdminsDtos() {
		List<Admin> allAdmins = repository.findAll(); 
		List<AdminDTO> allAdminsDtos = allAdmins.stream().map(admin -> {
			if(admin.getImage()!=null && admin.getImage().length>0) {
				admin.setImage(ImageUtils.decompress(admin.getImage()));
			}
			return AdminToAdminDto(admin);
		}).collect(Collectors.toList());
		return allAdminsDtos;
	}
	
	public String updateAdminById(Long id,MultipartFile file,RegisterRequest request) throws IOException {
		repository.updateAdminById(id,
				request.getFullname(),
				request.getMobile(),
				request.getEmail(),
				ImageUtils.compress(file.getBytes()),
				file.getOriginalFilename(),
				file.getContentType()
				);
		return "Admin detail updated successfully ... "; 
	}
	
	public String updateEnableAndNonLockedAccountById(Long id, boolean enabled, boolean nonLocked) {
		repository.updateEnabledAndNonLockedById(id,enabled,nonLocked);
		return "Admin detail updated successfully ... ";
	}
	
	public String updatePasswordById(Long id, String currentPassword, String newPassword) {
		Admin admin = repository.findById(id).get();
		if(passwordEncoder.matches(currentPassword, admin.getPassword())){
			if(passwordEncoder.matches(newPassword, admin.getPassword())) {
				throw new AdminLoginException("current password and new password is same change it.");
			}
			repository.updatePassword(id,passwordEncoder.encode(newPassword));
		}else {
			throw new AdminLoginException("current password doesn't match");
		}
		return "Admin detail updated successfully ... ";
	}

	public AuthenticationResponse genTokenUser(HttpServletRequest req) {
		String username = req.getUserPrincipal().getName();
		System.out.println(username+"|||||||||"+req.getUserPrincipal().getName());
		Principal principal = req.getUserPrincipal();
		if(principal instanceof UserDetails) {
			UserDetails userDetails = (UserDetails) principal;
			System.err.println(userDetails.getAuthorities());
		}
		var jwtUserToken = jwtUsersService.generateToken(username); 
		return AuthenticationResponse.builder()
				.username(username)
				.token(jwtUserToken)
				.build();
	}

	public String deleteById(Long id) {
		repository.deleteById(id);
		return "Admin has been deleted";
	}
	
	private AdminDTO AdminToAdminDto(Admin admin) {
		return AdminDTO.builder()
			.id(admin.getId())
			.fullname(admin.getFullname())
			.email(admin.getEmail())           
			.mobile(admin.getMobile())
			.username(admin.getUsername())        
			.password("********")        
			.role(admin.getRole().name())            
			.image(admin.getImage())       
			.imageName(admin.getImageName())       
			.imageType(admin.getImageType())       
			.enabled(admin.isEnabled())       
			.nonLocked(admin.isNonLocked())
			.build();    
	}


}


/*
public String genTokenUser(HttpServletRequest req) {
	//String username = req.getUserPrincipal().getName();
	Principal principal = req.getUserPrincipal();
	UserDetails userDetails = null;
	if(principal instanceof UserDetails) {
		 userDetails = (UserDetails) principal;
	}
	return jwtUsersService.generateToken(userDetails);
}
*/
