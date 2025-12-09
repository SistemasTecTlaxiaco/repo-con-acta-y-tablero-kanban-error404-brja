import type { Project } from '../types';
import { authService } from './auth.service';

/**
 * Service to interact with the Project Contracts on Soroban
 */
const STORAGE_KEY = 'logitec_projects';

class ProjectService {
  private projects: Project[] = [];

  constructor() {
    this.loadProjects();
  }

  private loadProjects() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.projects = JSON.parse(stored);
      } else {
        this.projects = this.mockProjects();
        this.saveProjects();
      }
    } catch (e) {
      console.error('Error loading projects from storage', e);
      this.projects = this.mockProjects();
    }
  }

  private saveProjects() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.projects));
    } catch (e) {
      console.error('Error saving projects to storage', e);
    }
  }

  /**
   * Fetch all projects from the contract (simulated)
   */
  async getProjects(): Promise<Project[]> {
    try {
      console.log('Fetching projects...', this.projects);
      // Ensure we always have the latest state (in case multiple tabs/reloads)
      this.loadProjects();
      return [...this.projects];
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  async getProject(id: string): Promise<Project> {
    this.loadProjects();
    const project = this.projects.find(p => p.id === id);
    if (!project) throw new Error('Project not found');
    return project;
  }

  /**
   * Create a new project on the blockchain (simulated persistence)
   */
  async createProject(projectData: Omit<Project, 'id' | 'walletAddress' | 'creatorId' | 'creatorName' | 'funded' | 'transactions' | 'status' | 'raisedAmount' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    try {
      console.log('Creating project:', projectData);

      const user = await authService.getProfile();
      if (!user.walletAddress) throw new Error('Wallet not connected');

      const newProject: Project = {
        id: 'proj-' + Date.now(),
        title: projectData.title,
        description: projectData.description,
        targetAmount: projectData.targetAmount,
        raisedAmount: 0,
        currentAmount: '0',
        creatorId: user.id || 'unknown',
        creator: user,
        walletAddress: user.walletAddress,
        imageUrl: projectData.imageUrl || 'https://via.placeholder.com/400x200',
        category: projectData.category,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        environmentalImpact: projectData.environmentalImpact,
        milestones: projectData.milestones || [],
        tokenRewards: String(projectData.tokenRewards || '1'),
        funded: false,
        transactions: []
      };

      // Contracts simulation: Add to local list and save
      this.projects.unshift(newProject);
      this.saveProjects();

      return newProject;

    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async updateProject(_id: string, _project: Partial<Project>): Promise<Project> {
    throw new Error("Update not supported on blockchain directly without contract logic");
  }

  async deleteProject(_id: string): Promise<void> {
    throw new Error("Cannot delete from blockchain");
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    const projects = await this.getProjects();
    return projects.filter(p => p.creatorId === userId);
  }

  async fundProject(id: string, amount: number): Promise<void> {
    try {
      console.log(`Funding project ${id} with ${amount} XLM`);

      this.loadProjects();
      const projectIndex = this.projects.findIndex(p => p.id === id);

      if (projectIndex === -1) {
        throw new Error("Project not found");
      }

      const project = this.projects[projectIndex];

      if (!project.walletAddress) {
        throw new Error("Project wallet address not found");
      }

      // 1. Import donation service dynamically
      const { donationService } = await import('./donation.service');

      // 2. Make donation (Transaction)
      await donationService.makeDonation(id, String(amount), project.walletAddress);

      // 3. Update Local Project State to reflect funding immediately
      const raised = typeof project.raisedAmount === 'string' ? parseFloat(project.raisedAmount) : (project.raisedAmount || 0);
      const newRaised = raised + amount;

      const target = typeof project.targetAmount === 'string' ? parseFloat(project.targetAmount) : (project.targetAmount || 0);

      // Update fields
      this.projects[projectIndex] = {
        ...project,
        raisedAmount: newRaised,
        currentAmount: String(newRaised),
        funded: newRaised >= target,
        status: newRaised >= target ? 'completed' : 'active'
      };

      this.saveProjects();
      console.log("Funding successful and state updated locally");

    } catch (error) {
      console.error("Error funding project", error);
      throw error;
    }
  }

  async getMyProjects(): Promise<Project[]> {
    const user = await authService.getProfile();
    if (!user) return [];
    return this.getUserProjects(user.id);
  }

  // Helper for mock data 
  private mockProjects(): Project[] {
    return [
      {
        id: '1',
        title: 'Préstamo Estudiantil: Ana García',
        description: 'Estudiante de Ingenería en Sistemas. Necesito fondos para cubrir mi inscripción del 5to semestre y materiales de laboratorio. Prometo pagar en 6 meses.',
        targetAmount: '5000',
        raisedAmount: 1250,
        currentAmount: '1250',
        creatorId: 'user-1',
        creator: { _id: 'user-1', username: 'Ana García', walletAddress: 'G...' },
        walletAddress: 'G...',
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        category: 'education',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        environmentalImpact: { metric: 'Semestres Cubiertos', value: '1', unit: 'semestre' },
        milestones: [],
        tokenRewards: '1',
        funded: false,
        transactions: []
      },
      {
        id: '2',
        title: 'Laptop para Diseño: Carlos Ruiz',
        description: 'Soy estudiante de Diseño Gráfico. Mi laptop actual no soporta el software de renderizado. Busco préstamo para actualizar mi equipo y entregar mi tesis.',
        targetAmount: '12000',
        raisedAmount: 3000,
        currentAmount: '3000',
        creatorId: 'user-2',
        creator: { _id: 'user-2', username: 'Carlos Ruiz', walletAddress: 'G...' },
        walletAddress: 'G...',
        imageUrl: 'https://images.unsplash.com/photo-1593642532744-93650e7231fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        category: 'equipment',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        environmentalImpact: { metric: 'Proyectos Entregados', value: '5', unit: 'proyectos' },
        milestones: [],
        tokenRewards: '1',
        funded: false,
        transactions: []
      }
    ];
  }
}

export const projectService = new ProjectService();
export default projectService;