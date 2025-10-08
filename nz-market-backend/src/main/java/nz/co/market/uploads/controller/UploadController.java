package nz.co.market.uploads.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nz.co.market.uploads.dto.PresignRequest;
import nz.co.market.uploads.dto.PresignResponse;
import nz.co.market.uploads.service.S3Service;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/uploads")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Uploads", description = "File upload endpoints")
@SecurityRequirement(name = "bearerAuth")
public class UploadController {
    
    private final S3Service s3Service;
    
    @PostMapping("/presign")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Generate presigned URL for file upload")
    public ResponseEntity<PresignResponse> generatePresignedUrl(@Valid @RequestBody PresignRequest request) {
        log.info("Generating presigned URL for file: {}", request.getFileName());
        PresignResponse response = s3Service.generatePresignedUrl(request);
        return ResponseEntity.ok(response);
    }
}
