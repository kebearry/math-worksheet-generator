import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const Worksheet = ({ settings, problems, theme = {
  colors: {
    background: '#ffffff',
    problemBg: '#ffffff',
    messageBg: '#ffffff',
    keyBg: '#ffffff'
  },
  borderStyle: '1px solid black',
  textColor: '#000000',
  font: {
    title: "'Verdana', 'Segoe UI', sans-serif",
    problems: "'Verdana', 'Segoe UI', sans-serif",
    message: "'Courier New', monospace"
  }
} }) => {
  // Create a mapping of letters to their corresponding numbers
  const letterToNumber = {};
  problems.forEach(problem => {
    if (problem.answer && problem.letter) {
      letterToNumber[problem.letter] = problem.answer;
    }
  });

  const renderProblem = (problem, index) => (
    <Box 
      key={index} 
      sx={{ 
        border: theme.borderStyle,
        borderRadius: '4px',
        p: 2,
        mb: 2,
        width: '100%',
        bgcolor: theme.colors.problemBg
      }}
    >
      <Typography variant="h6" sx={{ 
        fontFamily: theme.font.problems,
        color: theme.textColor
      }}>
        {problem.firstNum} {problem.operation} {problem.secondNum} = _____
        {settings.includeCodeBreaker && (
          <Typography 
            component="span" 
            sx={{ 
              ml: 2,
              color: 'blue',
              fontSize: '0.8em',
              fontFamily: theme.font.problems
            }}
          >
            Answer: {problem.answer}
          </Typography>
        )}
      </Typography>
    </Box>
  );

  const renderSecretMessage = () => {
    const message = settings.secretMessage.toUpperCase();
    
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" align="center" gutterBottom sx={{
          fontFamily: theme.font.message,
          color: theme.colors.secretMessage || theme.textColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}>
          <span>🔍 Crack The Secret Message</span>
        </Typography>
        <Box 
          sx={{ 
            bgcolor: theme.colors.messageBg,
            p: 2,
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            flexWrap: 'wrap',
            border: theme.borderStyle
          }}
        >
          {message.split('').map((char, index) => {
            const isSpace = char === ' ';
            const isPrefilled = settings.prefilledWords.some(word => 
              message.indexOf(word.toUpperCase()) === index ||
              word.toUpperCase().includes(char)
            );
            
            return (
              <Box 
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Box
                  sx={{
                    width: '30px',
                    height: '30px',
                    border: isSpace ? 'none' : theme.borderStyle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: isSpace ? 'transparent' : (theme.colors.background === '#1E1E1E' ? '#4C4C4C' : '#fff'),
                    mb: 0.5
                  }}
                >
                  <Typography variant="body1" sx={{
                    fontFamily: theme.font.message,
                    color: theme.colors.secretMessage || theme.textColor,
                    fontWeight: 'bold'
                  }}>
                    {isSpace ? ' ' : (settings.includeCodeBreaker || isPrefilled ? char : '_')}
                  </Typography>
                </Box>
                {!isSpace && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: theme.font.message,
                      fontSize: '0.9rem',
                      color: theme.colors.secretMessage || theme.textColor,
                      fontWeight: 'bold',
                      minHeight: '1.2em'
                    }}
                  >
                    {letterToNumber[char] || '\u2013'}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  const renderNumberKey = () => {
    // Create a mapping of numbers to letters
    const numberToLetter = {};
    const messageLetters = new Set(settings.secretMessage.toUpperCase().split('').filter(char => char !== ' '));
    
    // First, add all letters that are in the secret message
    problems.forEach(problem => {
      if (problem.answer && problem.letter) {
        numberToLetter[problem.answer] = problem.letter;
      }
    });

    // Sort by number value
    const sortedEntries = Object.entries(numberToLetter)
      .sort(([a], [b]) => parseInt(a) - parseInt(b));

    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ 
          color: theme.colors.numberKey || '#0000FF',
          fontFamily: theme.font.message,
          fontWeight: 'bold',
          mb: 2
        }}>
          Number Key:
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 3, 
          flexWrap: 'wrap',
          mt: 1,
          color: theme.colors.numberKey || '#0000FF',
          fontFamily: theme.font.message,
          bgcolor: theme.colors.keyBg,
          p: 2,
          borderRadius: '4px',
          border: theme.borderStyle,
          fontSize: '1.2rem'
        }}>
          {sortedEntries.map(([number, letter], index) => (
            <Typography key={index} sx={{ 
              fontWeight: 'bold',
              textShadow: theme.colors.background === '#1E1E1E' ? '0px 0px 2px rgba(0,0,0,0.8)' : 'none',
              backgroundColor: messageLetters.has(letter) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              padding: '4px 12px',
              borderRadius: '4px',
              border: messageLetters.has(letter) ? '1px dashed currentColor' : 'none'
            }}>
              {number} = {letter}
            </Typography>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ 
      p: 3,
      bgcolor: theme.colors.background
    }}>
      {settings.includeCodeBreaker && (
        <Box 
          sx={{ 
            mb: 3,
            p: 2,
            border: '2px dashed #ff9800',
            borderRadius: 1,
            bgcolor: 'rgba(255, 152, 0, 0.1)',
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="subtitle1" 
            color="warning.main" 
            sx={{ 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}
          >
            <span role="img" aria-label="warning">⚠️</span>
            TEACHER'S COPY - Answer Key Visible
            <span role="img" aria-label="warning">⚠️</span>
          </Typography>
        </Box>
      )}
      
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{
          fontFamily: theme.font.title,
          color: theme.textColor,
          fontWeight: 'bold',
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}>
          <span role="img" aria-label="cute star" style={{ 
            fontSize: '0.8em',
            opacity: theme.colors.background === '#1E1E1E' ? 0.9 : 1
          }}>⭐</span>
          {settings.title}
          <span role="img" aria-label="cute star" style={{ 
            fontSize: '0.8em',
            opacity: theme.colors.background === '#1E1E1E' ? 0.9 : 1
          }}>⭐</span>
        </Typography>
        <Typography variant="subtitle1" sx={{
          fontFamily: theme.font.title,
          color: theme.textColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          mt: 2
        }}>
          <span role="img" aria-label="cute character" style={{ 
            fontSize: '1.5em',
            opacity: theme.colors.background === '#1E1E1E' ? 0.9 : 1
          }}>🐱</span>
          <span style={{ 
            backgroundColor: theme.colors.background === '#1E1E1E' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(74, 144, 226, 0.1)',
            padding: '4px 12px', 
            borderRadius: '20px',
            color: theme.textColor,
            fontWeight: 'bold',
            border: theme.colors.background === '#1E1E1E' 
              ? '1px solid rgba(255, 255, 255, 0.2)'
              : '1px solid rgba(74, 144, 226, 0.3)'
          }}>
            Let's solve some math!
          </span>
          <span role="img" aria-label="cute character" style={{ 
            fontSize: '1.5em',
            opacity: theme.colors.background === '#1E1E1E' ? 0.9 : 1
          }}>✨</span>
        </Typography>
      </Box>
      
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          {problems.slice(0, Math.ceil(problems.length / 2)).map((problem, index) => 
            renderProblem(problem, index)
          )}
        </Grid>
        <Grid item xs={6}>
          {problems.slice(Math.ceil(problems.length / 2)).map((problem, index) => 
            renderProblem(problem, index + Math.ceil(problems.length / 2))
          )}
        </Grid>
      </Grid>

      {renderSecretMessage()}
      {renderNumberKey()}
    </Box>
  );
};

export default Worksheet; 