// =============================================================================
// CORE TYPES
// =============================================================================

export interface User {
  id: string
  email: string
  username: string
  full_name?: string
  avatar_url?: string
  plan_type: 'free' | 'pro' | 'enterprise'
  created_at: string
  updated_at: string
}

export interface Workflow {
  id: string
  user_id: string
  name: string
  description?: string
  version: number
  status: 'draft' | 'published' | 'archived'
  is_public: boolean
  tags: string[]
  workflow_data: WorkflowData
  execution_config: ExecutionConfig
  created_at: string
  updated_at: string
}

export interface WorkflowData {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  viewport: {
    x: number
    y: number
    zoom: number
  }
}

export interface WorkflowNode {
  id: string
  type: 'agent' | 'condition' | 'trigger' | 'action'
  position: {
    x: number
    y: number
  }
  data: {
    agentType?: string
    serviceType?: string
    config: Record<string, any>
    label: string
    status?: 'idle' | 'running' | 'completed' | 'error'
    lastExecution?: {
      duration: number
      timestamp: string
      error?: string
    }
  }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  type?: 'default' | 'smoothstep' | 'straight'
  animated?: boolean
  style?: Record<string, any>
}

export interface ExecutionConfig {
  timeout: number
  retries: number
  parallel: boolean
  variables: Record<string, any>
}

// =============================================================================
// AGENT TYPES
// =============================================================================

export interface Agent {
  id: string
  name: string
  display_name: string
  description: string
  category: 'llm' | 'tool' | 'api' | 'custom' | 'data' | 'integration'
  icon_url?: string
  config_schema: JSONSchema
  input_schema: JSONSchema
  output_schema: JSONSchema
  code_template?: string
  is_builtin: boolean
  is_public: boolean
  author_id?: string
  downloads: number
  rating: number
  created_at: string
  updated_at: string
}

export interface JSONSchema {
  type: 'object' | 'string' | 'number' | 'boolean' | 'array'
  properties?: Record<string, JSONSchema>
  required?: string[]
  items?: JSONSchema
  enum?: any[]
  default?: any
  description?: string
  title?: string
}

// =============================================================================
// EXECUTION TYPES
// =============================================================================

export interface WorkflowExecution {
  id: string
  workflow_id: string
  user_id: string
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  trigger_type: 'manual' | 'schedule' | 'webhook' | 'api'
  input_data: Record<string, any>
  output_data?: Record<string, any>
  error_message?: string
  execution_time?: number
  started_at: string
  completed_at?: string
  logs: ExecutionLog[]
}

export interface ExecutionLog {
  id: string
  execution_id: string
  agent_id?: string
  agent_name: string
  step_index: number
  status: 'started' | 'completed' | 'failed' | 'skipped'
  input_data?: Record<string, any>
  output_data?: Record<string, any>
  error_message?: string
  execution_time?: number
  memory_usage?: number
  started_at: string
  completed_at?: string
  debug_info?: Record<string, any>
}

// =============================================================================
// TEMPLATE TYPES
// =============================================================================

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  workflow_data: WorkflowData
  preview_image_url?: string
  author_id?: string
  is_featured: boolean
  downloads: number
  rating: number
  created_at: string
}

// =============================================================================
// COLLABORATION TYPES
// =============================================================================

export interface WorkflowCollaborator {
  id: string
  workflow_id: string
  user_id: string
  permission: 'view' | 'edit' | 'admin'
  invited_by?: string
  created_at: string
}

export interface CollaborationSession {
  id: string
  workflow_id: string
  user_id: string
  cursor_position?: {
    x: number
    y: number
  }
  last_seen: string
  is_active: boolean
}

// =============================================================================
// API TYPES
// =============================================================================

export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  timestamp: string
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ApiError {
  message: string
  code: string
  details?: Record<string, any>
  timestamp: string
}

// =============================================================================
// UI TYPES
// =============================================================================

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface BreadcrumbItem {
  label: string
  href?: string
  active?: boolean
}

export interface MenuItem {
  id: string
  label: string
  href?: string
  icon?: string
  children?: MenuItem[]
  badge?: string | number
  disabled?: boolean
}

export interface TableColumn<T = any> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, item: T) => React.ReactNode
  width?: string | number
}

// =============================================================================
// FORM TYPES
// =============================================================================

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio'
  required?: boolean
  placeholder?: string
  options?: Array<{ label: string; value: any }>
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export interface FormData {
  [key: string]: any
}

// =============================================================================
// WEBSOCKET TYPES
// =============================================================================

export interface WebSocketMessage {
  type: string
  data: any
  timestamp: string
}

export interface WorkflowUpdateMessage extends WebSocketMessage {
  type: 'workflow_update'
  data: {
    workflow_id: string
    changes: Partial<WorkflowData>
    user_id: string
  }
}

export interface ExecutionUpdateMessage extends WebSocketMessage {
  type: 'execution_update'
  data: {
    execution_id: string
    workflow_id: string
    update: Partial<WorkflowExecution>
  }
}

export interface CollaborationMessage extends WebSocketMessage {
  type: 'collaboration'
  data: {
    workflow_id: string
    user_id: string
    action: 'cursor_update' | 'node_update' | 'user_joined' | 'user_left'
    payload: any
  }
}

// =============================================================================
// STORE TYPES
// =============================================================================

export interface WorkflowStore {
  currentWorkflow: Workflow | null
  isExecuting: boolean
  executionLogs: ExecutionLog[]
  selectedNodes: string[]
  sidebarOpen: boolean
  
  // Actions
  setCurrentWorkflow: (workflow: Workflow | null) => void
  updateNodes: (nodes: WorkflowNode[]) => void
  updateEdges: (edges: WorkflowEdge[]) => void
  setExecuting: (executing: boolean) => void
  addExecutionLog: (log: ExecutionLog) => void
  clearExecutionLogs: () => void
  setSelectedNodes: (nodeIds: string[]) => void
  toggleSidebar: () => void
}

export interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  
  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type Status = 'idle' | 'loading' | 'success' | 'error'

export type Theme = 'light' | 'dark'

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja'

export type SortOrder = 'asc' | 'desc'

export type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte'

// =============================================================================
// COMPONENT PROPS TYPES
// =============================================================================

export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: (e?: React.MouseEvent) => void
  type?: 'button' | 'submit' | 'reset'
  title?: string
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  error?: string
}

export interface SelectProps extends BaseComponentProps {
  options: Array<{ label: string; value: any }>
  value?: any
  onChange?: (value: any) => void
  placeholder?: string
  disabled?: boolean
  multiple?: boolean
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
}

export interface CardProps extends BaseComponentProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  variant?: 'default' | 'glass' | 'gradient-border'
  hoverable?: boolean
  onClick?: () => void
}







