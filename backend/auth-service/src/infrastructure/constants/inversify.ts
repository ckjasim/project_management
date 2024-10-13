

const INTERFACE_TYPES = {
  UserRepository:Symbol.for('UserRepository'),
  UserInteractor:Symbol.for('UserInteractor'),

  AdminInteractor:Symbol.for('AdminInteractor'),

  EmployeeRepository:Symbol.for('EmployeeRepository'),
  EmployeeInteractor:Symbol.for('EmployeeInteractor'),

  UserController:Symbol.for('UserController'),
  EmployeeController:Symbol.for('EmployeeController'),

  OtpRepository:Symbol.for('OtpRepository'),
  jwt:Symbol.for('jwt'),
  NodeMailerService:Symbol.for('NodeMailerService')
}
export default INTERFACE_TYPES 