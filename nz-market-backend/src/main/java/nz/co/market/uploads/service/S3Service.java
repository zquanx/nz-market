package nz.co.market.uploads.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nz.co.market.uploads.config.S3Config;
import nz.co.market.uploads.dto.PresignRequest;
import nz.co.market.uploads.dto.PresignResponse;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {
    
    private final S3Config s3Config;
    private final S3Presigner s3Presigner;
    
    public PresignResponse generatePresignedUrl(PresignRequest request) {
        try {
            // Generate unique key for the file
            String fileExtension = getFileExtension(request.getFileName());
            String key = "uploads/" + UUID.randomUUID() + fileExtension;
            
            // Create the presigned request
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(s3Config.getBucket())
                    .key(key)
                    .contentType(request.getContentType())
                    .contentLength(s3Config.getMaxFileSize())
                    .build();
            
            PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(15))
                    .putObjectRequest(putObjectRequest)
                    .build();
            
            PresignedPutObjectRequest presignedRequest = s3Presigner.presignPutObject(presignRequest);
            
            // Convert to form fields for direct upload
            Map<String, String> fields = new HashMap<>();
            presignedRequest.httpRequest().headers().forEach((name, values) -> {
                if (values.size() > 0) {
                    fields.put(name, values.get(0));
                }
            });
            
            // Add the key field
            fields.put("key", key);
            
            return PresignResponse.builder()
                    .url(presignedRequest.url().toString())
                    .fields(fields)
                    .key(key)
                    .build();
                    
        } catch (Exception e) {
            log.error("Error generating presigned URL", e);
            throw new RuntimeException("Failed to generate presigned URL", e);
        }
    }
    
    public String getPublicUrl(String key) {
        return s3Config.getEndpoint() + "/" + s3Config.getBucket() + "/" + key;
    }
    
    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex > 0) {
            return fileName.substring(lastDotIndex);
        }
        return "";
    }
}
