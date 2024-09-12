import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = () => {
  return (
    <GoogleOAuthProvider clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}>
      <button onClick={() => useGoogleLogin({ onSuccess: res => console.log(res) })}></button>
    </GoogleOAuthProvider>
  );
};
export default GoogleLoginButton;
