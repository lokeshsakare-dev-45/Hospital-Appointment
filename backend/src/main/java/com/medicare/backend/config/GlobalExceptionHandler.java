package com.medicare.backend.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        String firstErrorMessage = "Validation failed";

        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            if (!fieldErrors.containsKey(error.getField())) {
                fieldErrors.put(error.getField(), error.getDefaultMessage());
            }
        }

        if (!ex.getBindingResult().getFieldErrors().isEmpty()) {
            firstErrorMessage = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", firstErrorMessage);
        response.put("errors", fieldErrors);
        response.put("status", HttpStatus.BAD_REQUEST.value());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", ex.getMessage());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred");
        response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
