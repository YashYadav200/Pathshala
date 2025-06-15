import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}


export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}


export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(payload: { id: string; role: string }): string {
  return jwt.sign(
    {
          sub: payload.id,
          role: payload.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}


type TokenPayload = {
  sub: string;
  role: string;
  iat: number;
  exp: number;
};


export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}


// Define proper types for the response parameter
type ResponseWithCookies = {
  cookies: {
    set: (options: {
      name: string;
      value: string;
      httpOnly: boolean;
      secure: boolean;
      maxAge: number;
      path: string;
    }) => void;
  };
};

export function setAuthCookie(response: ResponseWithCookies, token: string): ResponseWithCookies {
  response.cookies.set({
    name: 'authToken',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
  
  return response;
}

// Remove unused variables in updateUserSession function


// Get auth cookie
export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('authToken')?.value;
}

// Remove auth cookie
export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('authToken');
}

// Get current user from token
export async function getCurrentUser(): Promise<string | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  
  const payload = verifyToken(token);
  return payload?.sub ?? null;
}

// Replace line 55 with proper types:
// Replace empty interface with:
// interface UserSession {
//   id: string;
//   email: string;
//   role: string;
// }

export const authenticateUser = async () => {
  // ... existing code ...
};

// Update function signature:
// export const updateUserSession = async (
//   session: UserSession,
//   updates: Partial<UserSession>
// ) => {
//   // ... implementation
// };