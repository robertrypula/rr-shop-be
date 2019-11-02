export type JwtPayload = {
  userId: number;
  username: string;
  iat?: number;
  exp?: number;
};
