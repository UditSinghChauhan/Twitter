import JWT from "jsonwebtoken";
import { User } from "@prisma/client";
import { JWTUser } from "../intefaces";

// ✅ Secret loaded from environment — never hardcode this
const JWT_SECRET = process.env.JWT_SECRET as string;

class JWTService {
  public static generateTokenForUser(user: User) {
    const payload: JWTUser = {
      id: user?.id,
      email: user?.email,
    };
    // ✅ Token expires in 7 days
    const token = JWT.sign(payload, JWT_SECRET, { expiresIn: "7d" });
    return token;
  }

  public static decodeToken(token: string) {
    try {
      return JWT.verify(token, JWT_SECRET) as JWTUser;
    } catch (error) {
      return null;
    }
  }
}

export default JWTService;
 