package in.udaansetu.platform.notifications;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDateTime;

public final class NotificationDtos {
    private NotificationDtos() {}
    public enum ReminderKind { OPPORTUNITY_DEADLINE, LEARNING_STEP, FACILITATOR_FOLLOW_UP, SYSTEM }
    public enum ReminderStatus { SCHEDULED, READY, ACKNOWLEDGED, CANCELLED }
    public record ReminderCreateRequest(@NotBlank @Size(max=80) String recipientKey,
            @NotNull ReminderKind kind, @NotBlank @Size(max=140) String title,
            @NotBlank @Size(max=500) String message, @NotNull LocalDateTime scheduledAt,
            @Size(max=120) String relatedRecordId) {}
    public record Reminder(String id, String recipientKey, ReminderKind kind, String title, String message,
            LocalDateTime scheduledAt, ReminderStatus status, String relatedRecordId, Instant createdAt, Instant updatedAt) {}
    public record NotificationPreferencesRequest(@AssertTrue(message="In-app notification channel must remain available") boolean inAppEnabled,
            boolean emailEnabled, boolean smsEnabled, boolean consentToExternalDelivery) {}
    public record NotificationPreferences(String actorKey, boolean inAppEnabled, boolean emailEnabled,
            boolean smsEnabled, boolean consentToExternalDelivery, Instant updatedAt,
            String deliveryNote) {}
}
