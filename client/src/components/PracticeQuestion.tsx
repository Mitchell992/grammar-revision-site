import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Question, parseExplanation } from "@/lib/grammarData";
import { CheckCircle2, XCircle } from "lucide-react";

interface PracticeQuestionProps {
  question: Question;
  onAnswer?: (isCorrect: boolean) => void;
}

export default function PracticeQuestion({
  question,
  onAnswer,
}: PracticeQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer("");
    setSubmitted(false);
    setIsCorrect(false);
  }, [question.id]);

  const handleSubmit = () => {
    const correct = selectedAnswer === question.answer;
    setIsCorrect(correct);
    setSubmitted(true);
    onAnswer?.(correct);
  };

  const handleReset = () => {
    setSelectedAnswer("");
    setSubmitted(false);
    setIsCorrect(false);
  };

  const renderExplanation = () => {
    const parts = parseExplanation(question.explanation);

    return (
      <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900">解析</h4>
        <p className="text-sm text-blue-900 leading-relaxed">
          {parts.map((part, idx) => {
            if (typeof part === "string") {
              return <span key={idx}>{part}</span>;
            }
            if (part.type === "signal") {
              return (
                <mark
                  key={idx}
                  className="bg-yellow-200 font-semibold px-1 rounded"
                >
                  {part.content}
                </mark>
              );
            }
            return <strong key={idx}>{part.content}</strong>;
          })}
        </p>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">选择题</CardTitle>
        <CardDescription>
          词汇: {question.vocabulary.join(", ")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question */}
        <div className="space-y-4">
          <p className="text-base leading-relaxed font-medium">
            {question.question}
          </p>

          {/* Multiple Choice Options */}
          <div className="space-y-3">
            <RadioGroup
              value={selectedAnswer}
              onValueChange={setSelectedAnswer}
              disabled={submitted}
            >
              {question.options?.map((option, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer"
                >
                  <RadioGroupItem value={option} id={`option-${idx}`} />
                  <Label
                    htmlFor={`option-${idx}`}
                    className="cursor-pointer flex-1 font-medium"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          {!submitted ? (
            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="w-full"
            >
              提交答案
            </Button>
          ) : (
            <>
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full"
              >
                重新做题
              </Button>
              <Button variant="ghost" className="w-full">
                下一题
              </Button>
            </>
          )}
        </div>

        {/* Result */}
        {submitted && (
          <div
            className={`p-4 rounded-lg border-2 ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
          >
            <div className="flex items-center gap-2 mb-3">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900">正确!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-900">错误</span>
                </>
              )}
            </div>
            {!isCorrect && (
              <p className="text-sm mb-3">
                <span className="font-semibold">正确答案: </span>
                <span className="text-red-900">{question.answer}</span>
              </p>
            )}
            {renderExplanation()}
            <div className="mt-3 p-3 bg-blue-100 rounded border border-blue-300">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                中文翻译
              </p>
              <p className="text-sm text-blue-900">
                {question.chineseTranslation}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
