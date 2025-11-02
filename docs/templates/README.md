# AgentFlow Workflow Templates

## Overview

This directory contains pre-built workflow templates that users can use as starting points for their own workflows. Templates are organized by category and difficulty level.

## Template Structure

Each template follows this structure:

```
template-name/
├── README.md              # Template description and usage
├── workflow.json          # Workflow definition
├── config.json            # Default configuration
├── input-example.json     # Example input data
├── preview.png            # Template preview image
└── tests/                 # Template tests
    ├── test_basic.py
    └── test_advanced.py
```

## Template Categories

### Content Generation
- **Blog Post Generator**: Complete blog post creation workflow
- **Social Media Content**: Multi-platform social media content
- **Email Campaign**: Automated email content generation
- **Product Descriptions**: E-commerce product description generator

### Data Processing
- **CSV Data Cleaner**: Clean and validate CSV data
- **JSON Transformer**: Transform JSON data structures
- **Data Validator**: Validate data against schemas
- **Report Generator**: Generate reports from data

### Automation
- **File Processor**: Process files in a directory
- **API Integration**: Connect multiple APIs
- **Notification System**: Send notifications based on triggers
- **Backup Workflow**: Automated backup system

### Analysis
- **Code Review**: Automated code analysis
- **Performance Monitor**: Monitor system performance
- **Security Scanner**: Scan for security issues
- **Quality Assurance**: QA testing workflow

## Template Metadata

Each template includes metadata:

```json
{
  "name": "Template Name",
  "description": "Template description",
  "category": "content|data|automation|analysis",
  "difficulty": "beginner|intermediate|advanced",
  "tags": ["tag1", "tag2", "tag3"],
  "author": "Template author",
  "version": "1.0.0",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "downloads": 0,
  "rating": 0.0,
  "is_featured": false
}
```

## Using Templates

### From the UI
1. Go to the Templates page
2. Browse available templates
3. Click "Use Template" on desired template
4. Customize the workflow
5. Save as new workflow

### From the API
```bash
# Get template
curl -X GET "https://api.agentflow.com/templates/{template_id}"

# Use template
curl -X POST "https://api.agentflow.com/templates/{template_id}/use" \
  -H "Authorization: Bearer {token}" \
  -d '{"name": "My Workflow", "description": "Custom workflow"}'
```

## Creating Templates

### Template Requirements
1. **Complete Workflow**: Must be a complete, working workflow
2. **Documentation**: Clear README with usage instructions
3. **Examples**: Include input/output examples
4. **Tests**: Include basic tests
5. **Preview**: Include preview image

### Template Guidelines
1. **Use Standard Agents**: Prefer built-in agents when possible
2. **Clear Naming**: Use descriptive names for nodes and edges
3. **Error Handling**: Include error handling nodes
4. **Configuration**: Make configuration flexible
5. **Documentation**: Document all configuration options

### Template Validation
```python
# Validate template structure
def validate_template(template_path: str) -> bool:
    required_files = ['workflow.json', 'config.json', 'README.md']
    
    for file in required_files:
        if not os.path.exists(os.path.join(template_path, file)):
            return False
    
    # Validate workflow JSON
    with open(os.path.join(template_path, 'workflow.json')) as f:
        workflow = json.load(f)
    
    # Check required fields
    required_fields = ['nodes', 'edges', 'metadata']
    for field in required_fields:
        if field not in workflow:
            return False
    
    return True
```

## Template Examples

### Basic Content Generator

```json
{
  "metadata": {
    "name": "Basic Content Generator",
    "description": "Generate content using LLM",
    "category": "content",
    "difficulty": "beginner"
  },
  "nodes": [
    {
      "id": "input",
      "type": "input",
      "position": {"x": 100, "y": 100},
      "data": {
        "label": "Input",
        "type": "text"
      }
    },
    {
      "id": "generator",
      "type": "agent",
      "position": {"x": 300, "y": 100},
      "data": {
        "agentType": "llm_text_generator",
        "config": {
          "temperature": 0.7,
          "max_tokens": 1000
        },
        "label": "Content Generator"
      }
    },
    {
      "id": "output",
      "type": "output",
      "position": {"x": 500, "y": 100},
      "data": {
        "label": "Generated Content"
      }
    }
  ],
  "edges": [
    {
      "id": "input-to-generator",
      "source": "input",
      "target": "generator"
    },
    {
      "id": "generator-to-output",
      "source": "generator",
      "target": "output"
    }
  ]
}
```

### Data Processing Pipeline

```json
{
  "metadata": {
    "name": "Data Processing Pipeline",
    "description": "Process and clean data",
    "category": "data",
    "difficulty": "intermediate"
  },
  "nodes": [
    {
      "id": "data-input",
      "type": "input",
      "position": {"x": 100, "y": 100},
      "data": {
        "label": "Data Input",
        "type": "json"
      }
    },
    {
      "id": "validator",
      "type": "agent",
      "position": {"x": 300, "y": 100},
      "data": {
        "agentType": "data_validator",
        "config": {
          "schema": "user_schema.json"
        },
        "label": "Data Validator"
      }
    },
    {
      "id": "cleaner",
      "type": "agent",
      "position": {"x": 500, "y": 100},
      "data": {
        "agentType": "data_cleaner",
        "config": {
          "remove_duplicates": true,
          "normalize_case": true
        },
        "label": "Data Cleaner"
      }
    },
    {
      "id": "transformer",
      "type": "agent",
      "position": {"x": 700, "y": 100},
      "data": {
        "agentType": "data_transformer",
        "config": {
          "output_format": "csv"
        },
        "label": "Data Transformer"
      }
    },
    {
      "id": "output",
      "type": "output",
      "position": {"x": 900, "y": 100},
      "data": {
        "label": "Processed Data"
      }
    }
  ],
  "edges": [
    {
      "id": "input-to-validator",
      "source": "data-input",
      "target": "validator"
    },
    {
      "id": "validator-to-cleaner",
      "source": "validator",
      "target": "cleaner"
    },
    {
      "id": "cleaner-to-transformer",
      "source": "cleaner",
      "target": "transformer"
    },
    {
      "id": "transformer-to-output",
      "source": "transformer",
      "target": "output"
    }
  ]
}
```

## Template Testing

### Test Structure
```python
# tests/test_basic.py
import pytest
from agentflow.template import Template

def test_template_loads():
    """Test that template loads correctly"""
    template = Template.load("template-name")
    assert template is not None
    assert template.metadata["name"] == "Template Name"

def test_template_validation():
    """Test template validation"""
    template = Template.load("template-name")
    assert template.validate()

def test_template_execution():
    """Test template execution with example data"""
    template = Template.load("template-name")
    
    with open("input-example.json") as f:
        input_data = json.load(f)
    
    result = template.execute(input_data)
    assert result["status"] == "completed"
```

### Running Tests
```bash
# Run template tests
pytest tests/ -v

# Test specific template
pytest tests/test_template_name.py -v
```

## Template Distribution

### Publishing Templates
1. Create template directory
2. Add all required files
3. Run validation tests
4. Submit pull request
5. Template review process
6. Publish to registry

### Template Registry
Templates are stored in the database and accessible via API:

```python
# Get all templates
GET /api/templates

# Get template by ID
GET /api/templates/{template_id}

# Use template
POST /api/templates/{template_id}/use
```

## Best Practices

### Template Design
1. **Keep it Simple**: Start with basic functionality
2. **Make it Configurable**: Use configuration parameters
3. **Include Examples**: Provide clear examples
4. **Handle Errors**: Include error handling
5. **Document Everything**: Clear documentation

### Template Maintenance
1. **Version Control**: Use semantic versioning
2. **Update Regularly**: Keep templates current
3. **Test Changes**: Test all changes
4. **Monitor Usage**: Track template usage
5. **Gather Feedback**: Collect user feedback

### Template Performance
1. **Optimize Agents**: Use efficient agents
2. **Minimize Dependencies**: Reduce external dependencies
3. **Cache Results**: Cache expensive operations
4. **Monitor Performance**: Track execution times
5. **Scale Appropriately**: Design for scale

This template system provides a foundation for users to quickly get started with AgentFlow workflows while maintaining consistency and quality.
















