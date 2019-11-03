export type JwtPayload = {
  userId: number;
  username: string;
  iat?: number;
  exp?: number;
};

// @ts-ignore
export type CategoryFixture = [string, CategoryFixture[]];

export type ProductFixture = [string, string, number, number];
