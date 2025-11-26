export const getErrorMessage = (err: any, fallback = "오류가 발생했습니다.") => {
  const backendMessage = err?.response?.data?.message;
  if (backendMessage) return backendMessage;

  const axiosMsg = err?.message;
  if (axiosMsg) return axiosMsg;

  return fallback;

}