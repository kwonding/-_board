/** @jsxImportSource @emotion/react */
import { authApi } from '@/apis/auth/auth.api';
import { userApi } from '@/apis/user/user.api';
import { SocialLoginButtons } from '@/components/SocialLoginButtons';
import { useAuthStore } from '@/stores/auth.store';
import type { UserLoginForm } from '@/types/user/user.type';
import { getErrorMessage } from '@/utils/error';
import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

// 로그인 페이지
function LoginPage() {


  //^ === HOOKS ===
  // username, password 입력 상태
  const [form, setForm] = useState<UserLoginForm>({
    username: '',
    password: ''
  });

  // 에러 메시지
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 페이지 이동 훅 처리
  const navigate = useNavigate();

  const setAccessToken = useAuthStore(s => s.setAccessToken);
  const setUser = useAuthStore(s => s.setUser);

  //^ === EVENT HANDLER ===
  /*
  ! 입력 변경 처리
  */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  //! 로그인 fetch(react-query: Mutation)
  const loginMutation = useMutation({ // react-query의 useMutation으로 로그인 요청 정의
    mutationFn: async () => { // 실제로 실행될 비동기 함수 정의
      const res = await authApi.loginApi(form);

      if (!res.success || !res.data) {
        throw new Error("로그인 정보가 올바르지 않습니다.");
      }

      // accessToken 저장
      setAccessToken(res.data.accessToken)
      
      const me = await userApi.me();
      if (!me.success || !me.data) {
        throw new Error("유저 정보 조회 실패: 데이터가 없습니다.")
      }
      setUser(me.data);

      
    },

    onSuccess: () => { // mutationFn이 에러 없이 성공했을 때 실행되는 콜백
      navigate("/");
    },

    onError: (err: any) => { // mutationFn 실행 중 에러가 발생했을 때 호출되는 콜백
      setErrorMessage(getErrorMessage(err, "로그인에 실패하였습니다."))
    },
  });

  /*
  ! 로그인 처리 - fetch (react-query: Mutation)
  : 백엔드에 username/password로 로그인 요청
  - 성공하면 AccessToken 저장
  - /me API 호출하여 사용자 정보 가져오기
  - 사용자 정보 저장 후 메인 페이지로 이동
  */
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    // e는 이벤트 객체, 이벤트의 기본 동작(폼 제출)을 막기 위해 필요
    setErrorMessage(null);

    if (!form.username || !form.password) {
      setErrorMessage("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    loginMutation.mutate(); // 위의 유효성 검사를 통과하려면 로그인 mutation 실행
  }
  return (
    <div css={container}>
      <h1 css={title}>로그인</h1>
      <form css={formStyle} onSubmit={handleSubmit}>
        <div css={inputGroup}>
        <label>아이디 *</label>
          <input 
            type="text" 
            name='username' 
            value={form.username}
            onChange={handleChange} 
            required 
          />
        </div>

        <div css={inputGroup}>
          <label>비밀번호 *</label>
          <input 
            type="password"
            name='password' 
            value={form.password}
            onChange={handleChange} 
            required 
          />
        </div>
        {/* 에러 메시지 */}
        {errorMessage && <p css={errorText}>{errorMessage}</p>}

        <button css={buttonStyle} type='submit' disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>
      </form>
      

      <SocialLoginButtons />

      <div css={linkBox}>
        <Link to="/register">회원가입</Link>
        <Link to="/forgot-password">비밀번호 재설정</Link>
      </div>
    </div>
  )
}
export default LoginPage

/* ========================= CSS ======================== */
const container = css`
  max-width: 380px;
  margin: 60px auto;
  padding: 20px;
`;

const title = css`
  text-align: center;
  margin-bottom: 4px;
`;

const formStyle = css`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const inputGroup = css`
  display: flex;
  flex-direction: column;
  gap: 4px;

  input {
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #bbb;
  }
`;

const errorText = css`
  color: red;
  font-size: 0.9rem;
  margin-top: -8px;
`;

const buttonStyle = css`
  padding: 12px;
  background: #5fa4ff;
  color: white;
  border-radius: 6px;
  border: none;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const linkBox = css`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;

  a{
    color: #1b73e8;
  }
`;