


const INTERFACE_TYPES = {
  UserRepository:Symbol.for('UserRepository'),
  UserInteractor:Symbol.for('UserInteractor'),
  
  OrganizatonRepository:Symbol.for('OrganizatonRepository'),
  invitationRepository:Symbol.for('invitationRepository'),

  AdminInteractor:Symbol.for('AdminInteractor'),

  EmployeeRepository:Symbol.for('EmployeeRepository'),
  EmployeeInteractor:Symbol.for('EmployeeInteractor'),

  UserController:Symbol.for('UserController'),
  GoogleAuthService:Symbol.for('GoogleAuthService'),
  EmployeeController:Symbol.for('EmployeeController'),
  AdminController:Symbol.for('AdminController'),

  RefreshTokenRepository:Symbol.for('RefreshTokenRepository'),

  OtpRepository:Symbol.for('OtpRepository'),
  jwt:Symbol.for('jwt'),
  NodeMailerService:Symbol.for('NodeMailerService')
}
export default INTERFACE_TYPES 