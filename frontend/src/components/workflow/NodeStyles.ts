// Global Node Design System
export interface NodeCategory {
  name: string
  colors: string[]
  icon: string
  borderStyle: 'gradient' | 'solid'
  connectionPoints: {
    top?: boolean
    bottom?: boolean
    left?: boolean
    right?: boolean
  }
}

export const NODE_CATEGORIES: Record<string, NodeCategory> = {
  // AI Agent - Central orchestrator with solid border
  aiAgent: {
    name: 'AI Agent',
    colors: ['#6b7280', '#9ca3af'], // Gray tones
    icon: 'robot',
    borderStyle: 'solid',
    connectionPoints: {
      top: true,
      bottom: true,
      right: true
    }
  },
  
  // Trigger nodes - Manual, Schedule, Webhook, etc.
  trigger: {
    name: 'Trigger',
    colors: ['#40ffaa', '#00ff88', '#00cc66'],
    icon: 'zap',
    borderStyle: 'gradient',
    connectionPoints: {
      right: true
    }
  },
  
  // AI Models - Anthropic, OpenAI, etc.
  aiModel: {
    name: 'AI Model',
    colors: ['#00bcd4', '#0097a7', '#006064'],
    icon: 'brain',
    borderStyle: 'gradient',
    connectionPoints: {
      left: true,
      right: true
    }
  },
  
  // Communication Services - Telegram, Slack, etc.
  communication: {
    name: 'Communication',
    colors: ['#ff4081', '#e91e63', '#c2185b'],
    icon: 'message-circle',
    borderStyle: 'gradient',
    connectionPoints: {
      left: true,
      right: true
    }
  },
  
  // Development Tools - GitHub, etc.
  development: {
    name: 'Development',
    colors: ['#ff9800', '#f57c00', '#ef6c00'],
    icon: 'code',
    borderStyle: 'gradient',
    connectionPoints: {
      left: true,
      right: true
    }
  },
  
  // Memory/Storage - Postgres, etc.
  memory: {
    name: 'Memory',
    colors: ['#9c27b0', '#7b1fa2', '#6a1b9a'],
    icon: 'database',
    borderStyle: 'gradient',
    connectionPoints: {
      left: true,
      right: true
    }
  },
  
  // Tools - Gmail, etc.
  tool: {
    name: 'Tool',
    colors: ['#3f51b5', '#303f9f', '#283593'],
    icon: 'wrench',
    borderStyle: 'gradient',
    connectionPoints: {
      left: true,
      right: true
    }
  }
}

export const getNodeCategory = (nodeType: string, data: any): NodeCategory => {
  // Determine category based on node type and data
  if (nodeType === 'aiAgent') return NODE_CATEGORIES.aiAgent
  if (nodeType === 'triggerNode') return NODE_CATEGORIES.trigger
  if (data?.agentType?.includes('model') || data?.modelType) return NODE_CATEGORIES.aiModel
  if (data?.serviceType === 'communication' || data?.label?.toLowerCase().includes('telegram') || data?.label?.toLowerCase().includes('slack')) return NODE_CATEGORIES.communication
  if (data?.serviceType === 'development' || data?.label?.toLowerCase().includes('github')) return NODE_CATEGORIES.development
  if (data?.serviceType === 'memory' || data?.label?.toLowerCase().includes('memory') || data?.label?.toLowerCase().includes('postgres')) return NODE_CATEGORIES.memory
  if (data?.serviceType === 'tool' || data?.label?.toLowerCase().includes('gmail') || data?.label?.toLowerCase().includes('tool')) return NODE_CATEGORIES.tool
  
  // Default to trigger for unknown types
  return NODE_CATEGORIES.trigger
}

export const generateRandomColors = (category: NodeCategory): string[] => {
  const shuffled = [...category.colors].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 5)
}


