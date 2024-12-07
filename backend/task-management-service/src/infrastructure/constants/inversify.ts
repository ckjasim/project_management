


const INTERFACE_TYPES = {
  TaskRepository:Symbol.for('TaskRepository'),
  TaskInteractor:Symbol.for('TaskInteractor'),
  
  TeamRepository:Symbol.for('TeamRepository'),
  ProjectRepository:Symbol.for('ProjectRepository'),

  TaskController:Symbol.for('TaskController'),


  RefreshTokenRepository:Symbol.for('RefreshTokenRepository'),


  jwt:Symbol.for('jwt'),

}
export default INTERFACE_TYPES 