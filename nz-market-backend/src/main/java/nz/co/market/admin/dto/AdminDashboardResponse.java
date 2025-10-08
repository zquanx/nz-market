package nz.co.market.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    
    private DashboardStats stats;
    private RecentActivity recentActivity;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardStats {
        private Long totalUsers;
        private Long activeUsers;
        private Long totalItems;
        private Long pendingItems;
        private Long totalOrders;
        private Long completedOrders;
        private Long totalReports;
        private Long openReports;
        private Double totalRevenue;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivity {
        private java.util.List<ActivityItem> newUsers;
        private java.util.List<ActivityItem> newItems;
        private java.util.List<ActivityItem> newOrders;
        private java.util.List<ActivityItem> newReports;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActivityItem {
        private String id;
        private String description;
        private ZonedDateTime timestamp;
        private String type;
    }
}
