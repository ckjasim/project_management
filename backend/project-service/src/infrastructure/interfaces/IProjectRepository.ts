import IProject from './IProject';

export default interface IProjectRepository {
  create(data: Partial<IProject>): Promise<IProject>;
  findByUserEmail(userEmail:string): Promise<IProject[] | null>;
  update(id: string, data: Partial<IProject>): Promise<any>;
  delete(id: string): Promise<IProject | null>;
}
