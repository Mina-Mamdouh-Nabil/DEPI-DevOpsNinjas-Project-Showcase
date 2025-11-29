package com.shopinow.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI shopiNowOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8080");
        devServer.setDescription("Development server");
        
        Contact contact = new Contact();
        contact.setEmail("support@shopinow.com");
        contact.setName("ShopiNow Support");
        
        License license = new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/MIT");
        
        Info info = new Info()
                .title("ShopiNow API")
                .version("1.0.0")
                .contact(contact)
                .description("REST API for ShopiNow e-commerce platform. " +
                        "This API provides endpoints for user authentication, product management, " +
                        "shopping cart, and order processing.")
                .license(license);
        
        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer))
                .addSecurityItem(new io.swagger.v3.oas.models.security.SecurityRequirement().addList("Bearer Authentication"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("Bearer Authentication", new io.swagger.v3.oas.models.security.SecurityScheme()
                                .type(io.swagger.v3.oas.models.security.SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}


