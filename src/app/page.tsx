'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Database, Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AiQueryGenerator from '@/components/AiQueryGenerator';

const Page = () => {
  const { theme, setTheme } = useTheme();
  const [connectionString, setConnectionString] = useState('');
  const [query, setQuery] = useState('SELECT NOW();');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('table');

  const executeQuery = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Create a dynamic client with the provided connection string
      const response = await fetch('/api/execute-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          connectionString,
          query,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute query');
      }
      
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'An error occurred while executing the query');
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleQueryGenerated = (generatedQuery: string) => {
    setQuery(generatedQuery);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <Database className="h-6 w-6 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">AI PostgreSQL Query Tester</h1>
          </motion.div>
          
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </header>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Test SQL with AI</CardTitle>
                <CardDescription>Enter your PostgreSQL connection details and Test SQL query with AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
              <AiQueryGenerator onQueryGenerated={handleQueryGenerated} />
                
                <div className="space-y-2">
                  <label htmlFor="connectionString" className="text-sm font-medium">
                    PostgreSQL Connection URL
                  </label>
                  <Input
                    id="connectionString"
                    value={connectionString}
                    onChange={(e) => setConnectionString(e.target.value)}
                    placeholder="postgres://username:password@hostname:port/database"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Connection details are processed securely on the server.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="query" className="text-sm font-medium">
                    SQL Query
                  </label>
                  <Textarea
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your SQL query here..."
                    rows={6}
                    className="font-mono text-sm resize-y min-h-[150px]"
                  />
                </div>

               

              </CardContent>
              <CardFooter>
                <Button
                  onClick={executeQuery}
                  disabled={loading || !connectionString || !query}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Execute Query
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Query Results</CardTitle>
                {result && !loading && (
                  <Badge variant="outline" className="ml-2">
                    {result.executionTime ? `${result.executionTime}ms` : 'Completed'}
                  </Badge>
                )}
              </CardHeader>
              
              <CardContent className="min-h-[400px]">
                <AnimatePresence mode="wait">
                  {loading && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-64"
                    >
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <p className="mt-4 text-muted-foreground">Executing your query...</p>
                    </motion.div>
                  )}
                  
                  {error && !loading && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-destructive/10 p-4 rounded-lg border border-destructive/20"
                    >
                      <h3 className="text-lg font-medium text-destructive mb-2">Error</h3>
                      <p className="text-destructive/90">{error}</p>
                    </motion.div>
                  )}
                  
                  {result && !loading && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="bg-primary/10 p-3 rounded-lg text-primary text-sm">
                        Query executed successfully!
                        {result.rowCount !== undefined && (
                          <span className="ml-2">Rows affected: {result.rowCount}</span>
                        )}
                      </div>
                      
                      {result.rows && result.rows.length > 0 && (
                        <Tabs defaultValue="table" value={activeTab} onValueChange={setActiveTab} className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="table">Table View</TabsTrigger>
                            <TabsTrigger value="json">JSON View</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="table" className="mt-2">
                            <div className="rounded-md border overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    {Object.keys(result.rows[0]).map((column) => (
                                      <TableHead key={column} className="whitespace-nowrap">
                                        {column}
                                      </TableHead>
                                    ))}
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {result.rows.map((row: any, rowIndex: number) => (
                                    <TableRow key={rowIndex}>
                                      {Object.values(row).map((value: any, valueIndex: number) => (
                                        <TableCell key={valueIndex} className="font-mono text-xs">
                                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="json" className="mt-2">
                            <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs font-mono">
                              {JSON.stringify(result, null, 2)}
                            </pre>
                          </TabsContent>
                        </Tabs>
                      )}
                      
                      {(!result.rows || result.rows.length === 0) && (
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="text-muted-foreground">Command completed successfully.</p>
                          {result.rowCount !== undefined && (
                            <p className="text-muted-foreground">Rows affected: {result.rowCount}</p>
                          )}
                          
                          <Separator className="my-4" />
                          
                          <h3 className="text-sm font-medium mb-2">Raw Response</h3>
                          <pre className="bg-muted/50 p-3 rounded overflow-auto text-xs font-mono">
                            {JSON.stringify(result, null, 2)}
                          </pre>
                        </div>
                      )}
                    </motion.div>
                  )}
                  
                  {!result && !error && !loading && (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-64 text-muted-foreground"
                    >
                      <Database className="h-16 w-16 text-muted-foreground/40 mb-4" />
                      <p className="text-center">
                        Enter your connection details and SQL query, then click "Execute Query"
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Page;