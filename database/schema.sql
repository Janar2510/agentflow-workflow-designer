-- AgentFlow Database Schema for Supabase
-- Complete implementation with all tables, indexes, and RLS policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Users and Authentication (handled by Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Workflows
CREATE TABLE workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_public BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  workflow_data JSONB NOT NULL, -- Visual flow data
  execution_config JSONB NOT NULL DEFAULT '{}'::jsonb, -- Runtime configuration
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Registry
CREATE TABLE agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('llm', 'tool', 'api', 'custom', 'data', 'integration')),
  icon_url TEXT,
  config_schema JSONB NOT NULL, -- JSON schema for configuration
  input_schema JSONB NOT NULL,
  output_schema JSONB NOT NULL,
  code_template TEXT, -- Python code template
  is_builtin BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  author_id UUID REFERENCES profiles(id),
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow Executions
CREATE TABLE workflow_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled', 'queued')),
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('manual', 'schedule', 'webhook', 'api')),
  input_data JSONB DEFAULT '{}'::jsonb,
  output_data JSONB,
  error_message TEXT,
  execution_time INTEGER, -- milliseconds
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  logs JSONB DEFAULT '[]'::jsonb
);

-- Agent Execution Logs
CREATE TABLE agent_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  execution_id UUID REFERENCES workflow_executions(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id),
  agent_name TEXT NOT NULL,
  step_index INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed', 'skipped')),
  input_data JSONB,
  output_data JSONB,
  error_message TEXT,
  execution_time INTEGER, -- milliseconds
  memory_usage INTEGER,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  debug_info JSONB DEFAULT '{}'::jsonb
);

-- Workflow Templates
CREATE TABLE workflow_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  workflow_data JSONB NOT NULL,
  preview_image_url TEXT,
  author_id UUID REFERENCES profiles(id),
  is_featured BOOLEAN DEFAULT FALSE,
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaboration
CREATE TABLE workflow_collaborators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  permission TEXT DEFAULT 'view' CHECK (permission IN ('view', 'edit', 'admin')),
  invited_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workflow_id, user_id)
);

-- Real-time Collaboration Sessions
CREATE TABLE collaboration_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  cursor_position JSONB,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Workflow Schedules
CREATE TABLE workflow_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cron_expression TEXT NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  is_active BOOLEAN DEFAULT TRUE,
  last_run TIMESTAMP WITH TIME ZONE,
  next_run TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhooks
CREATE TABLE webhooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT,
  events TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics and Metrics
CREATE TABLE workflow_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(15,4) NOT NULL,
  metric_unit TEXT,
  dimensions JSONB DEFAULT '{}'::jsonb,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Marketplace Reviews
CREATE TABLE agent_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(agent_id, user_id)
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Workflows indexes
CREATE INDEX idx_workflows_user_id ON workflows(user_id);
CREATE INDEX idx_workflows_status ON workflows(status);
CREATE INDEX idx_workflows_is_public ON workflows(is_public);
CREATE INDEX idx_workflows_tags ON workflows USING gin(tags);
CREATE INDEX idx_workflows_created_at ON workflows(created_at DESC);

-- Workflow executions indexes
CREATE INDEX idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_user_id ON workflow_executions(user_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX idx_workflow_executions_started_at ON workflow_executions(started_at DESC);

-- Agent logs indexes
CREATE INDEX idx_agent_logs_execution_id ON agent_logs(execution_id);
CREATE INDEX idx_agent_logs_agent_id ON agent_logs(agent_id);
CREATE INDEX idx_agent_logs_status ON agent_logs(status);
CREATE INDEX idx_agent_logs_started_at ON agent_logs(started_at DESC);

-- Agents indexes
CREATE INDEX idx_agents_category ON agents(category);
CREATE INDEX idx_agents_is_public ON agents(is_public);
CREATE INDEX idx_agents_is_builtin ON agents(is_builtin);
CREATE INDEX idx_agents_rating ON agents(rating DESC);
CREATE INDEX idx_agents_downloads ON agents(downloads DESC);

-- Templates indexes
CREATE INDEX idx_workflow_templates_category ON workflow_templates(category);
CREATE INDEX idx_workflow_templates_difficulty ON workflow_templates(difficulty);
CREATE INDEX idx_workflow_templates_is_featured ON workflow_templates(is_featured);
CREATE INDEX idx_workflow_templates_rating ON workflow_templates(rating DESC);

-- Collaboration indexes
CREATE INDEX idx_workflow_collaborators_workflow_id ON workflow_collaborators(workflow_id);
CREATE INDEX idx_workflow_collaborators_user_id ON workflow_collaborators(user_id);
CREATE INDEX idx_collaboration_sessions_workflow_id ON collaboration_sessions(workflow_id);
CREATE INDEX idx_collaboration_sessions_user_id ON collaboration_sessions(user_id);

-- Schedules indexes
CREATE INDEX idx_workflow_schedules_workflow_id ON workflow_schedules(workflow_id);
CREATE INDEX idx_workflow_schedules_is_active ON workflow_schedules(is_active);
CREATE INDEX idx_workflow_schedules_next_run ON workflow_schedules(next_run);

-- Analytics indexes
CREATE INDEX idx_workflow_analytics_workflow_id ON workflow_analytics(workflow_id);
CREATE INDEX idx_workflow_analytics_metric_name ON workflow_analytics(metric_name);
CREATE INDEX idx_workflow_analytics_recorded_at ON workflow_analytics(recorded_at DESC);

-- =============================================================================
-- FULL-TEXT SEARCH INDEXES
-- =============================================================================

-- Workflows full-text search
CREATE INDEX idx_workflows_search ON workflows USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Agents full-text search
CREATE INDEX idx_agents_search ON agents USING gin(to_tsvector('english', display_name || ' ' || description));

-- Templates full-text search
CREATE INDEX idx_workflow_templates_search ON workflow_templates USING gin(to_tsvector('english', name || ' ' || description));

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Workflows policies
CREATE POLICY "Users can view own workflows or public workflows" ON workflows
  FOR SELECT USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can insert own workflows" ON workflows
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own workflows" ON workflows
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own workflows" ON workflows
  FOR DELETE USING (user_id = auth.uid());

-- Workflow executions policies
CREATE POLICY "Users can view own workflow executions" ON workflow_executions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own workflow executions" ON workflow_executions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Agent logs policies
CREATE POLICY "Users can view logs for own executions" ON agent_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workflow_executions 
      WHERE workflow_executions.id = agent_logs.execution_id 
      AND workflow_executions.user_id = auth.uid()
    )
  );

-- Workflow collaborators policies
CREATE POLICY "Users can view collaborators for accessible workflows" ON workflow_collaborators
  FOR SELECT USING (
    workflow_id IN (
      SELECT id FROM workflows 
      WHERE user_id = auth.uid() OR is_public = true
    )
  );

CREATE POLICY "Workflow owners can manage collaborators" ON workflow_collaborators
  FOR ALL USING (
    workflow_id IN (
      SELECT id FROM workflows WHERE user_id = auth.uid()
    )
  );

-- Collaboration sessions policies
CREATE POLICY "Users can view sessions for accessible workflows" ON collaboration_sessions
  FOR SELECT USING (
    workflow_id IN (
      SELECT id FROM workflows 
      WHERE user_id = auth.uid() OR is_public = true
    )
  );

CREATE POLICY "Users can manage own sessions" ON collaboration_sessions
  FOR ALL USING (user_id = auth.uid());

-- Workflow schedules policies
CREATE POLICY "Users can manage own workflow schedules" ON workflow_schedules
  FOR ALL USING (user_id = auth.uid());

-- Webhooks policies
CREATE POLICY "Users can manage own webhooks" ON webhooks
  FOR ALL USING (user_id = auth.uid());

-- Analytics policies
CREATE POLICY "Users can view own workflow analytics" ON workflow_analytics
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own workflow analytics" ON workflow_analytics
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Agent reviews policies
CREATE POLICY "Users can view all agent reviews" ON agent_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own agent reviews" ON agent_reviews
  FOR ALL USING (user_id = auth.uid());

-- =============================================================================
-- FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_schedules_updated_at BEFORE UPDATE ON workflow_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_reviews_updated_at BEFORE UPDATE ON agent_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update agent rating when review is added/updated
CREATE OR REPLACE FUNCTION update_agent_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE agents 
  SET rating = (
    SELECT AVG(rating)::DECIMAL(3,2)
    FROM agent_reviews 
    WHERE agent_id = COALESCE(NEW.agent_id, OLD.agent_id)
  )
  WHERE id = COALESCE(NEW.agent_id, OLD.agent_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update agent rating
CREATE TRIGGER update_agent_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON agent_reviews
  FOR EACH ROW EXECUTE FUNCTION update_agent_rating();

-- =============================================================================
-- VIEWS FOR COMMON QUERIES
-- =============================================================================

-- Workflow with execution stats
CREATE VIEW workflow_stats AS
SELECT 
  w.*,
  COUNT(we.id) as execution_count,
  COUNT(CASE WHEN we.status = 'completed' THEN 1 END) as successful_executions,
  COUNT(CASE WHEN we.status = 'failed' THEN 1 END) as failed_executions,
  AVG(we.execution_time) as avg_execution_time,
  MAX(we.started_at) as last_execution
FROM workflows w
LEFT JOIN workflow_executions we ON w.id = we.workflow_id
GROUP BY w.id;

-- Agent with stats
CREATE VIEW agent_stats AS
SELECT 
  a.*,
  COUNT(ar.id) as review_count,
  COUNT(CASE WHEN ar.rating >= 4 THEN 1 END) as positive_reviews
FROM agents a
LEFT JOIN agent_reviews ar ON a.id = ar.agent_id
GROUP BY a.id;

-- =============================================================================
-- INITIAL DATA
-- =============================================================================

-- Insert built-in agents
INSERT INTO agents (name, display_name, description, category, is_builtin, is_public, config_schema, input_schema, output_schema) VALUES
('llm_text_generator', 'LLM Text Generator', 'Generates text using large language models', 'llm', true, true, 
 '{"type": "object", "properties": {"temperature": {"type": "number", "default": 0.7}, "max_tokens": {"type": "integer", "default": 1000}}}',
 '{"type": "object", "properties": {"prompt": {"type": "string", "description": "Input prompt"}}, "required": ["prompt"]}',
 '{"type": "object", "properties": {"generated_text": {"type": "string"}}}'),

('data_processor', 'Data Processor', 'Processes and transforms data', 'data', true, true,
 '{"type": "object", "properties": {"operation": {"type": "string", "enum": ["filter", "transform", "aggregate", "sort", "group", "merge", "deduplicate"]}}}',
 '{"type": "object", "properties": {"data": {"type": "array", "description": "Input data"}, "operation": {"type": "string", "description": "Processing operation"}}, "required": ["data", "operation"]}',
 '{"type": "object", "properties": {"processed_data": {"type": "array"}}}'),

('api_caller', 'API Caller', 'Makes HTTP API calls and processes responses', 'integration', true, true,
 '{"type": "object", "properties": {"timeout": {"type": "integer", "default": 30}, "retries": {"type": "integer", "default": 3}}}',
 '{"type": "object", "properties": {"url": {"type": "string", "description": "API endpoint URL"}, "method": {"type": "string", "default": "GET"}, "headers": {"type": "object", "default": {}}, "data": {"type": "object", "default": {}}}, "required": ["url"]}',
 '{"type": "object", "properties": {"response": {"type": "object"}}}'),

('code_analyzer', 'Code Analyzer', 'Analyzes code for quality, security, and best practices', 'tool', true, true,
 '{"type": "object", "properties": {"language": {"type": "string", "enum": ["python", "javascript", "typescript", "java", "cpp", "csharp"]}}}',
 '{"type": "object", "properties": {"code": {"type": "string", "description": "Code to analyze"}, "language": {"type": "string", "description": "Programming language"}}, "required": ["code"]}',
 '{"type": "object", "properties": {"analysis": {"type": "object"}, "quality_score": {"type": "number"}}}');

-- Insert sample workflow templates
INSERT INTO workflow_templates (name, description, category, difficulty, workflow_data, is_featured) VALUES
('Data Processing Pipeline', 'A complete data processing workflow with validation, transformation, and output', 'data', 'beginner',
 '{"nodes": [{"id": "input", "type": "trigger", "position": {"x": 100, "y": 100}, "data": {"label": "Data Input"}}, {"id": "process", "type": "agent", "position": {"x": 300, "y": 100}, "data": {"agentType": "data_processor", "label": "Process Data"}}, {"id": "output", "type": "action", "position": {"x": 500, "y": 100}, "data": {"label": "Save Results"}}], "edges": [{"id": "e1", "source": "input", "target": "process"}, {"id": "e2", "source": "process", "target": "output"}]}',
 true),

('API Integration Workflow', 'Connect to external APIs and process responses', 'integration', 'intermediate',
 '{"nodes": [{"id": "trigger", "type": "trigger", "position": {"x": 100, "y": 100}, "data": {"label": "Webhook Trigger"}}, {"id": "api_call", "type": "agent", "position": {"x": 300, "y": 100}, "data": {"agentType": "api_caller", "label": "Call API"}}, {"id": "process", "type": "agent", "position": {"x": 500, "y": 100}, "data": {"agentType": "data_processor", "label": "Process Response"}}, {"id": "notify", "type": "action", "position": {"x": 700, "y": 100}, "data": {"label": "Send Notification"}}], "edges": [{"id": "e1", "source": "trigger", "target": "api_call"}, {"id": "e2", "source": "api_call", "target": "process"}, {"id": "e3", "source": "process", "target": "notify"}]}',
 true);

