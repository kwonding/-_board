package org.example.boardback.service.payment.gateway;

import org.example.boardback.dto.payment.request.PaymentCreateRequestDto;

/*
* === PG 연동을 추상화한 인터페이스 ===
* 결제 게이트웨이 공통 인터페이스
* - 실제 PG(토스, 카카오 등) 또는 모의 결제(Mock) 같은 형태를 추상화
* - 새로운 결제 수단이 추가되더라도 해당 결제수단 PaymentService가 해당 인터페이스 의존
* */
public interface PaymentGateway {
    /*
    * 실제 결제 수행 메서드
    *
    * - 요청 DTO를 받아 PG API 호출하고, 그 결과를 PaymentResult로 감싸서 반환
    *
    * +) "준비 + 승인" 과정을 해당 메서드 내부에서 한 번에 처리
    *       >> 실제 프로덕션에서는 주로 결제 준비, 결제 승인 2단계로 나눔
    * */
    PaymentResult pay(PaymentCreateRequestDto request);
}
