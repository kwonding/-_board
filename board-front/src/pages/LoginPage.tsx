import { authApi } from '@/apis/auth/auth.api';
import { userApi } from '@/apis/user/user.api';
import { SocialLoginButtons } from '@/components/SocialLoginButtons';
import { useAuthStore } from '@/stores/auth.store';
import type { UserLoginForm } from '@/types/user/user.type';
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

  // 로그인 처리 중 여부
  const [loading, setLoading] = useState<boolean>(false);

  // 에러 메시지
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 페이지 이동 훅 처리
  const navigate = useNavigate();

  // Zustand store 상태와 액션 가져오기
  // const { setAccessToken, setUser, hydrateFromStorage, isInitialized } = useAuthStore(s => // 구조 분해 할당
  // ({
  //   setAccessToken: s.setAccessToken,
  //   setUser: s.setUser,
  //   hydrateFromStorage: s.hydrateFromStorage,
  //   isInitialized: s.isInitialized
  // }));

  /*
  앱 첫 로딩 시
  - persist가 저장한 accessToken / user 정보를 LocalStorage에서 읽어와 복원
  - hydrateFromStorage()는 auth.store.ts에 정의한 커스텀 초기화 함수
  */
  // useEffect(() => {
  //   if (!isInitialized) { // 처음이아니라면
  //     hydrateFromStorage(); // storage에 저장된 값 들고오기

  //   }
  // }, [isInitialized, hydrateFromStorage]);

  // const {setAccessToken, setUser} = useAuthStore(s => ({
  //   setAccessToken: s.setAccessToken,
  //   setUser: s.setUser
  // }));

  const setAccessToken = useAuthStore(s => s.setAccessToken);
  const setUser =- useAuthStore(s => s.setUser);

  /*
  ! 입력 변경 처리
  */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  /*
  ! 로그인 처리
  : 백엔드에 username/password로 로그인 요청
  - 성공하면 AccessToken 저장
  - /me API 호출하여 사용자 정보 가져오기
  - 사용자 정보 저장 후 메인 페이지로 이동
  */
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    // e는 이벤트 객체, 이벤트의 기본 동작(폼 제출)을 막기 위해 필요

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await authApi.loginApi(form);
      if (!res.success || !res.data) {
        throw new Error("로그인 실패: 데이터가 없습니다.");
      }
      setAccessToken(res.data.accessToken)
      
      const me = await userApi.me();
      if (!me.success || !me.data) {
        throw new Error("유저 정보 조회 실패: 데이터가 없습니다.")
      }
      setUser(me.data);

      navigate('/');

    } catch(error: any) {
      setErrorMsg(error.response?.data?.message ?? "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{maxWidth: 400, margin: "40px auto"}}>
      <h1>로그인</h1>

      {/* 로컬 로그인 폼 */}
      <form onSubmit={handleSubmit}>
        <label>
          아이디
          <input 
            type="text" 
            name='username' 
            value={form.username}
            onChange={handleChange}
            required // 비워질 수 없음
          />
        </label>
        <br />
        <label>
          비밀번호
          <input 
            type="password" 
            name='password' 
            value={form.password}
            onChange={handleChange}
            required // 비워질 수 없음
          />
        </label>
        <br />

        <button type='submit' disabled={loading}>
          {loading ? "로그인 중" : "로그인"}
        </button>
      </form>

      {/* 에러 메시지 */}
      {errorMsg && <p style={{color: 'red'}}>{errorMsg}</p>}

      {/* 소셜 로그인 버튼 */}
      <SocialLoginButtons />

      <div style={{marginTop: 16}}>
        <Link to="/register">회원가입</Link>
        <Link to="/forgot-password">비밀번호 재설정</Link>
      </div>
    </div>
  )
}

export default LoginPage