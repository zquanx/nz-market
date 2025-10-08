package nz.co.market.admin.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nz.co.market.admin.dto.AdminDashboardResponse;
import nz.co.market.admin.dto.ReportResponse;
import nz.co.market.admin.entity.Report;
import nz.co.market.admin.service.AdminService;
import nz.co.market.auth.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admin", description = "Administrative endpoints")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    private final AdminService adminService;
    
    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard(@AuthenticationPrincipal User admin) {
        log.info("Admin dashboard requested by {}", admin.getEmail());
        AdminDashboardResponse dashboard = adminService.getDashboard();
        return ResponseEntity.ok(dashboard);
    }
    
    @GetMapping("/reports")
    @Operation(summary = "Get reports")
    public ResponseEntity<Page<ReportResponse>> getReports(
            @RequestParam(required = false) Report.ReportStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal User admin) {
        log.info("Reports requested by admin {}", admin.getEmail());
        Page<ReportResponse> reports = adminService.getReports(status, page, size);
        return ResponseEntity.ok(reports);
    }
    
    @PostMapping("/reports/{reportId}/resolve")
    @Operation(summary = "Resolve a report")
    public ResponseEntity<Void> resolveReport(
            @PathVariable UUID reportId,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal User admin) {
        String resolutionNotes = request.get("resolutionNotes");
        adminService.resolveReport(reportId, resolutionNotes, admin);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/reports/{reportId}/dismiss")
    @Operation(summary = "Dismiss a report")
    public ResponseEntity<Void> dismissReport(
            @PathVariable UUID reportId,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal User admin) {
        String reason = request.get("reason");
        adminService.dismissReport(reportId, reason, admin);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/users/{userId}/ban")
    @Operation(summary = "Ban a user")
    public ResponseEntity<Void> banUser(
            @PathVariable UUID userId,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal User admin) {
        String reason = request.get("reason");
        adminService.banUser(userId, reason, admin);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/users/{userId}/unban")
    @Operation(summary = "Unban a user")
    public ResponseEntity<Void> unbanUser(
            @PathVariable UUID userId,
            @AuthenticationPrincipal User admin) {
        adminService.unbanUser(userId, admin);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/items/{itemId}/approve")
    @Operation(summary = "Approve an item")
    public ResponseEntity<Void> approveItem(
            @PathVariable UUID itemId,
            @AuthenticationPrincipal User admin) {
        adminService.approveItem(itemId, admin);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/items/{itemId}/reject")
    @Operation(summary = "Reject an item")
    public ResponseEntity<Void> rejectItem(
            @PathVariable UUID itemId,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal User admin) {
        String reason = request.get("reason");
        adminService.rejectItem(itemId, reason, admin);
        return ResponseEntity.ok().build();
    }
}
