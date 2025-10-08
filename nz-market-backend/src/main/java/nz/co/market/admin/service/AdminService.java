package nz.co.market.admin.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nz.co.market.admin.dto.AdminDashboardResponse;
import nz.co.market.admin.dto.ReportResponse;
import nz.co.market.admin.entity.AuditLog;
import nz.co.market.admin.entity.Report;
import nz.co.market.admin.mapper.AdminMapper;
import nz.co.market.admin.repository.AuditLogRepository;
import nz.co.market.admin.repository.ReportRepository;
import nz.co.market.auth.entity.User;
import nz.co.market.auth.repository.UserRepository;
import nz.co.market.items.entity.Item;
import nz.co.market.items.repository.ItemRepository;
import nz.co.market.orders.entity.Order;
import nz.co.market.orders.repository.OrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {
    
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final OrderRepository orderRepository;
    private final ReportRepository reportRepository;
    private final AuditLogRepository auditLogRepository;
    private final AdminMapper adminMapper;
    
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {
        // Get basic statistics
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.count(); // Would filter by active status
        long totalItems = itemRepository.count();
        long pendingItems = itemRepository.count(); // Would filter by pending status
        long totalOrders = orderRepository.count();
        long completedOrders = orderRepository.count(); // Would filter by completed status
        long totalReports = reportRepository.count();
        long openReports = reportRepository.countByStatus(Report.ReportStatus.OPEN);
        
        AdminDashboardResponse.DashboardStats stats = AdminDashboardResponse.DashboardStats.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .totalItems(totalItems)
                .pendingItems(pendingItems)
                .totalOrders(totalOrders)
                .completedOrders(completedOrders)
                .totalReports(totalReports)
                .openReports(openReports)
                .totalRevenue(0.0) // Would calculate from orders
                .build();
        
        // Get recent activity
        Pageable recentPage = PageRequest.of(0, 5);
        
        List<AdminDashboardResponse.ActivityItem> newUsers = userRepository.findAll(recentPage)
                .getContent()
                .stream()
                .map(user -> AdminDashboardResponse.ActivityItem.builder()
                        .id(user.getId().toString())
                        .description("New user registered: " + user.getDisplayName())
                        .timestamp(user.getCreatedAt())
                        .type("USER")
                        .build())
                .toList();
        
        List<AdminDashboardResponse.ActivityItem> newItems = itemRepository.findAll(recentPage)
                .getContent()
                .stream()
                .map(item -> AdminDashboardResponse.ActivityItem.builder()
                        .id(item.getId().toString())
                        .description("New item listed: " + item.getTitle())
                        .timestamp(item.getCreatedAt())
                        .type("ITEM")
                        .build())
                .toList();
        
        List<AdminDashboardResponse.ActivityItem> newOrders = orderRepository.findAll(recentPage)
                .getContent()
                .stream()
                .map(order -> AdminDashboardResponse.ActivityItem.builder()
                        .id(order.getId().toString())
                        .description("New order created")
                        .timestamp(order.getCreatedAt())
                        .type("ORDER")
                        .build())
                .toList();
        
        List<AdminDashboardResponse.ActivityItem> newReports = reportRepository.findAll(recentPage)
                .getContent()
                .stream()
                .map(report -> AdminDashboardResponse.ActivityItem.builder()
                        .id(report.getId().toString())
                        .description("New report submitted")
                        .timestamp(report.getCreatedAt())
                        .type("REPORT")
                        .build())
                .toList();
        
        AdminDashboardResponse.RecentActivity recentActivity = AdminDashboardResponse.RecentActivity.builder()
                .newUsers(newUsers)
                .newItems(newItems)
                .newOrders(newOrders)
                .newReports(newReports)
                .build();
        
        return AdminDashboardResponse.builder()
                .stats(stats)
                .recentActivity(recentActivity)
                .build();
    }
    
    @Transactional(readOnly = true)
    public Page<ReportResponse> getReports(Report.ReportStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Report> reports;
        
        if (status != null) {
            reports = reportRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        } else {
            reports = reportRepository.findAll(pageable);
        }
        
        return reports.map(adminMapper::toReportResponse);
    }
    
    @Transactional
    public void resolveReport(UUID reportId, String resolutionNotes, User admin) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        
        report.setStatus(Report.ReportStatus.RESOLVED);
        report.setResolvedAt(ZonedDateTime.now());
        report.setResolvedBy(admin);
        report.setResolutionNotes(resolutionNotes);
        
        reportRepository.save(report);
        
        // Log the action
        logAdminAction(admin, "RESOLVE_REPORT", "REPORT", reportId, 
                "Resolved report: " + resolutionNotes);
        
        log.info("Report {} resolved by admin {}", reportId, admin.getEmail());
    }
    
    @Transactional
    public void dismissReport(UUID reportId, String reason, User admin) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        
        report.setStatus(Report.ReportStatus.DISMISSED);
        report.setResolvedAt(ZonedDateTime.now());
        report.setResolvedBy(admin);
        report.setResolutionNotes(reason);
        
        reportRepository.save(report);
        
        // Log the action
        logAdminAction(admin, "DISMISS_REPORT", "REPORT", reportId, 
                "Dismissed report: " + reason);
        
        log.info("Report {} dismissed by admin {}", reportId, admin.getEmail());
    }
    
    @Transactional
    public void banUser(UUID userId, String reason, User admin) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setStatus(nz.co.market.auth.enums.UserStatus.BANNED);
        userRepository.save(user);
        
        // Log the action
        logAdminAction(admin, "BAN_USER", "USER", userId, 
                "Banned user: " + reason);
        
        log.info("User {} banned by admin {}", userId, admin.getEmail());
    }
    
    @Transactional
    public void unbanUser(UUID userId, User admin) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setStatus(nz.co.market.auth.enums.UserStatus.ACTIVE);
        userRepository.save(user);
        
        // Log the action
        logAdminAction(admin, "UNBAN_USER", "USER", userId, 
                "Unbanned user");
        
        log.info("User {} unbanned by admin {}", userId, admin.getEmail());
    }
    
    @Transactional
    public void approveItem(UUID itemId, User admin) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        item.setStatus(nz.co.market.items.enums.ItemStatus.ACTIVE);
        itemRepository.save(item);
        
        // Log the action
        logAdminAction(admin, "APPROVE_ITEM", "ITEM", itemId, 
                "Approved item");
        
        log.info("Item {} approved by admin {}", itemId, admin.getEmail());
    }
    
    @Transactional
    public void rejectItem(UUID itemId, String reason, User admin) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        item.setStatus(nz.co.market.items.enums.ItemStatus.INACTIVE);
        itemRepository.save(item);
        
        // Log the action
        logAdminAction(admin, "REJECT_ITEM", "ITEM", itemId, 
                "Rejected item: " + reason);
        
        log.info("Item {} rejected by admin {}", itemId, admin.getEmail());
    }
    
    private void logAdminAction(User admin, String action, String targetType, UUID targetId, String metadata) {
        AuditLog auditLog = AuditLog.builder()
                .actor(admin)
                .action(action)
                .targetType(targetType)
                .targetId(targetId)
                .metadataJson(metadata)
                .build();
        
        auditLogRepository.save(auditLog);
    }
}
