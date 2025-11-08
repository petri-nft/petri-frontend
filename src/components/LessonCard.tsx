import { Lesson } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle2, Award } from 'lucide-react';
import { useState } from 'react';

interface LessonCardProps {
  lesson: Lesson;
  onComplete?: (lessonId: string, correct: boolean) => void;
}

export const LessonCard = ({ lesson, onComplete }: LessonCardProps) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  
  const handleQuizSubmit = () => {
    if (selectedAnswer === null || !lesson.quiz) return;
    const correct = selectedAnswer === lesson.quiz.correctIndex;
    setCompleted(true);
    onComplete?.(lesson.id, correct);
  };
  
  return (
    <Card className="p-6 bg-gradient-to-br from-accent/20 to-secondary/20 border-2 border-accent/50">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg text-foreground">{lesson.title}</h3>
              {lesson.speciesTag && (
                <Badge variant="outline" className="text-xs">
                  {lesson.speciesTag}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{lesson.summary}</p>
          </div>
          
          {!showQuiz && (
            <>
              <div className="space-y-2">
                {lesson.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/90">{step}</span>
                  </div>
                ))}
              </div>
              
              {lesson.quiz && (
                <Button
                  onClick={() => setShowQuiz(true)}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Take Quiz & Earn Points
                </Button>
              )}
            </>
          )}
          
          {showQuiz && lesson.quiz && !completed && (
            <div className="space-y-4">
              <div className="p-4 bg-card rounded-xl border-2 border-muted">
                <p className="font-medium mb-3 text-foreground">{lesson.quiz.question}</p>
                <div className="space-y-2">
                  {lesson.quiz.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedAnswer === index
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="quiz-answer"
                        value={index}
                        checked={selectedAnswer === index}
                        onChange={() => setSelectedAnswer(index)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm text-foreground">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={handleQuizSubmit}
                disabled={selectedAnswer === null}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Submit Answer
              </Button>
            </div>
          )}
          
          {completed && (
            <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-xl border-2 border-primary/30">
              <Award className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Lesson Complete!</p>
                <p className="text-sm text-muted-foreground">
                  {selectedAnswer === lesson.quiz?.correctIndex
                    ? '+5 Stewardship Score'
                    : 'Keep learning!'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
