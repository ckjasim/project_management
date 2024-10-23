import IRefreshToken from "./IRefreshToken";

export default interface IRefreshTokenRepository {
  create(data: IRefreshToken): Promise<IRefreshToken>;
}
