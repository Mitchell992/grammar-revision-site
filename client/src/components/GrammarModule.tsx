import { GrammarPoint } from "@/lib/grammarData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GrammarModuleProps {
  grammarPoint: GrammarPoint;
}

export default function GrammarModule({ grammarPoint }: GrammarModuleProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{grammarPoint.name}</CardTitle>
            <CardDescription className="text-base mt-1">
              {grammarPoint.englishName}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm">
            {grammarPoint.questions.length} 题
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Description */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">学习要点</h3>
          <p className="text-sm text-blue-900 leading-relaxed">
            {grammarPoint.description}
          </p>
        </div>

        {/* Key Points */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">标志词识别</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            每道题目都包含明确的标志词，帮助你快速判断语法点。在做题时，请注意题目中的时间状语、连接词等关键词。
          </p>
        </div>

        {/* Question Types */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">题型</h3>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <p className="text-sm font-medium text-blue-900">选择题</p>
            <p className="text-2xl font-bold text-primary">
              {grammarPoint.questions.length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
