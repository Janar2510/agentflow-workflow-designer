import { 
  User, 
  Workflow, 
  WorkflowExecution, 
  Agent, 
  WorkflowTemplate,
  ApiResponse,
  PaginatedResponse 
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
        code: 'UNKNOWN_ERROR'
      }))
      throw new Error(error.message || 'Request failed')
    }

    return response.json()
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async register(data: { 
    email: string; 
    password: string; 
    username: string; 
    full_name?: string 
  }) {
    return this.request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async refreshToken(token: string) {
    return this.request<{ user: User; token: string }>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
  }

  async verifyToken(token: string) {
    return this.request<{ user: User }>('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
  }

  async updateProfile(updates: Partial<User>) {
    return this.request<User>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  // Workflow endpoints
  async getWorkflows(params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.category) searchParams.set('category', params.category)
    if (params?.search) searchParams.set('search', params.search)

    const query = searchParams.toString()
    return this.request<PaginatedResponse<Workflow>>(
      `/api/workflows${query ? `?${query}` : ''}`
    )
  }

  async getWorkflow(id: string) {
    return this.request<Workflow>(`/api/workflows/${id}`)
  }

  async createWorkflow(data: {
    name: string
    description?: string
    workflow_data: any
    execution_config?: any
    tags?: string[]
  }) {
    return this.request<Workflow>('/api/workflows', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateWorkflow(id: string, data: Partial<Workflow>) {
    return this.request<Workflow>(`/api/workflows/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteWorkflow(id: string) {
    return this.request<void>(`/api/workflows/${id}`, {
      method: 'DELETE',
    })
  }

  async executeWorkflow(id: string, inputData?: Record<string, any>) {
    return this.request<{ execution_id: string; status: string }>(
      `/api/workflows/${id}/execute`,
      {
        method: 'POST',
        body: JSON.stringify({ input_data: inputData || {} }),
      }
    )
  }

  // Execution endpoints
  async getExecution(id: string) {
    return this.request<WorkflowExecution>(`/api/executions/${id}`)
  }

  async getExecutions(params?: {
    workflow_id?: string
    page?: number
    limit?: number
    status?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.workflow_id) searchParams.set('workflow_id', params.workflow_id)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.status) searchParams.set('status', params.status)

    const query = searchParams.toString()
    return this.request<PaginatedResponse<WorkflowExecution>>(
      `/api/executions${query ? `?${query}` : ''}`
    )
  }

  async cancelExecution(id: string) {
    return this.request<void>(`/api/executions/${id}/cancel`, {
      method: 'POST',
    })
  }

  // Agent endpoints
  async getAgents(params?: {
    category?: string
    search?: string
    page?: number
    limit?: number
  }) {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set('category', params.category)
    if (params?.search) searchParams.set('search', params.search)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const query = searchParams.toString()
    return this.request<PaginatedResponse<Agent>>(
      `/api/agents${query ? `?${query}` : ''}`
    )
  }

  async getAgent(id: string) {
    return this.request<Agent>(`/api/agents/${id}`)
  }

  async createAgent(data: Partial<Agent>) {
    return this.request<Agent>('/api/agents', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateAgent(id: string, data: Partial<Agent>) {
    return this.request<Agent>(`/api/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteAgent(id: string) {
    return this.request<void>(`/api/agents/${id}`, {
      method: 'DELETE',
    })
  }

  // Template endpoints
  async getTemplates(params?: {
    category?: string
    difficulty?: string
    featured?: boolean
    page?: number
    limit?: number
  }) {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set('category', params.category)
    if (params?.difficulty) searchParams.set('difficulty', params.difficulty)
    if (params?.featured) searchParams.set('featured', params.featured.toString())
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const query = searchParams.toString()
    return this.request<PaginatedResponse<WorkflowTemplate>>(
      `/api/templates${query ? `?${query}` : ''}`
    )
  }

  async getTemplate(id: string) {
    return this.request<WorkflowTemplate>(`/api/templates/${id}`)
  }

  async createTemplate(data: Partial<WorkflowTemplate>) {
    return this.request<WorkflowTemplate>('/api/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // File upload
  async uploadFile(file: File, type: 'image' | 'document' = 'document') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    return this.request<{ url: string; filename: string }>('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type, let browser set it with boundary
      },
    })
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL)

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.login(credentials),
  register: (data: { 
    email: string; 
    password: string; 
    username: string; 
    full_name?: string 
  }) => apiClient.register(data),
  refreshToken: (token: string) => apiClient.refreshToken(token),
  verifyToken: (token: string) => apiClient.verifyToken(token),
  updateProfile: (updates: Partial<User>) => apiClient.updateProfile(updates),
}

// Workflow API
export const workflowApi = {
  getWorkflows: (params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
  }) => apiClient.getWorkflows(params),
  getWorkflow: (id: string) => apiClient.getWorkflow(id),
  createWorkflow: (data: {
    name: string
    description?: string
    workflow_data: any
    execution_config?: any
    tags?: string[]
  }) => apiClient.createWorkflow(data),
  updateWorkflow: (id: string, data: Partial<Workflow>) => 
    apiClient.updateWorkflow(id, data),
  deleteWorkflow: (id: string) => apiClient.deleteWorkflow(id),
  executeWorkflow: (id: string, inputData?: Record<string, any>) =>
    apiClient.executeWorkflow(id, inputData),
}

// Execution API
export const executionApi = {
  getExecution: (id: string) => apiClient.getExecution(id),
  getExecutions: (params?: {
    workflow_id?: string
    page?: number
    limit?: number
    status?: string
  }) => apiClient.getExecutions(params),
  cancelExecution: (id: string) => apiClient.cancelExecution(id),
}

// Agent API
export const agentApi = {
  getAgents: (params?: {
    category?: string
    search?: string
    page?: number
    limit?: number
  }) => apiClient.getAgents(params),
  getAgent: (id: string) => apiClient.getAgent(id),
  createAgent: (data: Partial<Agent>) => apiClient.createAgent(data),
  updateAgent: (id: string, data: Partial<Agent>) => 
    apiClient.updateAgent(id, data),
  deleteAgent: (id: string) => apiClient.deleteAgent(id),
}

// Template API
export const templateApi = {
  getTemplates: (params?: {
    category?: string
    difficulty?: string
    featured?: boolean
    page?: number
    limit?: number
  }) => apiClient.getTemplates(params),
  getTemplate: (id: string) => apiClient.getTemplate(id),
  createTemplate: (data: Partial<WorkflowTemplate>) => 
    apiClient.createTemplate(data),
}

// File API
export const fileApi = {
  uploadFile: (file: File, type: 'image' | 'document' = 'document') =>
    apiClient.uploadFile(file, type),
}

// Set up token management
export const setupApiClient = (token: string | null) => {
  apiClient.setToken(token)
}
