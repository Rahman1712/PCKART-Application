package com.ar.pckart.admin.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
//import static com.ar.pckart.admin.model.Role.*;
//import static com.ar.pckart.admin.model.Permission.*;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {
	
	@Autowired
	private  JwtAuthenticationFilter jwtAuthFilter;
	@Autowired
	private  AuthenticationProvider authenticationProvider;
	
	@Value("${cors.set.allowed.origins}")
	private String[] CROSS_ORIGIN_URLS;
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
		.cors(Customizer.withDefaults())
		.csrf(csrf -> csrf.disable())
		.authorizeHttpRequests(ahr ->
			ahr.requestMatchers("/api/v1/auth/**")
				.permitAll()
				
//			.requestMatchers("/api/v1/private/**")
//				.hasAnyRole(ADMIN.name(), ADMINTRAINEE.name(), EDITOR.name())
//				
//			.requestMatchers(HttpMethod.GET,"/api/v1/private/**")
//				.hasAnyAuthority(ADMIN_READ.name())
			
			.anyRequest()
				.authenticated()
		)
		.sessionManagement(sm -> 
			sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
		)
		.authenticationProvider(authenticationProvider)
		.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
		;

		
		return http.build();
	}
	
	@Bean
	public CorsFilter corsFilter() {
		CorsConfiguration corsConfiguration = new CorsConfiguration();
		corsConfiguration.setAllowCredentials(true);
		corsConfiguration.setAllowedOrigins(Arrays.asList(CROSS_ORIGIN_URLS));
		corsConfiguration.setAllowedHeaders(Arrays.asList(
					"Origin","Access-Control-Allow-Origin", "Content-Type",
					"Accept","Authorization","Origin, Accept","X-Requested-With",
					"Access-Control-Request-Method","Access-Control-Request-Headers"
				));
		corsConfiguration.setExposedHeaders(Arrays.asList(
					"Origin","Content-Type","Accept","Authorization",
					"Access-Control-Allow-Origin","Access-Control-Allow-Origin",
					"Access-Control-Allow-Credentials"
				));
		corsConfiguration.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","OPTIONS"));
		UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
		urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
		return new CorsFilter(urlBasedCorsConfigurationSource);
	}
	

}
/*
 @RequiredArgsConstructor
  private final JwtAuthenticationFilter jwtAuthFilter;
	private final AuthenticationProvider authenticationProvider;
	
	
 */

/*
 	@Bean 
	public FilterRegistrationBean<JwtAuthenticationFilter> filer1Reg(){
		FilterRegistrationBean<JwtAuthenticationFilter> registrationBean =
				new FilterRegistrationBean<>();
		registrationBean.setFilter(jwtAuthFilter);
		registrationBean.addUrlPatterns("/api/v1/auth/**");
		registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
		return registrationBean;
	}
 */
