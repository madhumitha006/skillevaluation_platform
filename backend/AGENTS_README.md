# Multi-Agent AI System Architecture

## Overview
The AI Skill Evaluation Platform uses a modular multi-agent architecture where each agent has a specific responsibility.

## Agent Modules

### 1. SkillAnalyzerAgent (`/agents/skillAnalyzerAgent.js`)
**Purpose**: Parses resumes and extracts skills

**Methods**:
- `analyzeResume(resumeText)` - Analyzes resume and extracts skills
- `parseSkillsFromText(text)` - Extracts skills from any text

**Returns**:
```javascript
{
  extractedSkills: ['JavaScript', 'React', ...],
  categorizedSkills: {
    technical: { programming: [...], frameworks: [...] },
    soft: [...]
  },
  proficiencyEstimate: { 'JavaScript': { level: 'expert', confidence: 0.9 } }
}
```

### 2. AdaptiveTestAgent (`/agents/adaptiveTestAgent.js`)
**Purpose**: Generates dynamic tests with adaptive difficulty

**Methods**:
- `generateTest(skills, userPerformance)` - Creates personalized test
- `adjustDifficulty(currentScore, currentLevel)` - Adjusts difficulty based on performance

**Returns**:
```javascript
{
  testId: 'test_123',
  questions: [...],
  totalQuestions: 10,
  estimatedDuration: 50,
  adaptiveLevel: 'intermediate'
}
```

### 3. PerformanceEvaluatorAgent (`/agents/performanceEvaluatorAgent.js`)
**Purpose**: Evaluates test responses and identifies strengths/weaknesses

**Methods**:
- `evaluateTest(testResponses, questions)` - Scores test performance
- `identifyStrengthsWeaknesses(evaluationResults)` - Analyzes performance patterns

**Returns**:
```javascript
{
  totalScore: 85,
  maxScore: 100,
  percentage: 85,
  grade: 'B',
  strengths: [{ skill: 'JavaScript', accuracy: 95 }],
  weaknesses: [{ skill: 'Python', accuracy: 45 }]
}
```

### 4. CareerAdvisorAgent (`/agents/careerAdvisorAgent.js`)
**Purpose**: Provides career guidance and learning roadmaps

**Methods**:
- `generateLearningRoadmap(userSkills, targetRole)` - Creates personalized learning path
- `recommendCareerPaths(userSkills, strengths)` - Suggests suitable career roles
- `suggestCertifications(userSkills, targetRole)` - Recommends relevant certifications

**Returns**:
```javascript
{
  targetRole: 'Full Stack Developer',
  skillGaps: { critical: [...], recommended: [...] },
  roadmap: [{ phase: 1, skills: [...], duration: '4-6 weeks' }],
  timeline: { totalWeeks: 12 }
}
```

## Service Layer (`/services/aiService.js`)

The service layer orchestrates agent interactions and handles database operations:

- `analyzeResume(userId, resumeText)` - Analyzes resume and saves to SkillProfile
- `generateAdaptiveTest(userId, skills)` - Creates test and saves to Assessment
- `submitTestResponses(assessmentId, responses)` - Evaluates and saves results
- `generateCareerRecommendations(userId)` - Gets career suggestions
- `generateLearningRoadmap(userId, targetRole)` - Creates learning path
- `getCertificationRecommendations(userId, targetRole)` - Gets cert suggestions

## API Endpoints (`/routes/aiRoutes.js`)

All endpoints require authentication (`protect` middleware).

### POST `/api/ai/analyze-resume`
Analyzes resume text and extracts skills.

**Request**:
```json
{
  "resumeText": "Experienced JavaScript developer with React..."
}
```

### POST `/api/ai/generate-test`
Generates adaptive test based on skills.

**Request**:
```json
{
  "skills": ["JavaScript", "React", "Node.js"]
}
```

### POST `/api/ai/submit-test/:assessmentId`
Submits test responses for evaluation.

**Request**:
```json
{
  "responses": [
    { "questionId": "q1", "answer": 0 },
    { "questionId": "q2", "answer": "Closures are..." }
  ]
}
```

### GET `/api/ai/career-recommendations`
Gets personalized career path recommendations.

### POST `/api/ai/learning-roadmap`
Generates learning roadmap for target role.

**Request**:
```json
{
  "targetRole": "Full Stack Developer"
}
```

### GET `/api/ai/certifications?targetRole=DevOps Engineer`
Gets certification recommendations.

### GET `/api/ai/skill-profile`
Retrieves user's complete skill profile.

## Database Models

### SkillProfile (`/models/SkillProfile.js`)
Stores user skill analysis and career recommendations.

### Assessment (`/models/Assessment.js`)
Stores test questions, responses, and evaluation results.

## Architecture Principles

1. **Separation of Concerns**: Each agent handles one specific task
2. **Modularity**: Agents can be updated independently
3. **Service Layer Abstraction**: Controllers never call agents directly
4. **Async/Await Pattern**: All operations are asynchronous
5. **Clean Architecture**: Routes → Controllers → Services → Agents → Models

## Usage Example

```javascript
// In controller
const aiService = require('../services/aiService');

async analyzeResume(req, res, next) {
  const result = await aiService.analyzeResume(req.user._id, req.body.resumeText);
  return ApiResponse.success(res, result);
}
```

## Future Enhancements

- Integrate with OpenAI/AWS Bedrock for advanced NLP
- Add real-time code execution sandbox
- Implement collaborative filtering for recommendations
- Add skill trend analysis
- Support multiple languages
