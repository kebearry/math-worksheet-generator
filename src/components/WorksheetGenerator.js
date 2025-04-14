import React, { useState, useRef, useEffect } from 'react';
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
  FormControl
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import Worksheet from './Worksheet';

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
      multiplication: { max: 12, maxFirstNum: 12 },
      division: { max: 100, maxDivisor: 12 }
    }
  }
};

const WorksheetGenerator = () => {
  const initialState = {
    title: "Numbers Under 100",
    numberOfProblems: 10,
    maxNumber: 100,
    difficulty: 'easy',
    selectedOperations: {
      addition: true,
      subtraction: true,
      multiplication: false,
      division: false
    },
    secretMessage: "SUPERHEROES SAVE THE DAY",
    includeCodeBreaker: true,
    prefilledWords: ['THE', 'SAVE'],
    theme: 'default'
  };

  const [settings, setSettings] = useState(initialState);
  const [problems, setProblems] = useState([]);

  const worksheetRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => worksheetRef.current,
  });

  // Initialize problems after first render
  useEffect(() => {
    setProblems(generateProblems());
  }, []);

  // Update problems whenever relevant settings change
  useEffect(() => {
    console.log('Settings changed:', settings);
    setProblems(generateProblems());
  }, [
    settings.numberOfProblems, 
    settings.maxNumber, 
    settings.secretMessage,
    settings.difficulty,
    settings.selectedOperations.addition,
    settings.selectedOperations.subtraction,
    settings.selectedOperations.multiplication,
    settings.selectedOperations.division
  ]);

  const handleSettingsChange = (field) => (event) => {
    const newValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    
    if (field.startsWith('selectedOperations.')) {
      const operation = field.split('.')[1];
      setSettings(prev => {
        // Create new settings object with updated operation
        const newSettings = {
          ...prev,
          selectedOperations: {
            ...prev.selectedOperations,
            [operation]: newValue
          }
        };
        
        // Check if at least one operation is selected
        const hasSelectedOperation = Object.values(newSettings.selectedOperations).some(value => value);
        
        // If no operations are selected, keep the current operation enabled
        if (!hasSelectedOperation) {
          newSettings.selectedOperations[operation] = true;
        }
        
        return newSettings;
      });
    } else if (field === 'difficulty') {
      setSettings(prev => ({
        ...prev,
        difficulty: newValue
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: newValue
      }));
    }
  };

  const handleRegenerateProblems = () => {
    setProblems(generateProblems());
  };

  function generateLetterToNumberMapping(message) {
    // Remove spaces and get unique letters in order of appearance
    const uniqueLetters = [];
    const letterToNumber = {};
    const ranges = DIFFICULTY_LEVELS[settings.difficulty].ranges;
    
    // First pass: collect unique letters in order of appearance
    message.toUpperCase().split('').forEach(char => {
      if (char !== ' ' && !uniqueLetters.includes(char)) {
        uniqueLetters.push(char);
      }
    });
    
    // Second pass: assign numbers based on difficulty level
    // For easy: start at 2, increment by 1 (to stay within 10)
    // For medium: start at 5, increment by 3 (to stay within 20)
    // For hard: start at 5, increment by 6 (to stay within 100)
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
    
    uniqueLetters.forEach(letter => {
      // Ensure we don't exceed the maximum number for the difficulty level
      if (currentNumber <= ranges.addition.max) {
        letterToNumber[letter] = currentNumber;
        currentNumber += increment;
      } else {
        // If we exceed the max, wrap back to a smaller number that hasn't been used
        let num = 2;
        while (Object.values(letterToNumber).includes(num) && num <= ranges.addition.max) {
          num++;
        }
        if (num <= ranges.addition.max) {
          letterToNumber[letter] = num;
        }
      }
    });

    console.log('Letter to Number Mapping:', letterToNumber);
    return letterToNumber;
  }

  function generateProblems() {
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
    let operationIndex = 0;  // Track which operation to use next
    
    // First, generate problems for each unique letter in the message
    [...message].forEach(char => {
      if (char === ' ' || processedLetters.has(char)) return;
      
      processedLetters.add(char);
      const targetAnswer = letterToNumber[char];
      
      if (!targetAnswer) return;
      
      usedAnswers.add(targetAnswer);
      let problemGenerated = false;
      
      // Try each operation starting with the current index
      for (let i = 0; i < availableOperations.length && !problemGenerated; i++) {
        const currentIndex = (operationIndex + i) % availableOperations.length;
        const operation = availableOperations[currentIndex];
        
        switch (operation) {
          case '+': {
            if (targetAnswer <= ranges.addition.max) {
              const maxFirstNum = Math.min(targetAnswer - 1, ranges.addition.maxFirstNum);
              const firstNum = Math.floor(Math.random() * maxFirstNum) + 1;
              const secondNum = targetAnswer - firstNum;
              if (secondNum <= ranges.addition.max) {
                problems.push({ 
                  firstNum, 
                  secondNum, 
                  operation: '+', 
                  answer: targetAnswer,
                  letter: char
                });
                problemGenerated = true;
                operationIndex = (currentIndex + 1) % availableOperations.length;
              }
            }
            break;
          }
          case '-': {
            if (targetAnswer <= ranges.subtraction.max) {
              const maxAdd = Math.min(2, ranges.subtraction.max - targetAnswer);
              const firstNum = targetAnswer + Math.floor(Math.random() * maxAdd) + 1;
              const secondNum = firstNum - targetAnswer;
              if (firstNum <= ranges.subtraction.maxFirstNum) {
                problems.push({ 
                  firstNum, 
                  secondNum, 
                  operation: '-', 
                  answer: targetAnswer,
                  letter: char
                });
                problemGenerated = true;
                operationIndex = (currentIndex + 1) % availableOperations.length;
              }
            }
            break;
          }
          case '×': {
            if (targetAnswer <= ranges.multiplication.max * ranges.multiplication.max) {
              const factors = [];
              for (let i = 1; i <= Math.min(Math.sqrt(targetAnswer), ranges.multiplication.maxFirstNum); i++) {
                if (targetAnswer % i === 0) {
                  const otherFactor = targetAnswer / i;
                  if (otherFactor <= ranges.multiplication.maxFirstNum) {
                    factors.push([i, otherFactor]);
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
                  letter: char
                });
                problemGenerated = true;
                operationIndex = (currentIndex + 1) % availableOperations.length;
              }
            }
            break;
          }
          case '÷': {
            if (targetAnswer <= ranges.division.maxDivisor) {
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
                  letter: char
                });
                problemGenerated = true;
                operationIndex = (currentIndex + 1) % availableOperations.length;
              }
            }
            break;
          }
        }
      }
      
      // If no operation worked, use addition as fallback
      if (!problemGenerated) {
        const maxFirstNum = Math.min(targetAnswer - 1, ranges.addition.maxFirstNum);
        const firstNum = Math.floor(Math.random() * maxFirstNum) + 1;
        const secondNum = targetAnswer - firstNum;
        if (secondNum <= ranges.addition.max) {
          problems.push({ 
            firstNum,
            secondNum,
            operation: '+',
            answer: targetAnswer,
            letter: char
          });
        }
      }
    });

    // Fill remaining problems with random ones that don't duplicate any letter answers
    while (problems.length < settings.numberOfProblems) {
      const operation = availableOperations[operationIndex];
      operationIndex = (operationIndex + 1) % availableOperations.length;
      
      let newProblem = null;
      let attempts = 0;
      const maxAttempts = 100;

      while (!newProblem && attempts < maxAttempts) {
        attempts++;
        let potentialProblem = null;

        switch (operation) {
          case '+': {
            const firstNum = Math.floor(Math.random() * ranges.addition.maxFirstNum) + 1;
            const maxSecond = Math.min(ranges.addition.max - firstNum, ranges.addition.max);
            const secondNum = Math.floor(Math.random() * maxSecond) + 1;
            const answer = firstNum + secondNum;
            if (!usedAnswers.has(answer) && answer <= ranges.addition.max) {
              potentialProblem = { firstNum, secondNum, operation, answer };
            }
            break;
          }
          case '-': {
            const maxFirstNum = ranges.subtraction.maxFirstNum;
            const firstNum = Math.floor(Math.random() * maxFirstNum) + 1;
            const maxSecond = Math.min(firstNum - 1, ranges.subtraction.max);
            const secondNum = Math.floor(Math.random() * maxSecond) + 1;
            const answer = firstNum - secondNum;
            if (!usedAnswers.has(answer) && answer <= ranges.subtraction.max) {
              potentialProblem = { firstNum, secondNum, operation, answer };
            }
            break;
          }
          case '×': {
            const maxNum = ranges.multiplication.maxFirstNum;
            const firstNum = Math.floor(Math.random() * maxNum) + 1;
            const secondNum = Math.floor(Math.random() * maxNum) + 1;
            const answer = firstNum * secondNum;
            if (answer <= ranges.multiplication.max * ranges.multiplication.max && !usedAnswers.has(answer)) {
              potentialProblem = { firstNum, secondNum, operation, answer };
            }
            break;
          }
          case '÷': {
            const maxDivisor = ranges.division.maxDivisor;
            const divisor = Math.floor(Math.random() * (maxDivisor - 1)) + 2;
            const maxQuotient = Math.floor(ranges.division.max / divisor);
            const quotient = Math.floor(Math.random() * maxQuotient) + 1;
            const dividend = divisor * quotient;
            if (dividend <= ranges.division.max && !usedAnswers.has(quotient)) {
              potentialProblem = { 
                firstNum: dividend, 
                secondNum: divisor, 
                operation: '÷', 
                answer: quotient 
              };
            }
            break;
          }
        }

        if (potentialProblem) {
          newProblem = potentialProblem;
          usedAnswers.add(newProblem.answer);
        }
      }

      // If we couldn't find a unique answer, create a simple problem within range
      if (!newProblem) {
        switch (operation) {
          case '×': {
            const maxNum = ranges.multiplication.maxFirstNum;
            const firstNum = Math.floor(Math.random() * maxNum) + 1;
            const secondNum = Math.floor(Math.random() * maxNum) + 1;
            newProblem = {
              firstNum,
              secondNum,
              operation: '×',
              answer: firstNum * secondNum
            };
            break;
          }
          case '÷': {
            const divisor = Math.floor(Math.random() * (ranges.division.maxDivisor - 1)) + 2;
            const quotient = Math.floor(Math.random() * (ranges.division.maxDivisor - 1)) + 2;
            const dividend = divisor * quotient;
            newProblem = {
              firstNum: dividend,
              secondNum: divisor,
              operation: '÷',
              answer: quotient
            };
            break;
          }
          default: {
            const firstNum = Math.floor(Math.random() * (ranges.addition.maxFirstNum - 1)) + 1;
            const maxSecond = ranges.addition.max - firstNum;
            const secondNum = Math.floor(Math.random() * maxSecond) + 1;
            newProblem = {
              firstNum,
              secondNum,
              operation: '+',
              answer: firstNum + secondNum
            };
          }
        }
      }

      problems.push(newProblem);
    }

    return problems;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Worksheet Settings
              </Typography>
              <Box sx={{ mb: 2 }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={settings.theme}
                    onChange={handleSettingsChange('theme')}
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
                    onChange={handleSettingsChange('difficulty')}
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
                          <li>Multiplication: numbers up to 12 (full times tables)</li>
                          <li>Division: numbers up to 100, divisors up to 12</li>
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
                  onChange={handleSettingsChange('title')}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Number of Problems"
                  type="number"
                  value={settings.numberOfProblems}
                  onChange={handleSettingsChange('numberOfProblems')}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Maximum Number"
                  type="number"
                  value={settings.maxNumber}
                  onChange={handleSettingsChange('maxNumber')}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Secret Message"
                  value={settings.secretMessage}
                  onChange={handleSettingsChange('secretMessage')}
                  margin="normal"
                  multiline
                />
                <TextField
                  fullWidth
                  label="Prefilled Words (comma-separated)"
                  value={settings.prefilledWords.join(', ')}
                  onChange={(e) => {
                    const words = e.target.value.split(',').map(w => w.trim()).filter(w => w);
                    setSettings(prev => ({
                      ...prev,
                      prefilledWords: words
                    }));
                  }}
                  margin="normal"
                  helperText="Enter words to show as hints, separated by commas"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.includeCodeBreaker}
                      onChange={handleSettingsChange('includeCodeBreaker')}
                    />
                  }
                  label="Include Code Breaker"
                />
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Operations
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.selectedOperations.addition}
                      onChange={(e) => {
                        handleSettingsChange('selectedOperations.addition')(e);
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
                        handleSettingsChange('selectedOperations.subtraction')(e);
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
                        handleSettingsChange('selectedOperations.multiplication')(e);
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
                        handleSettingsChange('selectedOperations.division')(e);
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
    </Container>
  );
};

export default WorksheetGenerator; 