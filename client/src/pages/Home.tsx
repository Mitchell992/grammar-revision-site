import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { getGrammarPoints, GrammarPoint, Question, getAllQuestions } from '@/lib/grammarData';
import PracticeQuestion from '@/components/PracticeQuestion';
import GrammarModule from '@/components/GrammarModule';
import { BookOpen, Zap, BarChart3 } from 'lucide-react';

type ViewMode = 'learn' | 'practice' | 'mixed' | 'stats';

export default function Home() {
  const [grammarPoints, setGrammarPoints] = useState<GrammarPoint[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('learn');
  const [selectedGrammarId, setSelectedGrammarId] = useState<number>(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const points = await getGrammarPoints();
        setGrammarPoints(points);
        setSelectedGrammarId(points[0]?.id || 1);
        
        const questions = await getAllQuestions();
        setAllQuestions(questions);
      } catch (error) {
        console.error('Failed to load grammar data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <Spinner className="w-12 h-12 mx-auto" />
          <p className="text-lg font-medium text-foreground">加载语法数据中...</p>
        </div>
      </div>
    );
  }

  const selectedGrammar = grammarPoints.find(gp => gp.id === selectedGrammarId);
  const questionsForSelected = selectedGrammar?.questions || [];
  const currentQuestion = questionsForSelected[currentQuestionIndex];

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
    setTotalAttempted(prev => prev + 1);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionsForSelected.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleResetPractice = () => {
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setTotalAttempted(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">中考英语语法复习</h1>
                <p className="text-sm text-muted-foreground">115道精选题 | 12个语法点</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 text-sm">v2.0</Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="learn" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              学习
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              练习
            </TabsTrigger>
            <TabsTrigger value="mixed" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              混合
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              统计
            </TabsTrigger>
          </TabsList>

          {/* Learn Tab */}
          <TabsContent value="learn" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Grammar Points Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">语法点</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {grammarPoints.map(gp => (
                      <Button
                        key={gp.id}
                        variant={selectedGrammarId === gp.id ? 'default' : 'outline'}
                        className="w-full justify-start text-left h-auto py-2 px-3"
                        onClick={() => setSelectedGrammarId(gp.id)}
                      >
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-sm">{gp.name}</span>
                          <span className="text-xs opacity-75">{gp.questions.length} 题</span>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Grammar Module Content */}
              <div className="lg:col-span-3">
                {selectedGrammar && <GrammarModule grammarPoint={selectedGrammar} />}
              </div>
            </div>
          </TabsContent>

          {/* Practice Tab */}
          <TabsContent value="practice" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Grammar Points Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">语法点</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {grammarPoints.map(gp => (
                      <Button
                        key={gp.id}
                        variant={selectedGrammarId === gp.id ? 'default' : 'outline'}
                        className="w-full justify-start text-left h-auto py-2 px-3"
                        onClick={() => {
                          setSelectedGrammarId(gp.id);
                          setCurrentQuestionIndex(0);
                          handleResetPractice();
                        }}
                      >
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-sm">{gp.name}</span>
                          <span className="text-xs opacity-75">{gp.questions.length} 题</span>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* Progress Card */}
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-sm">进度</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">完成度</p>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${questionsForSelected.length > 0 ? ((currentQuestionIndex + 1) / questionsForSelected.length) * 100 : 0}%`
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {currentQuestionIndex + 1} / {questionsForSelected.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">正确率</p>
                      <p className="text-lg font-bold text-primary">
                        {totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Question Content */}
              <div className="lg:col-span-3">
                {currentQuestion ? (
                  <div className="space-y-4">
                    <PracticeQuestion 
                      question={currentQuestion}
                      onAnswer={handleAnswer}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="flex-1"
                      >
                        上一题
                      </Button>
                      <Button
                        onClick={handleNextQuestion}
                        disabled={currentQuestionIndex === questionsForSelected.length - 1}
                        className="flex-1"
                      >
                        下一题
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">没有可用的题目</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Mixed Tab */}
          <TabsContent value="mixed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>混合练习</CardTitle>
                <CardDescription>随机从所有语法点中选择题目进行练习</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">此功能即将推出...</p>
                <Button disabled>开始混合练习</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>学习统计</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-muted-foreground mb-1">总题数</p>
                    <p className="text-3xl font-bold text-primary">{allQuestions.length}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-muted-foreground mb-1">已完成</p>
                    <p className="text-3xl font-bold text-green-600">{totalAttempted}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-muted-foreground mb-1">正确数</p>
                    <p className="text-3xl font-bold text-purple-600">{correctCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 mt-12">
        <div className="container max-w-7xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>中考英语语法复习网站 v2.0 | 115道精选题 | 12个语法点 | 标志词强制化</p>
        </div>
      </footer>
    </div>
  );
}
