import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GrammarPoint, Question } from '@/lib/grammarData';
import {
  createMixedPracticeSession,
  getCurrentQuestion,
  recordAnswer,
  moveToNextQuestion,
  moveToPreviousQuestion,
  getSessionStats,
  isSessionComplete,
  MixedPracticeSession,
} from '@/lib/mixedPractice';
import PracticeQuestion from './PracticeQuestion';
import { Clock, CheckCircle2, RotateCcw } from 'lucide-react';

interface MixedPracticeProps {
  grammarPoints: GrammarPoint[];
  questionCount?: number;
}

export default function MixedPractice({ grammarPoints, questionCount = 20 }: MixedPracticeProps) {
  const [session, setSession] = useState<MixedPracticeSession | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const startSession = () => {
    const newSession = createMixedPracticeSession(grammarPoints, questionCount);
    setSession(newSession);
    setIsStarted(true);
    setIsCompleted(false);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (session) {
      setSession(recordAnswer(session, isCorrect));
    }
  };

  const handleNextQuestion = () => {
    if (session) {
      const newSession = moveToNextQuestion(session);
      setSession(newSession);
      
      // Check if session is complete
      if (newSession.currentIndex >= newSession.questions.length - 1 && newSession.totalAttempted > 0) {
        setIsCompleted(true);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (session) {
      setSession(moveToPreviousQuestion(session));
    }
  };

  const handleReset = () => {
    setSession(null);
    setIsStarted(false);
    setIsCompleted(false);
  };

  // Not started
  if (!isStarted || !session) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">混合练习</CardTitle>
          <CardDescription>
            从所有12个语法点中随机抽取题目，进行综合练习
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-muted-foreground mb-1">总语法点数</p>
              <p className="text-3xl font-bold text-primary">{grammarPoints.length}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-muted-foreground mb-1">总题数</p>
              <p className="text-3xl font-bold text-green-600">
                {grammarPoints.reduce((sum, gp) => sum + gp.questions.length, 0)}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-muted-foreground mb-1">本次练习</p>
              <p className="text-3xl font-bold text-purple-600">{questionCount}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">练习说明</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>系统将从所有12个语法点中随机选择{questionCount}道题目</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>每道题都包含明确的标志词，帮助你快速判断语法点</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>完成后会显示你的正确率和学习统计</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>可以随时返回上一题或跳过当前题</span>
              </li>
            </ul>
          </div>

          <Button onClick={startSession} size="lg" className="w-full">
            开始混合练习
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Completed
  if (isCompleted && session) {
    const stats = getSessionStats(session);
    const accuracy = stats.accuracy;
    let feedbackColor = 'text-red-600';
    let feedbackBg = 'bg-red-50';
    let feedbackBorder = 'border-red-200';
    let feedbackMessage = '继续加油！';

    if (accuracy >= 90) {
      feedbackColor = 'text-green-600';
      feedbackBg = 'bg-green-50';
      feedbackBorder = 'border-green-200';
      feedbackMessage = '太棒了！';
    } else if (accuracy >= 80) {
      feedbackColor = 'text-blue-600';
      feedbackBg = 'bg-blue-50';
      feedbackBorder = 'border-blue-200';
      feedbackMessage = '很不错！';
    } else if (accuracy >= 70) {
      feedbackColor = 'text-yellow-600';
      feedbackBg = 'bg-yellow-50';
      feedbackBorder = 'border-yellow-200';
      feedbackMessage = '不错！';
    }

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">练习完成</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`p-6 rounded-lg border-2 ${feedbackBg} ${feedbackBorder}`}>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className={`w-8 h-8 ${feedbackColor}`} />
              <h3 className={`text-2xl font-bold ${feedbackColor}`}>{feedbackMessage}</h3>
            </div>
            <p className={`text-lg ${feedbackColor}`}>
              你的正确率是 <span className="font-bold text-2xl">{accuracy}%</span>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">总题数</p>
              <p className="text-2xl font-bold">{stats.totalQuestions}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-muted-foreground mb-1">正确数</p>
              <p className="text-2xl font-bold text-green-600">{stats.correct}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs text-muted-foreground mb-1">错误数</p>
              <p className="text-2xl font-bold text-red-600">{stats.attempted - stats.correct}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-muted-foreground mb-1">用时</p>
              <p className="text-2xl font-bold text-blue-600">{Math.floor(stats.elapsedTime / 60)}分</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">建议</h3>
            {accuracy >= 90 && (
              <p className="text-sm text-muted-foreground">
                🎉 你已经掌握了这些语法点！可以尝试更难的题目或复习其他语法点。
              </p>
            )}
            {accuracy >= 70 && accuracy < 90 && (
              <p className="text-sm text-muted-foreground">
                👍 不错的成绩！建议复习做错的题目，特别是关于标志词的理解。
              </p>
            )}
            {accuracy < 70 && (
              <p className="text-sm text-muted-foreground">
                💪 加油！建议返回学习模块复习相关语法点，然后再进行练习。
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              返回首页
            </Button>
            <Button onClick={startSession} className="flex-1">
              再来一次
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // In progress
  if (session) {
    const currentQuestion = getCurrentQuestion(session);
    const stats = getSessionStats(session);
    const progressPercent = (stats.attempted / stats.totalQuestions) * 100;

    if (!currentQuestion) {
      return (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">没有可用的题目</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">第 {session.currentIndex + 1} / {stats.totalQuestions} 题</p>
                <p className="text-xs text-muted-foreground mt-1">
                  已完成: {stats.attempted} | 正确: {stats.correct} | 正确率: {stats.accuracy}%
                </p>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {Math.floor(stats.elapsedTime / 60)}:{String(stats.elapsedTime % 60).padStart(2, '0')}
              </Badge>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </CardContent>
        </Card>

        {/* Question */}
        <PracticeQuestion 
          question={currentQuestion}
          onAnswer={handleAnswer}
        />

        {/* Navigation */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={session.currentIndex === 0}
            className="flex-1"
          >
            上一题
          </Button>
          <Button
            onClick={handleNextQuestion}
            disabled={session.currentIndex === stats.totalQuestions - 1}
            className="flex-1"
          >
            下一题
          </Button>
          <Button
            variant="ghost"
            onClick={handleReset}
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            重新开始
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
