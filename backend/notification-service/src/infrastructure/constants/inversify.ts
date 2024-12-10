const INTERFACE_TYPES = {
  ChatRepository: Symbol.for('ChatRepository'),
  TeamRepository: Symbol.for('TeamRepository'),
  ChatInteractor: Symbol.for(' ChatInteractor'),
  ChatController: Symbol.for(' ChatController'),
  jwt: Symbol.for('jwt'),
};
export default INTERFACE_TYPES;
