package com.shopinow.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;

@Slf4j
@Component
@Order(1)
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        long startTime = System.currentTimeMillis();
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        
        // Only log API requests
        if (requestURI.startsWith("/api/")) {
            log.info("[API Request] {} {}", method, requestURI);
        }
        
        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            
            // Only log API requests
            if (requestURI.startsWith("/api/")) {
                int status = response.getStatus();
                String statusIcon = status >= 200 && status < 300 ? "[OK]" : 
                                  status >= 400 && status < 500 ? "[WARN]" : 
                                  status >= 500 ? "[ERROR]" : "[INFO]";
                
                log.info("[API Response] {} {} - Status: {} {} - Time: {}ms", 
                    method, requestURI, status, statusIcon, duration);
                
                // Warn if response time is slow
                if (duration > 1000) {
                    log.warn("[API Slow] {} {} took {}ms (>1s)", method, requestURI, duration);
                } else if (duration > 500) {
                    log.warn("[API Warning] {} {} took {}ms (>500ms)", method, requestURI, duration);
                }
            }
        }
    }
}

