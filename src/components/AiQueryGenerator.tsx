'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowRight } from "lucide-react";

interface AiQueryGeneratorProps {
  onQueryGenerated: (query: string) => void;
}

const AiQueryGenerator: React.FC<AiQueryGeneratorProps> = ({ onQueryGenerated }) => {
  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuery = async () => {
    if (!naturalLanguage.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          naturalLanguage: naturalLanguage.trim(),
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate SQL query');
      }
      
      if (data.sqlQuery) {
        onQueryGenerated(data.sqlQuery);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the query');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="naturalLanguage" className="text-sm font-medium">
        Describe your query so that AI can generate the SQL query for you.
      </label>
      
      <div className="flex gap-4 items-stretch">
        <Textarea
          id="naturalLanguage"
          value={naturalLanguage}
          onChange={(e) => setNaturalLanguage(e.target.value)}
          placeholder="e.g., Show me all users who registered in the last month"
          rows={3}
          className="resize-none flex-1"
        />
        
        <Button
          onClick={generateQuery}
          disabled={isGenerating || !naturalLanguage.trim()}
          className="px-6 text-lg flex-shrink-0 h-auto"
          variant={isGenerating ? "outline" : "default"}
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Go
              <ArrowRight className="h-6 w-6" />
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <div className="text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
};

export default AiQueryGenerator;