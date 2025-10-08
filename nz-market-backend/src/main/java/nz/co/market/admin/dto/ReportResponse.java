package nz.co.market.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nz.co.market.admin.entity.Report;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    
    private UUID id;
    private ReporterDto reporter;
    private Report.ReportTargetType targetType;
    private UUID targetId;
    private String reason;
    private Report.ReportStatus status;
    private ZonedDateTime createdAt;
    private ZonedDateTime resolvedAt;
    private UserDto resolvedBy;
    private String resolutionNotes;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReporterDto {
        private UUID id;
        private String displayName;
        private String email;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto {
        private UUID id;
        private String displayName;
        private String email;
    }
}
