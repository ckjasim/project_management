const INTERFACE_TYPES = {
  ProjectRepository: Symbol.for('ProjectRepository'),
  ProjectInteractor: Symbol.for(' ProjectInteractor'),
  ProjectController: Symbol.for(' ProjectController'),
  TeamRepository: Symbol.for('TeamRepository'),
  RefreshTokenRepository: Symbol.for('RefreshTokenRepository'),
  jwt: Symbol.for('jwt'),
  Auth: Symbol.for('Auth'),
};
export default INTERFACE_TYPES;
