-- Community System Database Schema for AgentFlow
-- Extends the existing schema with community features

-- =============================================================================
-- COMMUNITY TABLES
-- =============================================================================

-- Forum Categories
CREATE TABLE forum_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#667eea',
  icon TEXT DEFAULT '💬',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum Posts
CREATE TABLE forum_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES forum_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'locked')),
  post_type TEXT DEFAULT 'discussion' CHECK (post_type IN ('discussion', 'question', 'tutorial', 'announcement', 'showcase')),
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum Comments/Replies
CREATE TABLE forum_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES forum_comments(id) ON DELETE CASCADE, -- For nested replies
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  is_solution BOOLEAN DEFAULT FALSE, -- For marking solutions to questions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post Likes
CREATE TABLE post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Comment Likes
CREATE TABLE comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES forum_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- User Reputation System
CREATE TABLE user_reputation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  level TEXT DEFAULT 'newbie' CHECK (level IN ('newbie', 'member', 'contributor', 'expert', 'guru')),
  badges TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Reputation Events (for tracking reputation changes)
CREATE TABLE reputation_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('post_created', 'comment_created', 'post_liked', 'comment_liked', 'solution_accepted', 'agent_created', 'agent_downloaded')),
  points INTEGER NOT NULL,
  description TEXT,
  related_id UUID, -- ID of related post, comment, agent, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Leaderboard (materialized view for performance)
CREATE TABLE community_leaderboard (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  reputation_points INTEGER DEFAULT 0,
  agents_created INTEGER DEFAULT 0,
  agents_sold INTEGER DEFAULT 0,
  posts_created INTEGER DEFAULT 0,
  comments_created INTEGER DEFAULT 0,
  total_likes_received INTEGER DEFAULT 0,
  rank_position INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Notifications
CREATE TABLE community_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('post_reply', 'comment_reply', 'post_liked', 'comment_liked', 'solution_accepted', 'mention', 'badge_earned')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id UUID, -- ID of related post, comment, etc.
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Badges
CREATE TABLE community_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT DEFAULT '#667eea',
  criteria JSONB NOT NULL, -- JSON criteria for earning the badge
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Badges (many-to-many relationship)
CREATE TABLE user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES community_badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Community Events/Announcements
CREATE TABLE community_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('announcement', 'contest', 'webinar', 'update', 'maintenance')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Forum posts indexes
CREATE INDEX idx_forum_posts_category ON forum_posts(category_id);
CREATE INDEX idx_forum_posts_author ON forum_posts(author_id);
CREATE INDEX idx_forum_posts_status ON forum_posts(status);
CREATE INDEX idx_forum_posts_type ON forum_posts(post_type);
CREATE INDEX idx_forum_posts_created ON forum_posts(created_at DESC);
CREATE INDEX idx_forum_posts_activity ON forum_posts(last_activity_at DESC);
CREATE INDEX idx_forum_posts_pinned ON forum_posts(is_pinned DESC, last_activity_at DESC);
CREATE INDEX idx_forum_posts_featured ON forum_posts(is_featured DESC, created_at DESC);

-- Forum comments indexes
CREATE INDEX idx_forum_comments_post ON forum_comments(post_id);
CREATE INDEX idx_forum_comments_author ON forum_comments(author_id);
CREATE INDEX idx_forum_comments_parent ON forum_comments(parent_id);
CREATE INDEX idx_forum_comments_created ON forum_comments(created_at DESC);

-- Likes indexes
CREATE INDEX idx_post_likes_post ON post_likes(post_id);
CREATE INDEX idx_post_likes_user ON post_likes(user_id);
CREATE INDEX idx_comment_likes_comment ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user ON comment_likes(user_id);

-- Reputation indexes
CREATE INDEX idx_user_reputation_points ON user_reputation(points DESC);
CREATE INDEX idx_reputation_events_user ON reputation_events(user_id);
CREATE INDEX idx_reputation_events_type ON reputation_events(event_type);

-- Leaderboard indexes
CREATE INDEX idx_leaderboard_points ON community_leaderboard(reputation_points DESC);
CREATE INDEX idx_leaderboard_agents ON community_leaderboard(agents_created DESC);
CREATE INDEX idx_leaderboard_sales ON community_leaderboard(agents_sold DESC);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON community_notifications(user_id);
CREATE INDEX idx_notifications_read ON community_notifications(is_read);
CREATE INDEX idx_notifications_created ON community_notifications(created_at DESC);

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================================================

-- Update post reply count when comment is added/deleted
CREATE OR REPLACE FUNCTION update_post_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_posts 
    SET reply_count = reply_count + 1,
        last_activity_at = NOW()
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_posts 
    SET reply_count = reply_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_reply_count
  AFTER INSERT OR DELETE ON forum_comments
  FOR EACH ROW EXECUTE FUNCTION update_post_reply_count();

-- Update post like count when like is added/deleted
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_posts 
    SET like_count = like_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_posts 
    SET like_count = like_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_like_count
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_like_count();

-- Update comment like count when like is added/deleted
CREATE OR REPLACE FUNCTION update_comment_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_comments 
    SET like_count = like_count + 1
    WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_comments 
    SET like_count = like_count - 1
    WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comment_like_count
  AFTER INSERT OR DELETE ON comment_likes
  FOR EACH ROW EXECUTE FUNCTION update_comment_like_count();

-- Update user reputation when reputation event is added
CREATE OR REPLACE FUNCTION update_user_reputation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_reputation 
  SET points = points + NEW.points,
      updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  -- Update user level based on points
  UPDATE user_reputation 
  SET level = CASE 
    WHEN points >= 10000 THEN 'guru'
    WHEN points >= 5000 THEN 'expert'
    WHEN points >= 1000 THEN 'contributor'
    WHEN points >= 100 THEN 'member'
    ELSE 'newbie'
  END
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_reputation
  AFTER INSERT ON reputation_events
  FOR EACH ROW EXECUTE FUNCTION update_user_reputation();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reputation ENABLE ROW LEVEL SECURITY;
ALTER TABLE reputation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_events ENABLE ROW LEVEL SECURITY;

-- Forum categories policies
CREATE POLICY "Anyone can view forum categories" ON forum_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage forum categories" ON forum_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND plan_type = 'enterprise')
);

-- Forum posts policies
CREATE POLICY "Anyone can view published posts" ON forum_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Users can view their own posts" ON forum_posts FOR SELECT USING (author_id = auth.uid());
CREATE POLICY "Users can create posts" ON forum_posts FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "Users can update their own posts" ON forum_posts FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Users can delete their own posts" ON forum_posts FOR DELETE USING (author_id = auth.uid());

-- Forum comments policies
CREATE POLICY "Anyone can view comments" ON forum_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON forum_comments FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "Users can update their own comments" ON forum_comments FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Users can delete their own comments" ON forum_comments FOR DELETE USING (author_id = auth.uid());

-- Likes policies
CREATE POLICY "Users can view likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own likes" ON post_likes FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can view comment likes" ON comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own comment likes" ON comment_likes FOR ALL USING (user_id = auth.uid());

-- Reputation policies
CREATE POLICY "Users can view reputation" ON user_reputation FOR SELECT USING (true);
CREATE POLICY "Users can view their own reputation" ON user_reputation FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can update reputation" ON user_reputation FOR UPDATE USING (true);

-- Leaderboard policies
CREATE POLICY "Anyone can view leaderboard" ON community_leaderboard FOR SELECT USING (true);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON community_notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications" ON community_notifications FOR UPDATE USING (user_id = auth.uid());

-- Badges policies
CREATE POLICY "Anyone can view badges" ON community_badges FOR SELECT USING (true);
CREATE POLICY "Users can view their own badges" ON user_badges FOR SELECT USING (user_id = auth.uid());

-- Events policies
CREATE POLICY "Anyone can view events" ON community_events FOR SELECT USING (true);

-- =============================================================================
-- INITIAL DATA
-- =============================================================================

-- Insert default forum categories
INSERT INTO forum_categories (name, description, slug, color, icon, sort_order) VALUES
('General Discussion', 'General discussions about AgentFlow and AI agents', 'general', '#667eea', '💬', 1),
('Tutorials & Guides', 'Step-by-step tutorials and guides', 'tutorials', '#f093fb', '📚', 2),
('Showcase', 'Share your amazing workflow creations', 'showcase', '#4facfe', '🎨', 3),
('Help & Support', 'Get help with technical issues', 'help', '#fa709a', '🆘', 4),
('Feature Requests', 'Suggest new features and improvements', 'features', '#a8edea', '💡', 5),
('Announcements', 'Official announcements and updates', 'announcements', '#fed6e3', '📢', 6);

-- Insert default badges
INSERT INTO community_badges (name, description, icon, color, criteria) VALUES
('First Post', 'Created your first forum post', '🎯', '#667eea', '{"posts_created": 1}'),
('Helpful', 'Received 10 likes on your posts', '👍', '#4facfe', '{"likes_received": 10}'),
('Expert', 'Reached 1000 reputation points', '⭐', '#f093fb', '{"reputation_points": 1000}'),
('Agent Creator', 'Created your first agent', '🤖', '#fa709a', '{"agents_created": 1}'),
('Top Contributor', 'In top 10 of leaderboard', '🏆', '#a8edea', '{"leaderboard_rank": 10}'),
('Community Helper', 'Helped solve 5 questions', '🆘', '#fed6e3', '{"solutions_accepted": 5}');

-- =============================================================================
-- FUNCTIONS FOR COMMUNITY FEATURES
-- =============================================================================

-- Function to get user's community stats
CREATE OR REPLACE FUNCTION get_user_community_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'posts_created', COALESCE(COUNT(DISTINCT fp.id), 0),
    'comments_created', COALESCE(COUNT(DISTINCT fc.id), 0),
    'likes_received', COALESCE(SUM(fp.like_count), 0),
    'reputation_points', COALESCE(ur.points, 0),
    'level', COALESCE(ur.level, 'newbie'),
    'badges_count', COALESCE(COUNT(DISTINCT ub.badge_id), 0)
  ) INTO result
  FROM profiles p
  LEFT JOIN forum_posts fp ON fp.author_id = p.id
  LEFT JOIN forum_comments fc ON fc.author_id = p.id
  LEFT JOIN user_reputation ur ON ur.user_id = p.id
  LEFT JOIN user_badges ub ON ub.user_id = p.id
  WHERE p.id = user_uuid
  GROUP BY ur.points, ur.level;
  
  RETURN COALESCE(result, '{"posts_created": 0, "comments_created": 0, "likes_received": 0, "reputation_points": 0, "level": "newbie", "badges_count": 0}'::json);
END;
$$ LANGUAGE plpgsql;

-- Function to update leaderboard
CREATE OR REPLACE FUNCTION update_community_leaderboard()
RETURNS VOID AS $$
BEGIN
  -- Clear existing leaderboard
  DELETE FROM community_leaderboard;
  
  -- Insert updated leaderboard data
  INSERT INTO community_leaderboard (
    user_id, username, full_name, avatar_url, reputation_points, 
    agents_created, agents_sold, posts_created, comments_created, 
    total_likes_received, rank_position, last_updated
  )
  SELECT 
    p.id,
    p.username,
    p.full_name,
    p.avatar_url,
    COALESCE(ur.points, 0),
    COALESCE(agent_stats.agents_created, 0),
    COALESCE(agent_stats.agents_sold, 0),
    COALESCE(post_stats.posts_created, 0),
    COALESCE(comment_stats.comments_created, 0),
    COALESCE(like_stats.total_likes, 0),
    ROW_NUMBER() OVER (ORDER BY COALESCE(ur.points, 0) DESC),
    NOW()
  FROM profiles p
  LEFT JOIN user_reputation ur ON ur.user_id = p.id
  LEFT JOIN (
    SELECT author_id, COUNT(*) as agents_created, SUM(downloads) as agents_sold
    FROM agents 
    WHERE author_id IS NOT NULL
    GROUP BY author_id
  ) agent_stats ON agent_stats.author_id = p.id
  LEFT JOIN (
    SELECT author_id, COUNT(*) as posts_created
    FROM forum_posts
    GROUP BY author_id
  ) post_stats ON post_stats.author_id = p.id
  LEFT JOIN (
    SELECT author_id, COUNT(*) as comments_created
    FROM forum_comments
    GROUP BY author_id
  ) comment_stats ON comment_stats.author_id = p.id
  LEFT JOIN (
    SELECT fp.author_id, SUM(fp.like_count) as total_likes
    FROM forum_posts fp
    GROUP BY fp.author_id
  ) like_stats ON like_stats.author_id = p.id
  WHERE COALESCE(ur.points, 0) > 0 OR COALESCE(agent_stats.agents_created, 0) > 0;
END;
$$ LANGUAGE plpgsql;

