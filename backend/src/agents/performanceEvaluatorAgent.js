class PerformanceEvaluatorAgent {
  constructor() {
    this.scoringWeights = {
      'multiple-choice': 1.0,
      text: 1.5,
      code: 2.0,
    };

    this.difficultyMultipliers = {
      beginner: 1.0,
      intermediate: 1.5,
      expert: 2.0,
    };
  }

  async evaluateTest(testResponses, questions) {
    const results = [];
    let totalScore = 0;
    let maxScore = 0;

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const response = testResponses[i];
      
      const evaluation = await this._evaluateResponse(question, response);
      results.push(evaluation);
      
      totalScore += evaluation.score;
      maxScore += evaluation.maxScore;
    }

    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const analysis = this._analyzePerformance(results);

    return {
      totalScore,
      maxScore,
      percentage: Math.round(percentage * 100) / 100,
      results,
      analysis,
      grade: this._calculateGrade(percentage),
      evaluatedAt: new Date(),
    };
  }

  async identifyStrengthsWeaknesses(evaluationResults) {
    const skillPerformance = {};

    evaluationResults.forEach((result) => {
      const skill = result.skill;
      if (!skillPerformance[skill]) {
        skillPerformance[skill] = { correct: 0, total: 0, scores: [] };
      }
      
      skillPerformance[skill].total++;
      skillPerformance[skill].scores.push(result.score / result.maxScore);
      if (result.correct) skillPerformance[skill].correct++;
    });

    const strengths = [];
    const weaknesses = [];

    Object.entries(skillPerformance).forEach(([skill, perf]) => {
      const avgScore = perf.scores.reduce((a, b) => a + b, 0) / perf.scores.length;
      const accuracy = (perf.correct / perf.total) * 100;

      const analysis = {
        skill,
        accuracy: Math.round(accuracy),
        averageScore: Math.round(avgScore * 100),
        questionsAttempted: perf.total,
      };

      if (avgScore >= 0.7) strengths.push(analysis);
      else if (avgScore < 0.5) weaknesses.push(analysis);
    });

    return {
      strengths: strengths.sort((a, b) => b.averageScore - a.averageScore),
      weaknesses: weaknesses.sort((a, b) => a.averageScore - b.averageScore),
      overallAccuracy: this._calculateOverallAccuracy(skillPerformance),
    };
  }

  async _evaluateResponse(question, response) {
    const baseScore = this.scoringWeights[question.type] * this.difficultyMultipliers[question.difficulty];
    let score = 0;
    let correct = false;
    let feedback = '';

    switch (question.type) {
      case 'multiple-choice':
        correct = response.answer === question.answer;
        score = correct ? baseScore : 0;
        feedback = correct ? 'Correct answer!' : `Incorrect. The correct answer is option ${question.answer + 1}`;
        break;

      case 'text':
        const evaluation = this._evaluateTextResponse(response.answer, question.keywords);
        correct = evaluation.score >= 0.6;
        score = evaluation.score * baseScore;
        feedback = evaluation.feedback;
        break;

      case 'code':
        const codeEval = this._evaluateCodeResponse(response.answer, question.testCases);
        correct = codeEval.passed;
        score = codeEval.score * baseScore;
        feedback = codeEval.feedback;
        break;
    }

    return {
      questionId: question.id,
      skill: question.skill,
      difficulty: question.difficulty,
      type: question.type,
      correct,
      score,
      maxScore: baseScore,
      feedback,
    };
  }

  _evaluateTextResponse(answer, keywords) {
    if (!answer) return { score: 0, feedback: 'No answer provided' };

    const normalizedAnswer = answer.toLowerCase();
    const matchedKeywords = keywords.filter(kw => normalizedAnswer.includes(kw.toLowerCase()));
    const score = matchedKeywords.length / keywords.length;

    return {
      score,
      feedback: score >= 0.6 
        ? `Good answer! Covered ${matchedKeywords.length}/${keywords.length} key concepts.`
        : `Needs improvement. Missing key concepts: ${keywords.filter(kw => !matchedKeywords.includes(kw)).join(', ')}`,
    };
  }

  _evaluateCodeResponse(code, testCases) {
    if (!code) return { passed: false, score: 0, feedback: 'No code provided' };

    // Placeholder for actual code execution
    // In production, use sandboxed execution environment
    const passed = testCases.length === 0; // Simplified
    const score = passed ? 1 : 0.5;

    return {
      passed,
      score,
      feedback: passed ? 'Code executed successfully!' : 'Code has issues. Review the logic.',
    };
  }

  _analyzePerformance(results) {
    const byDifficulty = { beginner: [], intermediate: [], expert: [] };
    
    results.forEach(r => {
      byDifficulty[r.difficulty].push(r.correct);
    });

    return {
      beginnerAccuracy: this._calculateAccuracy(byDifficulty.beginner),
      intermediateAccuracy: this._calculateAccuracy(byDifficulty.intermediate),
      expertAccuracy: this._calculateAccuracy(byDifficulty.expert),
      totalQuestions: results.length,
      correctAnswers: results.filter(r => r.correct).length,
    };
  }

  _calculateAccuracy(results) {
    if (results.length === 0) return 0;
    const correct = results.filter(r => r).length;
    return Math.round((correct / results.length) * 100);
  }

  _calculateOverallAccuracy(skillPerformance) {
    const allScores = Object.values(skillPerformance).flatMap(p => p.scores);
    if (allScores.length === 0) return 0;
    return Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 100);
  }

  _calculateGrade(percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }
}

module.exports = new PerformanceEvaluatorAgent();
