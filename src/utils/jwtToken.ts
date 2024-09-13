import jwt from "jsonwebtoken";
const privateKey = process.env.PRIVATE_KEY || "jwt-private-key";
const publicKey = process.env.TOKEN_PUBLIC_KEY || "jwt-public-key";

// access token(비밀키로 서명)
export function generateAccess(id: string) {
  const token = jwt.sign({ userId: id }, privateKey, { algorithm: "RS256", expiresIn: "60m" });
  return token;
}
// access token검증 - 성공시 decoded된 데이터 반환
export function accessVerify(token: string) {
  try {
    const decoded = jwt.verify(token, publicKey) as jwt.JwtPayload;
    return decoded;
  } catch (err) {
    console.log("Error refreshing token:    ", err);
    return err;
  }
}
// refresh token : access token과 함께 발행하는 토큰으로 유효기간이 더 긴 토큰
export function generateRefresh(id: string) {
  const token = jwt.sign({ userId: id }, privateKey, { algorithm: "RS256", expiresIn: "14d" });
  return token;
}
// refresh token검증
export function refreshVerify(token: string) {
  try {
    jwt.verify(token, publicKey) as jwt.JwtPayload;
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
