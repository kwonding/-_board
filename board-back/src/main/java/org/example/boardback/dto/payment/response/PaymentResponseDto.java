package org.example.boardback.dto.payment.response;

import org.example.boardback.common.enums.payment.PaymentMethod;
import org.example.boardback.common.enums.payment.PaymentStatus;

import java.time.LocalDateTime;

public record PaymentResponseDto(
        Long id,
        String orderId,
        String paymentKey,      // PG에서 승인 시 필요한 Key
        Long amount,
        PaymentMethod method,
        PaymentStatus status,
        String productCode,
        String productName,
        Long userPointBalance,  // 결제 후 포인트 잔액 계산용
        LocalDateTime requestedAt,
        LocalDateTime approvedAt
) {}
