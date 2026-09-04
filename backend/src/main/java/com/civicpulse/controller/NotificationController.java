package com.civicpulse.controller;

import com.civicpulse.dto.ApiResponse;
import com.civicpulse.entity.Notification;
import com.civicpulse.entity.User;
import com.civicpulse.service.AuthService;
import com.civicpulse.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "In-app notifications for citizens and authorities")
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthService authService;

    @GetMapping
    @Operation(summary = "Get user notifications sorted by newest first")
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications() {
        User currentUser = authService.getCurrentUserEntity();
        List<Notification> notifs = notificationService.getUserNotifications(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok(notifs));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        User currentUser = authService.getCurrentUserEntity();
        notificationService.markAsRead(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Notification marked as read", null));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread notification count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        User currentUser = authService.getCurrentUserEntity();
        Long count = notificationService.getUnreadCount(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok(count));
    }
}
