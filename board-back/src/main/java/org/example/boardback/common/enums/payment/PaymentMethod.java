package org.example.boardback.common.enums.payment;

/**
 * 결제 수단(Payment Method)
 *
 * MOCK             : 실제 결제 연동 없이, 테스트/모의 결제를 위한 가짜 결제 방식
 * TOSS_PAY         : 토스페이먼츠 연동
 * KAKAO_PAY        : 카카오페이 연동
 *
 * */
public enum PaymentMethod {
    MOCK, TOSS_PAY, KAKAO_PAY
}
