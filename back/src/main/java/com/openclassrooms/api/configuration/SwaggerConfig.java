package com.openclassrooms.api.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            // Information de base sur l'API
            .info(new Info()
                .title("API OpenClassrooms")
                .version("1.0")
                .description("API de gestion d'authentification et utilisateurs")
                .contact(new Contact()
                    .name("Yannick Tindy")
                    .email("yannicktindy@gmail.com")))
            // Configuration de la sécurité JWT
            .components(new Components()
                .addSecuritySchemes("bearerAuth",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("Entrez votre token JWT ici")))
            // Ajout du bouton Authorize global
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
}