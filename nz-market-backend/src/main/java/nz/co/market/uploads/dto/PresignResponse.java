package nz.co.market.uploads.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PresignResponse {
    
    private String url;
    private Map<String, String> fields;
    private String key;
}
