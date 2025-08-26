package com.openclassrooms.api.models;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Error response model")
public class ErrorResponse {
    
    @Schema(description = "Error message", example = "Invalid credentials")
    private String message;
    
    @Schema(description = "HTTP status code", example = "401")
    private int status;
    
    @Schema(description = "Timestamp of the error", example = "2024-01-01T12:00:00Z")
    private String timestamp;

    public ErrorResponse() {
    }

    public ErrorResponse(String message, int status, String timestamp) {
        this.message = message;
        this.status = status;
        this.timestamp = timestamp;
    }

    public ErrorResponse(String message, int status) {
        this.message = message;
        this.status = status;
        this.timestamp = java.time.Instant.now().toString();
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
