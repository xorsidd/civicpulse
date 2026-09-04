package com.civicpulse.service;

import com.civicpulse.entity.Notification;
import com.civicpulse.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void createNotification(Long userId, String title, String message, String type, Long clusterId) {
        if (userId == null) return;

        Notification notif = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .type(type)
                .clusterId(clusterId)
                .isRead(false)
                .build();
        notificationRepository.save(notif);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(Long notificationId, Long userId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (n.getUserId().equals(userId)) {
                n.setIsRead(true);
                notificationRepository.save(n);
            }
        });
    }

    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
}
