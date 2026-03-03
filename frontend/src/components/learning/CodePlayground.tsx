import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { 
  PlayIcon,
  StopIcon,
  ArrowPathIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

interface CodePlaygroundProps {
  initialCode?: string;
  language?: 'javascript' | 'python' | 'html' | 'css';
  title?: string;
  description?: string;
  expectedOutput?: string;
  hints?: string[];
  tests?: string[];
  onComplete?: () => void;
  readOnly?: boolean;
}

export const CodePlayground = ({
  initialCode = '',
  language = 'javascript',
  title = 'Code Playground',
  description,
  expectedOutput,
  hints = [],
  tests = [],
  onComplete,
  readOnly = false
}: CodePlaygroundProps) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [testResults, setTestResults] = useState<{passed: boolean, message: string}[]>([]);
  const [executionTime, setExecutionTime] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      adjustTextareaHeight();
    }
  }, [code]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(200, textarea.scrollHeight) + 'px';
    }
  };

  const executeCode = async () => {
    setIsRunning(true);
    setOutput('');
    const startTime = Date.now();

    try {
      if (language === 'javascript') {
        await executeJavaScript();
      } else if (language === 'python') {
        await executePython();
      } else if (language === 'html') {
        executeHTML();
      }
      
      setExecutionTime(Date.now() - startTime);
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const executeJavaScript = async () => {
    const logs: string[] = [];
    const errors: string[] = [];
    
    // Capture console output
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      logs.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
    };
    
    console.error = (...args) => {
      errors.push(args.map(arg => String(arg)).join(' '));
    };

    try {
      // Create a safe execution environment
      const safeCode = `
        (function() {
          ${code}
        })();
      `;
      
      eval(safeCode);
      
      if (logs.length > 0) {
        setOutput(logs.join('\n'));
      } else {
        setOutput('Code executed successfully (no output)');
      }
      
      if (errors.length > 0) {
        setOutput(prev => prev + '\n\nErrors:\n' + errors.join('\n'));
      }
      
    } catch (error) {
      setOutput(`Runtime Error: ${error}`);
    } finally {
      console.log = originalLog;
      console.error = originalError;
    }

    // Run tests if provided
    if (tests.length > 0) {
      runTests();
    }
  };

  const executePython = async () => {
    // Mock Python execution (in real app, would use Pyodide or server-side execution)
    setOutput('Python execution not implemented in this demo.\nWould use Pyodide or server-side execution.');
  };

  const executeHTML = () => {
    // For HTML, we can render it in an iframe
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '200px';
    iframe.style.border = '1px solid #ccc';
    iframe.srcdoc = code;
    
    setOutput('HTML rendered below (iframe would be shown here)');
  };

  const runTests = () => {
    const results = tests.map(test => {
      try {
        const passed = eval(test);
        return {
          passed,
          message: passed ? `✓ ${test}` : `✗ ${test}`
        };
      } catch (error) {
        return {
          passed: false,
          message: `✗ ${test} - Error: ${error}`
        };
      }
    });
    
    setTestResults(results);
    
    if (results.every(r => r.passed) && onComplete) {
      setTimeout(onComplete, 1000);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput('');
    setTestResults([]);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const formatCode = () => {
    if (language === 'javascript') {
      // Basic JavaScript formatting
      const formatted = code
        .replace(/;/g, ';\n')
        .replace(/{/g, '{\n  ')
        .replace(/}/g, '\n}')
        .replace(/\n\s*\n/g, '\n');
      setCode(formatted);
    }
  };

  const getLanguageColor = () => {
    switch (language) {
      case 'javascript': return 'text-yellow-600';
      case 'python': return 'text-blue-600';
      case 'html': return 'text-orange-600';
      case 'css': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            {description && (
              <p className="text-gray-600 dark:text-gray-400">{description}</p>
            )}
          </div>
          <Badge variant="electric" className={getLanguageColor()}>
            {language.toUpperCase()}
          </Badge>
        </div>

        {expectedOutput && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">
              Expected Output:
            </div>
            <code className="text-sm text-blue-700 dark:text-blue-300">
              {expectedOutput}
            </code>
          </div>
        )}
      </Card>

      {/* Code Editor */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold">Code Editor</h4>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowHints(!showHints)}
              disabled={hints.length === 0}
            >
              <LightBulbIcon className="w-4 h-4 mr-1" />
              Hints ({hints.length})
            </Button>
            <Button size="sm" variant="secondary" onClick={copyCode}>
              <ClipboardDocumentIcon className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button size="sm" variant="secondary" onClick={formatCode}>
              Format
            </Button>
            <Button size="sm" variant="secondary" onClick={resetCode}>
              <ArrowPathIcon className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        <div className="relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            readOnly={readOnly}
            className="w-full p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-lg border border-gray-600 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Write your ${language} code here...`}
            style={{ minHeight: '200px' }}
          />
          
          {/* Line numbers (simplified) */}
          <div className="absolute left-2 top-4 text-gray-500 text-sm font-mono pointer-events-none">
            {code.split('\n').map((_, index) => (
              <div key={index} className="leading-5">
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Hints */}
        {showHints && hints.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
          >
            <div className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              💡 Hints:
            </div>
            <ul className="space-y-1">
              {hints.map((hint, index) => (
                <li key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                  {index + 1}. {hint}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            <Button
              onClick={executeCode}
              disabled={isRunning || !code.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {isRunning ? (
                <>
                  <StopIcon className="w-4 h-4 mr-2" />
                  Running...
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Run Code
                </>
              )}
            </Button>
          </div>
          
          {executionTime > 0 && (
            <div className="text-sm text-gray-500">
              Executed in {executionTime}ms
            </div>
          )}
        </div>
      </Card>

      {/* Output */}
      {output && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <h4 className="font-semibold mb-4">Output</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
              {output}
            </pre>
          </Card>
        </motion.div>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <h4 className="font-semibold mb-4">Test Results</h4>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    result.passed
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                  }`}
                >
                  {result.passed ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                  )}
                  <code className="text-sm font-mono">{result.message}</code>
                </div>
              ))}
            </div>
            
            {testResults.every(r => r.passed) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center"
              >
                <div className="text-green-800 dark:text-green-200 font-semibold">
                  🎉 All tests passed! Excellent work!
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  );
};