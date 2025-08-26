package com.openclassrooms.api.services;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;


@Service
public class JWTService {

	private static final Logger logger = LoggerFactory.getLogger(JWTService.class);
	private JwtEncoder jwtEncoder;
	
	public JWTService(JwtEncoder jwtEncoder) {
		this.jwtEncoder = jwtEncoder;
	}
	
	public String generateToken(Authentication authentication) {
        String subject = authentication.getName();
        logger.info("Generating JWT token for authenticated user: {}", subject);
        MDC.put("operation", "jwt_generation");
        MDC.put("subject", subject);
        
        try {
            Instant now = Instant.now();
            Instant expiration = now.plus(1, ChronoUnit.DAYS);
            
            logger.debug("Creating JWT claims for user: {} with expiration: {}", subject, expiration);
            JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(expiration)
                .subject(subject)
                .build();
                
            JwtEncoderParameters jwtEncoderParameters = JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims);
            String token = this.jwtEncoder.encode(jwtEncoderParameters).getTokenValue();
            
            logger.info("JWT token successfully generated for user: {}", subject);
            return token;
            
        } catch (Exception e) {
            logger.error("Failed to generate JWT token for user: {} - Error: {}", subject, e.getMessage(), e);
            throw new RuntimeException("Token generation failed", e);
        } finally {
            MDC.clear();
        }
	}
    
    public String generateSimpleToken(String email) {
        logger.info("Generating simple JWT token for email: {}", email);
        MDC.put("operation", "simple_jwt_generation");
        MDC.put("email", email);
        
        try {
            Instant now = Instant.now();
            Instant expiration = now.plus(1, ChronoUnit.DAYS);
            
            logger.debug("Creating simple JWT claims for email: {} with expiration: {}", email, expiration);
            JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(expiration)
                .subject(email)
                .build();
            
            JwtEncoderParameters jwtEncoderParameters = JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(), 
                claims
            );
            String token = this.jwtEncoder.encode(jwtEncoderParameters).getTokenValue();
            
            logger.info("Simple JWT token successfully generated for email: {}", email);
            return token;
            
        } catch (Exception e) {
            logger.error("Failed to generate simple JWT token for email: {} - Error: {}", email, e.getMessage(), e);
            throw new RuntimeException("Simple token generation failed", e);
        } finally {
            MDC.clear();
        }
    }
}
