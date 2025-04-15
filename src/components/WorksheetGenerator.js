import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Grid,
  Typography,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import Worksheet from './Worksheet';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const THEMES = {
  default: {
    name: 'Default',
    colors: {
      primary: '#000000',
      secondary: '#000000',
      background: '#ffffff',
      problemBg: '#ffffff',
      messageBg: '#ffffff',
      keyBg: '#ffffff'
    },
    borderStyle: '1px solid #000000',
    textColor: '#000000',
    font: {
      title: "'Verdana', 'Segoe UI', sans-serif",
      problems: "'Verdana', 'Segoe UI', sans-serif",
      message: "'Courier New', monospace"
    }
  },
  minecraft: {
    name: '⛏️ Minecraft',
    colors: {
      primary: '#4C4C4C',
      secondary: '#7C7C7C',
      background: '#1E1E1E', // dark background
      problemBg: '#2E5C1E', // darker grass green
      messageBg: '#3B2314', // darker wood brown
      keyBg: '#2B2B2B', // dark stone
      numberKey: '#00FFFF', // bright cyan for better visibility
      secretMessage: '#FFFFFF' // white text for secret message
    },
    borderStyle: '4px solid #555555',
    textColor: '#FFFFFF', // white text for better visibility
    font: {
      title: "'Courier New', 'Lucida Console', monospace",
      problems: "'Courier New', 'Lucida Console', monospace",
      message: "'Courier New', monospace"
    },
    fontSize: {
      title: '28px',
      problems: '22px',
      message: '20px'
    },
    fontWeight: {
      title: 'bold',
      problems: 'bold',
      message: 'bold'
    }
  },
  candyland: {
    name: '🍭 Candy Land',
    colors: {
      primary: '#ff69b4',
      secondary: '#f06292',
      background: '#fff0f5',
      problemBg: '#fce4ec',
      messageBg: '#f8bbd0',
      keyBg: '#f48fb1'
    },
    borderStyle: '2px dashed #ff69b4',
    textColor: '#d81b60',
    font: {
      title: "'Verdana', 'Segoe UI', sans-serif",
      problems: "'Comic Sans MS', cursive",
      message: "'Comic Sans MS', cursive"
    }
  },
  superhero: {
    name: '🦸‍♂️ Superhero',
    colors: {
      primary: '#2196f3',
      secondary: '#ff5252',
      background: '#e3f2fd',
      problemBg: '#bbdefb',
      messageBg: '#90caf9',
      keyBg: '#64b5f6'
    },
    borderStyle: '3px solid #1976d2',
    textColor: '#1565c0',
    font: {
      title: "'Verdana', 'Segoe UI', sans-serif",
      problems: "'Comic Sans MS', cursive",
      message: "'Bangers', cursive"
    }
  },
  dinosaur: {
    name: '🦖 Dinosaur',
    colors: {
      primary: '#43a047',
      secondary: '#7cb342',
      background: '#e8f5e9',
      problemBg: '#c8e6c9',
      messageBg: '#a5d6a7',
      keyBg: '#81c784'
    },
    borderStyle: '4px ridge #2e7d32',
    textColor: '#2e7d32',
    font: {
      title: "'Verdana', 'Segoe UI', sans-serif",
      problems: "'Comic Sans MS', cursive",
      message: "'Fredoka One', cursive"
    }
  }
};

const DIFFICULTY_LEVELS = {
  easy: {
    name: 'Easy',
    ranges: {
      addition: { max: 10, maxFirstNum: 7 },
      subtraction: { max: 10, maxFirstNum: 10 },
      multiplication: { max: 5, maxFirstNum: 5 },
      division: { max: 20, maxDivisor: 5 }
    }
  },
  medium: {
    name: 'Medium',
    ranges: {
      addition: { max: 20, maxFirstNum: 15 },
      subtraction: { max: 20, maxFirstNum: 20 },
      multiplication: { max: 10, maxFirstNum: 10 },
      division: { max: 50, maxDivisor: 10 }
    }
  },
  hard: {
    name: 'Hard',
    ranges: {
      addition: { max: 100, maxFirstNum: 50 },
      subtraction: { max: 100, maxFirstNum: 100 },
      multiplication: { max: 144, maxFirstNum: 12 },
      division: { max: 144, maxDivisor: 12 }
    }
  }
};

const WorksheetGenerator = () => {
  const initialState = {
    title: "Numbers Under 100",
    numberOfProblems: 10,
    difficulty: 'easy',
    selectedOperations: {
      addition: true,
      subtraction: true,
      multiplication: false,
      division: false
    },
    secretMessage: "SUPERHEROES SAVE THE DAY",
    includeCodeBreaker: false,
    prefilledWords: ['THE', 'SAVE'],
    theme: 'default'
  };

  const [settings, setSettings] = useState(initialState);
  const [problems, setProblems] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const prevSettings = useRef(initialState);

  const worksheetRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => worksheetRef.current,
  });

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/templates`);
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const data = await response.json();
      setTemplates(data || []); // Ensure we always set an array, even if empty
    } catch (err) {
      console.warn('Could not fetch templates:', err);
      setTemplates([]); // Set empty array instead of showing error
    } finally {
      setIsLoading(false);
    }
  };

  const saveTemplate = async () => {
    try {
      if (!templateName.trim()) {
        setError('Please enter a template name');
        return;
      }

      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: templateName,
          settings: settings,
          isPublic: false,
          createdBy: 'anonymous'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save template');
      }
      
      fetchTemplates(); // Refresh templates list
      setTemplateName(''); // Clear the input field after successful save
      setError(null); // Clear any existing errors
    } catch (err) {
      setError(err.message || 'Failed to save template');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTemplate = async (templateId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/templates/${templateId}`);
      const template = await response.json();
      
      setSettings(template.settings);
      generateProblems();
    } catch (err) {
      setError('Failed to load template');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTemplate = async (templateId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/templates/${templateId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete template');
      
      fetchTemplates(); // Refresh templates list
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    } catch (err) {
      setError('Failed to delete template');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (template, event) => {
    event.stopPropagation();
    setTemplateToDelete(template);
    setDeleteDialogOpen(true);
  };

  // Memoize the generateLetterToNumberMapping function
  const generateLetterToNumberMapping = useCallback((message) => {
    const letterToNumber = {};
    const ranges = DIFFICULTY_LEVELS[settings.difficulty].ranges;
    
    // Get all unique letters from the message in order of appearance
    const uniqueLetters = Array.from(new Set(message.toUpperCase().split('').filter(char => char !== ' ')));
    
    // Set up initial number and increment based on difficulty
    let currentNumber;
    let increment;
    
    switch(settings.difficulty) {
      case 'easy':
        currentNumber = 2;
        increment = 1;
        break;
      case 'medium':
        currentNumber = 5;
        increment = 3;
        break;
      case 'hard':
        currentNumber = 5;
        increment = 6;
        break;
      default:
        currentNumber = 5;
        increment = 6;
    }
    
    // First pass: assign numbers to all letters in the message
    for (const letter of uniqueLetters) {
      // If letter doesn't have a number yet, assign the next available number
      if (!letterToNumber[letter]) {
        // Make sure we don't exceed the maximum allowed number
        while (currentNumber > ranges.addition.max) {
          currentNumber = 2; // Reset to 2 if we exceed the max
        }
        letterToNumber[letter] = currentNumber;
        currentNumber += increment;
      }
    }

    return letterToNumber;
  }, [settings.difficulty]);

  // Memoize the generateProblems function to avoid infinite loops
  const generateProblems = useCallback(() => {
    const message = settings.secretMessage.toUpperCase();
    const letterToNumber = generateLetterToNumberMapping(message);
    const problems = [];
    const ranges = DIFFICULTY_LEVELS[settings.difficulty].ranges;
    
    // Get available operations based on settings
    const availableOperations = [];
    if (settings.selectedOperations.addition) availableOperations.push('+');
    if (settings.selectedOperations.subtraction) availableOperations.push('-');
    if (settings.selectedOperations.multiplication) availableOperations.push('×');
    if (settings.selectedOperations.division) availableOperations.push('÷');
    
    if (availableOperations.length === 0) {
      availableOperations.push('+');
      setSettings(prev => ({
        ...prev,
        selectedOperations: {
          ...prev.selectedOperations,
          addition: true
        }
      }));
    }

    // Track which letters we've processed and which numbers we've used
    const processedLetters = new Set();
    const usedAnswers = new Set();
    let operationIndex = 0;

    // First, create problems for all letters in the secret message
    const messageLetters = message.split('').filter(char => char !== ' ');
    const uniqueMessageLetters = [...new Set(messageLetters)];

    // Generate problems for each unique letter in the message
    for (const letter of uniqueMessageLetters) {
      const targetAnswer = letterToNumber[letter];
      if (!targetAnswer) continue;

      let problemGenerated = false;
      let operationsAttempted = new Set();
      
      // Try each operation until we successfully generate a problem
      while (!problemGenerated && operationsAttempted.size < availableOperations.length) {
        const operation = availableOperations[operationIndex];
        operationsAttempted.add(operation);
        operationIndex = (operationIndex + 1) % availableOperations.length;
        
        switch (operation) {
          case '+': {
            const maxFirstNum = Math.min(targetAnswer - 1, ranges.addition.maxFirstNum);
            if (maxFirstNum > 0) {
              const firstNum = Math.floor(Math.random() * maxFirstNum) + 1;
              const secondNum = targetAnswer - firstNum;
              if (secondNum > 0 && secondNum <= ranges.addition.max) {
                problems.push({ 
                  firstNum, 
                  secondNum, 
                  operation: '+', 
                  answer: targetAnswer,
                  letter: letter
                });
                problemGenerated = true;
              }
            }
            break;
          }
          case '-': {
            const maxAdd = Math.min(5, ranges.subtraction.max - targetAnswer);
            const firstNum = targetAnswer + Math.floor(Math.random() * maxAdd) + 1;
            const secondNum = firstNum - targetAnswer;
            if (firstNum <= ranges.subtraction.maxFirstNum && secondNum > 0) {
              problems.push({ 
                firstNum, 
                secondNum, 
                operation: '-', 
                answer: targetAnswer,
                letter: letter
              });
              problemGenerated = true;
            }
            break;
          }
          case '×': {
            // Try to find factors that work within the multiplication range
            const factors = [];
            for (let i = 1; i <= Math.sqrt(targetAnswer); i++) {
              if (targetAnswer % i === 0) {
                const j = targetAnswer / i;
                if (i <= ranges.multiplication.maxFirstNum && j <= ranges.multiplication.maxFirstNum) {
                  factors.push([i, j]);
                }
              }
            }
            
            if (factors.length > 0) {
              const [firstNum, secondNum] = factors[Math.floor(Math.random() * factors.length)];
              problems.push({ 
                firstNum, 
                secondNum, 
                operation: '×', 
                answer: targetAnswer,
                letter: letter
              });
              problemGenerated = true;
            }
            break;
          }
          case '÷': {
            // Try to find a valid divisor that works within the division range
            const possibleDivisors = [];
            for (let i = 2; i <= ranges.division.maxDivisor; i++) {
              const dividend = targetAnswer * i;
              if (dividend <= ranges.division.max) {
                possibleDivisors.push(i);
              }
            }
            
            if (possibleDivisors.length > 0) {
              const divisor = possibleDivisors[Math.floor(Math.random() * possibleDivisors.length)];
              const dividend = targetAnswer * divisor;
              problems.push({ 
                firstNum: dividend, 
                secondNum: divisor, 
                operation: '÷', 
                answer: targetAnswer,
                letter: letter
              });
              problemGenerated = true;
            }
            break;
          }
          default:
            // Skip unsupported operations
            break;
        }
      }

      // If no operation worked, try addition as a fallback
      if (!problemGenerated) {
        const maxFirstNum = Math.min(targetAnswer - 1, ranges.addition.maxFirstNum);
        if (maxFirstNum > 0) {
          const firstNum = Math.floor(Math.random() * maxFirstNum) + 1;
          const secondNum = targetAnswer - firstNum;
          if (secondNum > 0) {
            problems.push({ 
              firstNum,
              secondNum,
              operation: '+',
              answer: targetAnswer,
              letter: letter
            });
            problemGenerated = true;
          }
        }
      }

      if (problemGenerated) {
        processedLetters.add(letter);
        usedAnswers.add(targetAnswer);
      }
    }

    // Fill remaining problems up to exactly numberOfProblems
    let remainingAttempts = 100; // Limit attempts to prevent infinite loops
    while (problems.length < settings.numberOfProblems && remainingAttempts > 0) {
      const operation = availableOperations[operationIndex];
      operationIndex = (operationIndex + 1) % availableOperations.length;
      
      let newProblem = null;
      let attempts = 0;
      const maxAttempts = 20;

      while (!newProblem && attempts < maxAttempts) {
        attempts++;
        let potentialProblem = null;

        // Generate a random number that hasn't been used yet
        const getUnusedAnswer = (max) => {
          // Allow reusing answers if we've used all available numbers
          const availableNumbers = [];
          for (let i = 1; i <= max; i++) {
            if (!usedAnswers.has(i) || problems.length >= uniqueMessageLetters.length) {
              availableNumbers.push(i);
            }
          }
          return availableNumbers.length > 0 
            ? availableNumbers[Math.floor(Math.random() * availableNumbers.length)]
            : null;
        };

        switch (operation) {
          case '+': {
            const answer = getUnusedAnswer(ranges.addition.max);
            if (answer) {
              const maxFirstNum = Math.min(answer - 1, ranges.addition.maxFirstNum);
              if (maxFirstNum > 0) {
                const firstNum = Math.floor(Math.random() * maxFirstNum) + 1;
                const secondNum = answer - firstNum;
                if (secondNum > 0) {
                  potentialProblem = { firstNum, secondNum, operation, answer };
                }
              }
            }
            break;
          }
          case '-': {
            const answer = getUnusedAnswer(ranges.subtraction.max);
            if (answer) {
              const maxAdd = Math.min(5, ranges.subtraction.max - answer);
              const firstNum = answer + Math.floor(Math.random() * maxAdd) + 1;
              const secondNum = firstNum - answer;
              if (firstNum <= ranges.subtraction.maxFirstNum && secondNum > 0) {
                potentialProblem = { firstNum, secondNum, operation, answer };
              }
            }
            break;
          }
          case '×': {
            const answer = getUnusedAnswer(ranges.multiplication.max);
            if (answer) {
              const factors = [];
              for (let i = 1; i <= Math.sqrt(answer); i++) {
                if (answer % i === 0) {
                  const j = answer / i;
                  if (i <= ranges.multiplication.maxFirstNum && j <= ranges.multiplication.maxFirstNum) {
                    factors.push([i, j]);
                  }
                }
              }
              if (factors.length > 0) {
                const [firstNum, secondNum] = factors[Math.floor(Math.random() * factors.length)];
                potentialProblem = { firstNum, secondNum, operation, answer };
              }
            }
            break;
          }
          case '÷': {
            const answer = getUnusedAnswer(ranges.division.maxDivisor);
            if (answer) {
              const possibleDivisors = [];
              for (let i = 2; i <= ranges.division.maxDivisor; i++) {
                const dividend = answer * i;
                if (dividend <= ranges.division.max) {
                  possibleDivisors.push(i);
                }
              }
              if (possibleDivisors.length > 0) {
                const divisor = possibleDivisors[Math.floor(Math.random() * possibleDivisors.length)];
                const dividend = answer * divisor;
                potentialProblem = { firstNum: dividend, secondNum: divisor, operation, answer };
              }
            }
            break;
          }
          default:
            // Skip unsupported operations
            break;
        }

        if (potentialProblem) {
          // Allow reusing letters if we need more problems
          const availableLetters = problems.length >= uniqueMessageLetters.length
            ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
            : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => !processedLetters.has(l));
          
          if (availableLetters.length > 0) {
            const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
            potentialProblem.letter = randomLetter;
            processedLetters.add(randomLetter);
            newProblem = potentialProblem;
            if (problems.length < uniqueMessageLetters.length) {
              usedAnswers.add(newProblem.answer);
            }
          }
        }
      }

      if (newProblem) {
        problems.push(newProblem);
      }
      
      remainingAttempts--;
    }

    // Ensure we don't exceed the requested number of problems
    const finalProblems = problems.slice(0, settings.numberOfProblems);
    finalProblems.letterToNumber = letterToNumber;
    return finalProblems;
  }, [settings.difficulty, settings.numberOfProblems, settings.selectedOperations, settings.secretMessage, generateLetterToNumberMapping]);

  // Initialize problems after first render
  useEffect(() => {
    setProblems(generateProblems());
  }, [generateProblems]);

  // Update problems when settings that affect problem generation change
  useEffect(() => {
    // Only regenerate when specific settings change
    if (
      settings.difficulty !== prevSettings.current.difficulty ||
      settings.numberOfProblems !== prevSettings.current.numberOfProblems ||
      JSON.stringify(settings.selectedOperations) !== JSON.stringify(prevSettings.current.selectedOperations) ||
      settings.secretMessage !== prevSettings.current.secretMessage
    ) {
      setProblems(generateProblems());
      prevSettings.current = {
        difficulty: settings.difficulty,
        numberOfProblems: settings.numberOfProblems,
        selectedOperations: { ...settings.selectedOperations },
        secretMessage: settings.secretMessage
      };
    }
  }, [settings, generateProblems]);

  const handleSettingsChange = (field, value) => {
    if (field === 'difficulty') {
      // When changing difficulty, preserve ALL current operation settings
      setSettings(prev => ({
        ...prev,
        difficulty: value
      }));
    } else if (field.startsWith('selectedOperations.')) {
      const operation = field.split('.')[1];
      setSettings(prev => {
        const newSettings = {
          ...prev,
          selectedOperations: {
            ...prev.selectedOperations,
            [operation]: value
          }
        };
        
        // Check if at least one operation is selected
        const hasSelectedOperation = Object.values(newSettings.selectedOperations).some(val => val);
        
        // If no operations are selected, keep the current operation enabled
        if (!hasSelectedOperation) {
          newSettings.selectedOperations[operation] = true;
        }
        
        return newSettings;
      });
    } else if (field === 'numberOfProblems') {
      // Ensure the number is at least 10
      const newValue = Math.max(10, value);
      setSettings(prev => ({
        ...prev,
        [field]: newValue
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleRegenerateProblems = () => {
    setProblems(generateProblems());
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Worksheet Settings
              </Typography>
              
              {/* Template Management Section */}
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  mb: 3, 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span role="img" aria-label="save">💾</span> Save Current Settings
                  </Typography>
                </Box>

                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ mb: 2 }}
                    action={
                      <IconButton
                        size="small"
                        onClick={() => setError(null)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    {error}
                  </Alert>
                )}

                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  <TextField
                    size="small"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter template name"
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={saveTemplate}
                    disabled={!templateName.trim() || isLoading}
                    size="small"
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                  >
                    Save
                  </Button>
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span role="img" aria-label="templates">📚</span> Saved Templates
                </Typography>

                {isLoading && !templates.length ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : templates.length > 0 ? (
                  <List sx={{ 
                    maxHeight: '300px', 
                    overflow: 'auto',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    bgcolor: 'background.paper'
                  }}>
                    {templates.map((template) => (
                      <ListItem
                        key={template._id}
                        disablePadding
                        secondaryAction={
                          <IconButton
                            edge="end"
                            onClick={(e) => handleDeleteClick(template, e)}
                            title="Delete template"
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        }
                        sx={{
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          '&:last-child': {
                            borderBottom: 'none'
                          }
                        }}
                      >
                        <ListItemButton 
                          onClick={() => loadTemplate(template._id)}
                          sx={{ 
                            py: 1.5,
                            '&:hover': {
                              bgcolor: 'action.hover',
                              '& .apply-settings-text': {
                                opacity: 1,
                                transform: 'translateX(0)',
                              }
                            },
                            position: 'relative',
                            pl: 2
                          }}
                        >
                          <Box sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <Typography variant="body1" sx={{ fontWeight: 500, flex: 1 }}>
                                {template.name}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                className="apply-settings-text"
                                sx={{ 
                                  color: 'primary.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  opacity: 0,
                                  transform: 'translateX(-8px)',
                                  transition: 'all 0.2s ease-in-out',
                                  fontSize: '0.75rem',
                                  fontWeight: 400
                                }}
                              >
                                Apply settings
                              </Typography>
                            </Box>
                            <Box sx={{ 
                              display: 'flex', 
                              gap: 1,
                              flexWrap: 'wrap'
                            }}>
                              <Typography 
                                component="span" 
                                variant="caption" 
                                sx={{ 
                                  color: 'text.secondary',
                                  bgcolor: 'action.hover',
                                  px: 1,
                                  py: 0.25,
                                  borderRadius: 1
                                }}
                              >
                                {template.settings.difficulty.charAt(0).toUpperCase() + template.settings.difficulty.slice(1)}
                              </Typography>
                              {Object.entries(template.settings.selectedOperations)
                                .filter(([_, enabled]) => enabled)
                                .map(([op]) => (
                                  <Typography
                                    key={op}
                                    component="span"
                                    variant="caption"
                                    sx={{ 
                                      color: 'text.secondary',
                                      bgcolor: 'action.hover',
                                      px: 1,
                                      py: 0.25,
                                      borderRadius: 1
                                    }}
                                  >
                                    {op.charAt(0).toUpperCase() + op.slice(1)}
                                  </Typography>
                                ))}
                            </Box>
                          </Box>
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box 
                    sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                      bgcolor: 'background.paper'
                    }}
                  >
                    <Typography color="text.secondary" variant="body2">
                      No templates saved yet
                    </Typography>
                    <Typography color="text.secondary" variant="caption" display="block">
                      Save your current settings as a template to reuse them later
                    </Typography>
                  </Box>
                )}
              </Paper>

              {/* Reset Settings Button */}
              <Button 
                variant="outlined" 
                color="secondary"
                fullWidth 
                onClick={() => setSettings(initialState)}
                sx={{ 
                  mb: 3,
                  py: 1,
                  borderWidth: 2,
                  bgcolor: 'rgba(245, 0, 87, 0.05)',
                  '&:hover': {
                    bgcolor: 'rgba(245, 0, 87, 0.1)',
                    borderWidth: 2
                  }
                }}
              >
                <span style={{ fontSize: '1.2em', marginRight: '8px' }}>↺</span>
                Reset All Settings
              </Button>

              {/* Teacher Mode Section */}
              <Box 
                sx={{ 
                  mb: 3, 
                  p: 2, 
                  border: '2px solid #ff9800',
                  borderRadius: 1,
                  bgcolor: 'rgba(255, 152, 0, 0.1)',
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  color="warning.main" 
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 1,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  👩‍🏫 Teacher Mode
                </Typography>
                <FormControlLabel
                  sx={{
                    display: 'flex',
                    margin: 0,
                    alignItems: 'flex-start',
                    '& .MuiFormControlLabel-label': {
                      flex: 1,
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }
                  }}
                  control={
                    <Switch
                      checked={settings.includeCodeBreaker}
                      onChange={(e) => {
                        handleSettingsChange('includeCodeBreaker', e.target.checked);
                      }}
                      color="warning"
                      sx={{ mt: 0.5 }}
                    />
                  }
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                      >
                        Show Answer Key
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        ⚠️ This will reveal all answers and the secret message. Use only for checking or demonstration.
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={settings.theme}
                    onChange={(e) => {
                      handleSettingsChange('theme', e.target.value);
                    }}
                    label="Theme"
                  >
                    {Object.entries(THEMES).map(([key, theme]) => (
                      <MenuItem key={key} value={key}>{theme.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={settings.difficulty}
                    onChange={(e) => {
                      handleSettingsChange('difficulty', e.target.value);
                    }}
                    label="Difficulty"
                  >
                    {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
                      <MenuItem key={key} value={key}>{level.name}</MenuItem>
                    ))}
                  </Select>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, ml: 1 }}>
                    {settings.difficulty === 'easy' && (
                      <>
                        Easy Level Ranges:
                        <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                          <li>Addition: numbers up to 10</li>
                          <li>Subtraction: numbers up to 10</li>
                          <li>Multiplication: numbers up to 5</li>
                          <li>Division: numbers up to 20, divisors up to 5</li>
                        </ul>
                        Perfect for beginners and early learners.
                      </>
                    )}
                    {settings.difficulty === 'medium' && (
                      <>
                        Medium Level Ranges:
                        <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                          <li>Addition: numbers up to 20</li>
                          <li>Subtraction: numbers up to 20</li>
                          <li>Multiplication: numbers up to 10</li>
                          <li>Division: numbers up to 50, divisors up to 10</li>
                        </ul>
                        Good for students who have mastered basic operations.
                      </>
                    )}
                    {settings.difficulty === 'hard' && (
                      <>
                        Hard Level Ranges:
                        <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                          <li>Addition: numbers up to 100</li>
                          <li>Subtraction: numbers up to 100</li>
                          <li>Multiplication: numbers up to 144 (full times tables)</li>
                          <li>Division: numbers up to 144, divisors up to 12</li>
                        </ul>
                        Challenging problems for advanced students.
                      </>
                    )}
                  </Typography>
                </FormControl>
                <TextField
                  fullWidth
                  label="Worksheet Title"
                  value={settings.title}
                  onChange={(e) => {
                    handleSettingsChange('title', e.target.value);
                  }}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Number of Problems"
                  type="number"
                  value={settings.numberOfProblems}
                  onChange={(e) => {
                    handleSettingsChange('numberOfProblems', parseInt(e.target.value) || 10);
                  }}
                  margin="normal"
                  inputProps={{ 
                    min: 10,
                    step: 1
                  }}
                  helperText="Minimum 10 problems required"
                />
                <TextField
                  fullWidth
                  label="Secret Message"
                  value={settings.secretMessage}
                  onChange={(e) => {
                    handleSettingsChange('secretMessage', e.target.value);
                  }}
                  margin="normal"
                  multiline
                />
                <TextField
                  fullWidth
                  label="Prefilled Words (comma-separated)"
                  value={settings.prefilledWords.join(', ')}
                  onChange={(e) => {
                    const words = e.target.value.split(',').map(w => w.trim()).filter(w => w);
                    handleSettingsChange('prefilledWords', words);
                  }}
                  margin="normal"
                  helperText="Enter words to show as hints, separated by commas"
                />
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Operations
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.selectedOperations.addition}
                      onChange={(e) => {
                        handleSettingsChange('selectedOperations.addition', e.target.checked);
                      }}
                    />
                  }
                  label="Addition (+)"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.selectedOperations.subtraction}
                      onChange={(e) => {
                        handleSettingsChange('selectedOperations.subtraction', e.target.checked);
                      }}
                    />
                  }
                  label="Subtraction (-)"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.selectedOperations.multiplication}
                      onChange={(e) => {
                        handleSettingsChange('selectedOperations.multiplication', e.target.checked);
                      }}
                    />
                  }
                  label="Multiplication (×)"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.selectedOperations.division}
                      onChange={(e) => {
                        handleSettingsChange('selectedOperations.division', e.target.checked);
                      }}
                    />
                  }
                  label="Division (÷)"
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  onClick={handleRegenerateProblems}
                  sx={{ mt: 2 }}
                >
                  Generate New Problems
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth 
                  onClick={handlePrint}
                  sx={{ mt: 2 }}
                >
                  Export PDF
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <div ref={worksheetRef}>
                <Worksheet 
                  settings={settings}
                  problems={problems}
                  theme={THEMES[settings.theme]}
                />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setTemplateToDelete(null);
        }}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 400,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          Delete Template?
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Typography>
            Are you sure you want to delete "{templateToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setTemplateToDelete(null);
            }}
            color="inherit"
            variant="outlined"
            size="small"
          >
            Cancel
          </Button>
          <Button
            onClick={() => deleteTemplate(templateToDelete?._id)}
            color="error"
            variant="contained"
            size="small"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} /> : null}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WorksheetGenerator; 