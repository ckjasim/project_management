// infrastructure/interactors/UserInteractor.ts
import { inject, injectable } from 'inversify';

import INTERFACE_TYPES from '../infrastructure/constants/inversify';
import { IProjectInteractor } from '../infrastructure/interfaces/IProjectInteractor';
import IProject from '../infrastructure/interfaces/IProject';
import IRefreshToken from '../infrastructure/interfaces/IRefreshToken';
import IJwt from '../infrastructure/interfaces/IJwt';
import IProjectRepository from '../infrastructure/interfaces/IProjectRepository';
import ITeamRepository from '../infrastructure/interfaces/ITeamRepository';
import ITeam from '../infrastructure/interfaces/ITeam';

@injectable()
export default class ProjectInteractor implements IProjectInteractor {
  private repository: IProjectRepository;
  private teamRepository: ITeamRepository;
  private jwt: IJwt;

  constructor(
    @inject(INTERFACE_TYPES.ProjectRepository) projectRepo: IProjectRepository,
    @inject(INTERFACE_TYPES.TeamRepository) TeamRepo: ITeamRepository,
    @inject(INTERFACE_TYPES.jwt) jwt: IJwt,
  ) {
    this.repository = projectRepo;
    this.teamRepository = TeamRepo;
    this.jwt = jwt;
  }
 async createTeam(data: Partial<ITeam>): Promise<ITeam> {
    try {
      return await this.teamRepository.create(data);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }  }
 async updateTeamMembers(id:string,data: Partial<ITeam>): Promise<ITeam> {
    try {
      return await this.teamRepository.updateTeamMembers(id,data);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }  }

  async createProject(data: Partial<IProject>): Promise<IProject> {
    try {
      return await this.repository.create(data);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }
  async getProjectsByProjectManager(_id:string,organization:string): Promise<IProject[] | null> {
    try {
      return await this.repository.findByProjectManager(_id,organization);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }
  async getProjectsByProjectCode(projectCode:string): Promise<any> {
    try {
      return await this.repository.findByProjectCode(projectCode);
     
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }
 
 async updateProject(id: string, data: Partial<IProject>): Promise<void> {
    try {
      console.log('0000000000000000000000000')
      return await this.repository.update(id,data);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }
  async deleteProject(id: string): Promise<any> {
    try {
      return  await this.repository.delete(id);
   } catch (error) {
     console.error('Error finding tasks by project code:', error);
     throw error;
   }
  }
  async getTeamMembersByTeamId(teamId:string): Promise<any> {
    try {
      return await this.teamRepository.findTeamByTeamId(teamId);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }

  async getTeamsByprojectManager(projectManager:string,organization:string): Promise<ITeam[] | null> {
    try {
      return await this.teamRepository.findByprojectManager(projectManager,organization);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }
  async getTeamsByProject(projectId:string,organization:string): Promise<ITeam[] | null> {
    try {
      return await this.repository.findByProject(projectId,organization);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }
  }

 

