package nz.co.market.uploads.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class PresignRequest {
    
    @NotBlank(message = "File name is required")
    private String fileName;
    
    @NotBlank(message = "Content type is required")
    @Pattern(regexp = "image/(jpeg|jpg|png|webp)", message = "Only image files are allowed")
    private String contentType;
}
