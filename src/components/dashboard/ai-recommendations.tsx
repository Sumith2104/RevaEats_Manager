'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { recommendMenuItems, RecommendMenuItemsOutput } from '@/ai/flows/recommend-menu-items';
import { Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export function AiRecommendations() {
  const [recommendations, setRecommendations] = useState<RecommendMenuItemsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFetchRecommendations = async () => {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const result = await recommendMenuItems({});
      setRecommendations(result);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not get AI recommendations.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>AI-Powered Suggestions</span>
        </CardTitle>
        <CardDescription>Get AI-driven suggestions for featured menu items.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : recommendations ? (
          <ul className="space-y-4">
            {recommendations.recommendations.map((rec, index) => (
              <li key={index} className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                    <Lightbulb className="h-4 w-4 text-accent" />
                </div>
                <div>
                    <p className="font-semibold">{rec.item}</p>
                    <p className="text-sm text-muted-foreground">{rec.reason}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-sm text-muted-foreground p-4 border border-dashed rounded-lg">
            Click the button to generate recommendations.
          </div>
        )}
        <Button onClick={handleFetchRecommendations} disabled={isLoading} className="w-full mt-4">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Generating...' : 'Generate Recommendations'}
        </Button>
      </CardContent>
    </Card>
  );
}
