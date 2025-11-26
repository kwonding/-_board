import { useEffect } from "react";
import { useAuthStore } from "./stores/auth.store";
import { userApi } from "./apis/user/user.api";
import { GlobalStyle } from "./styles/global";
import Layout from "./components/layout/Layout";
import AuthRouter from "./pages/auth/AuthRouter";
import MainRouter from "./pages/MainRouter";

export default function App() {
  const { isInitialized, accessToken, user, setUser } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;
    if (!accessToken) return;
    if (user) return;

    (async () => {
      if (accessToken && !user) {
        const me = await userApi.me();
        if (me.success && me.data) {
          setUser(me.data);
        }
      }
    })();
  }, [isInitialized, accessToken]);

  if (!isInitialized) {
    return <div>로딩중</div>;
  }

  const isLoggedIn = Boolean(accessToken && user);

  return (
    <>
      <GlobalStyle />
      {isLoggedIn ? (
        <Layout>
          <MainRouter /> /* 얘가 Layout의 매개변수로 받는 Children */
        </Layout>
      ) : (
        <AuthRouter />
      )}
    </>
  );
}