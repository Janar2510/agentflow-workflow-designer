# Contributing to AgentFlow

Thank you for your interest in contributing to AgentFlow! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

### Types of Contributions

We welcome several types of contributions:

- 🐛 **Bug Reports** - Help us identify and fix issues
- ✨ **Feature Requests** - Suggest new features or improvements
- 🔧 **Code Contributions** - Submit code improvements or new features
- 📚 **Documentation** - Improve our documentation
- 🧪 **Testing** - Add tests or improve test coverage
- 🎨 **Design** - UI/UX improvements and design system enhancements

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.9+
- Docker and Docker Compose
- Git

### Development Setup

1. **Fork and Clone**
```bash
git clone https://github.com/yourusername/agentflow.git
cd agentflow
```

2. **Install Dependencies**
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
pip install -r requirements.txt
```

3. **Set up Environment**
```bash
cp .env.example .env
# Configure your environment variables
```

4. **Start Development Servers**
```bash
# Terminal 1 - Frontend
cd frontend && npm run dev

# Terminal 2 - Backend
cd backend && uvicorn main:app --reload

# Terminal 3 - Database (if using local)
docker-compose up -d postgres redis
```

## 📋 Development Guidelines

### Code Style

#### Frontend (TypeScript/React)
- Use **TypeScript** strict mode
- Follow **React** functional component patterns
- Use **ESLint** and **Prettier** for formatting
- Write **comprehensive tests** with React Testing Library
- Use **semantic commit messages**

```typescript
// ✅ Good
interface WorkflowNode {
  id: string;
  type: 'agent' | 'condition' | 'trigger';
  data: NodeData;
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ workflowId }) => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  
  return (
    <div className="agentflow-card">
      {/* Component content */}
    </div>
  );
};

// ❌ Avoid
const WorkflowEditor = ({ workflowId }) => {
  const [nodes, setNodes] = useState([]);
  // ...
};
```

#### Backend (Python/FastAPI)
- Follow **PEP 8** style guidelines
- Use **type hints** for all functions
- Write **async/await** for I/O operations
- Use **Pydantic** models for validation
- Write **comprehensive tests** with pytest

```python
# ✅ Good
from typing import Dict, Any, List
from pydantic import BaseModel

class WorkflowCreate(BaseModel):
    name: str
    description: str
    workflow_data: Dict[str, Any]

@router.post("/workflows", response_model=WorkflowResponse)
async def create_workflow(
    workflow_data: WorkflowCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> WorkflowResponse:
    """Create a new workflow with validation."""
    # Implementation
    pass

# ❌ Avoid
def create_workflow(workflow_data, user, db):
    # No type hints, no validation
    pass
```

### Git Workflow

1. **Create a Feature Branch**
```bash
git checkout -b feature/your-feature-name
git checkout -b fix/issue-description
git checkout -b docs/update-readme
```

2. **Make Your Changes**
- Write clean, well-documented code
- Add tests for new functionality
- Update documentation as needed
- Follow the coding standards

3. **Commit Your Changes**
```bash
# Use conventional commit messages
git commit -m "feat(workflow): add real-time collaboration"
git commit -m "fix(agent): handle timeout errors properly"
git commit -m "docs(api): update workflow execution examples"
git commit -m "test(workflow): add unit tests for execution engine"
```

4. **Push and Create Pull Request**
```bash
git push origin feature/your-feature-name
# Create PR on GitHub
```

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(workflow): add drag and drop workflow editor
fix(api): resolve authentication token refresh issue
docs(readme): update installation instructions
test(agent): add unit tests for code analyzer agent
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Backend Testing
```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_workflow_api.py
```

### Test Requirements
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database interactions
- **E2E Tests**: Test complete user workflows
- **Coverage**: Maintain 80%+ test coverage

## 📝 Pull Request Process

### Before Submitting

1. **Run Tests**
```bash
# Frontend
cd frontend && npm test && npm run lint

# Backend
cd backend && pytest && flake8 app/
```

2. **Check Code Quality**
- All tests pass
- No linting errors
- Code follows style guidelines
- Documentation is updated

3. **Test Your Changes**
- Test the feature thoroughly
- Verify it works in different scenarios
- Check for edge cases

### Pull Request Template

When creating a PR, please include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated Checks**
   - CI/CD pipeline runs tests
   - Code quality checks
   - Security scans

2. **Code Review**
   - At least one maintainer review required
   - Address feedback promptly
   - Make requested changes

3. **Merge**
   - Squash commits if needed
   - Merge to main branch
   - Delete feature branch

## 🎨 Design Contributions

### UI/UX Guidelines

- Follow the **AgentFlow Design System**
- Use **CSS custom properties** for colors and spacing
- Implement **responsive design** for all screen sizes
- Ensure **accessibility** compliance (WCAG 2.1)
- Use **consistent animations** and transitions

### Design System Rules

```css
/* ✅ Use CSS variables */
color: var(--text-primary);
padding: var(--space-4);
background: var(--bg-secondary);

/* ❌ Avoid hardcoded values */
color: #ffffff;
padding: 16px;
background: #1a1a2e;
```

### Component Guidelines

- Use **TypeScript interfaces** for props
- Implement **error boundaries** for robustness
- Add **loading states** for async operations
- Include **hover and focus states**
- Write **comprehensive tests**

## 🐛 Bug Reports

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Check if it's already fixed** in the latest version
3. **Gather information** about the bug

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 1.0.0]

## Additional Context
Screenshots, logs, etc.
```

## ✨ Feature Requests

### Before Requesting

1. **Check existing features** and roadmap
2. **Search for similar requests**
3. **Consider the scope** and complexity

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should it work?

## Alternatives Considered
Other solutions you've thought about

## Additional Context
Screenshots, mockups, use cases, etc.
```

## 📚 Documentation

### Documentation Types

- **API Documentation** - OpenAPI/Swagger specs
- **User Guides** - How-to guides for users
- **Developer Docs** - Technical documentation
- **Architecture Docs** - System design and patterns

### Writing Guidelines

- Use **clear, concise language**
- Include **code examples**
- Add **screenshots** where helpful
- Keep **up-to-date** with code changes
- Use **markdown** formatting

## 🏷️ Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Release notes prepared
- [ ] Security scan completed

## 🤝 Community Guidelines

### Code of Conduct

- Be **respectful** and inclusive
- **Welcome newcomers** and help them learn
- **Constructive feedback** in reviews
- **Focus on the code**, not the person
- **Be patient** with questions and learning

### Getting Help

- 💬 **Discord**: Join our community server
- 📧 **Email**: contributors@agentflow.dev
- 📖 **Docs**: Check our documentation first
- 🐛 **Issues**: Use GitHub issues for bugs

## 🏆 Recognition

Contributors will be recognized in:
- **CONTRIBUTORS.md** file
- **Release notes** for significant contributions
- **GitHub contributors** page
- **Community highlights**

## 📄 License

By contributing to AgentFlow, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to AgentFlow! 🚀**








