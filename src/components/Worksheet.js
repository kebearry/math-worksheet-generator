import React from 'react';
import { Box, Typography, Grid} from '@mui/material';

const Worksheet = ({ settings, problems, theme = {
  colors: {
    background: '#FFF0F3',  // Light pink background
    problemBg: '#FFFFFF',
    messageBg: '#FFE5EB',  // Slightly darker pink for message bg
    keyBg: '#FFE5EB',      // Match message bg
    numberKey: '#FF69B4'   // Hot pink for text
  },
  borderStyle: '1px solid #FFB6C1',  // Light pink border
  textColor: '#FF1493',  // Deep pink for text
  font: {
    title: "'Verdana', 'Segoe UI', sans-serif",
    problems: "'Verdana', 'Segoe UI', sans-serif",
    message: "'Courier New', monospace"
  }
} }) => {
  // Use the letterToNumber mapping directly from problems
  const letterToNumber = problems.letterToNumber || {};

  const renderProblem = (problem, index) => (
    <Box 
      key={index} 
      sx={{ 
        border: theme.borderStyle,
        borderRadius: '4px',
        p: 3,
        mb: 2,
        width: '100%',
        bgcolor: theme.colors.problemBg,
        position: 'relative'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: theme.font.problems,
              color: theme.textColor,
              fontSize: '1.2em',
              flex: '0 0 auto'
            }}
          >
            {problem.firstNum} {problem.operation} {problem.secondNum} =
          </Typography>
          <Box 
            sx={{ 
              flex: 1,
              position: 'relative',
              height: '32px',
              display: 'flex',
              alignItems: 'flex-end'
            }} 
          >
            <Box sx={{ 
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              borderBottom: `1px solid ${theme.textColor}`
            }} />
            {settings.includeCodeBreaker && (
              <Typography 
                sx={{ 
                  position: 'absolute',
                  top: '0',
                  right: '8px',
                  color: '#1565c0',
                  fontSize: '0.9em',
                  fontFamily: theme.font.problems,
                  bgcolor: 'rgba(25, 118, 210, 0.12)',
                  px: 1.5,
                  py: 0.25,
                  borderRadius: 1,
                  border: '1px dashed #1565c0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  whiteSpace: 'nowrap',
                  height: 'fit-content'
                }}
              >
                <span style={{ 
                  fontSize: '0.85em', 
                  opacity: 0.9,
                  fontWeight: 'bold'
                }}>
                  ANS:
                </span>
                {problem.answer}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const renderSecretMessage = () => {
    const message = settings.secretMessage.toUpperCase();
    const words = message.split(' ').map(word => word.split(''));
    
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" align="center" gutterBottom sx={{
          fontFamily: "'Courier New', monospace",
          color: theme.textColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          mb: 1.5,
          textShadow: theme.colors.background === '#1E1E1E' ? '0 0 2px rgba(255,255,255,0.5)' : 'none'
        }}>
          <span>🔍 Crack The Secret Message</span>
        </Typography>
        <Box 
          sx={{ 
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '4px',
            py: 2,
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: theme.colors.messageBg,
            boxShadow: theme.colors.background === '#1E1E1E' ? '0 0 10px rgba(0,0,0,0.5)' : 'none'
          }}
        >
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
            my: 1,
            maxWidth: '100%',
            px: 1
          }}>
            {words.map((word, wordIndex) => (
              <React.Fragment key={wordIndex}>
                <Box 
                  sx={{
                    display: 'flex',
                    gap: '4px',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}
                >
                  {word.map((char, charIndex) => {
                    const isPrefilled = settings.prefilledWords.some(prefilled => 
                      prefilled.toUpperCase().includes(char)
                    );
                    
                    return (
                      <Box key={`${wordIndex}-${charIndex}`}>
                        <Box 
                          sx={{
                            width: { xs: '24px', sm: '28px' },
                            height: { xs: '24px', sm: '28px' },
                            border: '1px solid rgba(255,255,255,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 0.5,
                            bgcolor: 'rgba(255,255,255,0.05)',
                            boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2)'
                          }}
                        >
                          <Typography sx={{
                            fontFamily: "'Courier New', monospace",
                            fontSize: { xs: '14px', sm: '16px' },
                            lineHeight: 1,
                            color: theme.textColor,
                            textShadow: theme.colors.background === '#1E1E1E' ? '0 0 2px rgba(255,255,255,0.5)' : 'none'
                          }}>
                            {settings.includeCodeBreaker || isPrefilled ? char : '_'}
                          </Typography>
                        </Box>
                        <Typography 
                          align="center"
                          sx={{ 
                            fontFamily: "'Courier New', monospace",
                            fontSize: { xs: '12px', sm: '14px' },
                            lineHeight: 1,
                            color: theme.textColor,
                            textShadow: theme.colors.background === '#1E1E1E' ? '0 0 2px rgba(255,255,255,0.5)' : 'none'
                          }}
                        >
                          {letterToNumber[char] || '\u2013'}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
                {wordIndex < words.length - 1 && (
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    height: { xs: '24px', sm: '28px' },
                    mb: '20px',
                    opacity: 0.5
                  }}>
                    <Typography sx={{ 
                      color: theme.textColor,
                      fontSize: '20px',
                      lineHeight: 1
                    }}>
                      ·
                    </Typography>
                  </Box>
                )}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  const renderNumberKey = () => {
    // Create a mapping of numbers to letters
    const numberToLetter = {};
    const messageLetters = new Set(settings.secretMessage.toUpperCase().split('').filter(char => char !== ' '));
    
    // Use the letterToNumber mapping to create the number key
    Object.entries(letterToNumber).forEach(([letter, number]) => {
      numberToLetter[number] = letter;
    });

    // Get entries and shuffle them
    let entries = Object.entries(numberToLetter);
    for (let i = entries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [entries[i], entries[j]] = [entries[j], entries[i]];
    }

    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ 
          color: theme.textColor,
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
          color: theme.textColor,
          fontFamily: theme.font.message,
          bgcolor: theme.colors.keyBg,
          p: 2,
          borderRadius: '12px',
          border: theme.borderStyle,
          fontSize: '1.2rem',
          boxShadow: '0 4px 8px rgba(255, 182, 193, 0.3)'
        }}>
          {entries.map(([number, letter], index) => (
            <Typography key={index} sx={{ 
              fontWeight: 'bold',
              backgroundColor: messageLetters.has(letter) ? 'rgba(255, 182, 193, 0.3)' : 'transparent',
              padding: '4px 12px',
              borderRadius: '8px',
              border: messageLetters.has(letter) ? '1px dashed #FFB6C1' : 'none',
              color: theme.textColor
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
      bgcolor: theme.colors.background,
      '@media print': {
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: '24px',
        boxSizing: 'border-box'
      }
    }}>
      <Box sx={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {settings.includeCodeBreaker && (
          <Box 
            sx={{ 
              mb: 3,
              p: 2,
              border: '2px dashed #ff9800',
              borderRadius: 1,
              bgcolor: 'rgba(255, 152, 0, 0.15)',
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
        
        <Typography variant="h4" align="center" sx={{
          fontFamily: theme.font.title,
          color: theme.textColor,
          fontWeight: 'bold',
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}>
          <span role="img" aria-label="star">⭐</span>
          {settings.title}
          <span role="img" aria-label="star">⭐</span>
        </Typography>

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          mb: 4
        }}>
          <span role="img" aria-label="cat" style={{ fontSize: '1.5em' }}>🐱</span>
          <Typography 
            variant="subtitle1"
            sx={{
              fontFamily: theme.font.title,
              color: theme.textColor,
              bgcolor: 'rgba(25, 118, 210, 0.08)',
              px: 2,
              py: 0.5,
              borderRadius: 2,
              display: 'inline-block'
            }}
          >
            Let's solve some math!
          </Typography>
          <span role="img" aria-label="sparkles" style={{ fontSize: '1.5em' }}>✨</span>
        </Box>

        <Grid container spacing={3} sx={{
          '@media print': {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
            width: '100%'
          }
        }}>
          <Grid item xs={12} md={6} sx={{
            '@media print': {
              width: '100%',
              maxWidth: '100%',
              flexBasis: '100%',
              padding: '0 !important'
            }
          }}>
            {problems.slice(0, Math.ceil(problems.length / 2)).map((problem, index) => (
              <Box 
                key={index}
                sx={{ 
                  p: 2,
                  mb: 2,
                  '@media print': {
                    pageBreakInside: 'avoid'
                  }
                }}
              >
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: theme.font.problems,
                      color: theme.textColor,
                      fontSize: '1.2em',
                      flex: '0 0 auto'
                    }}
                  >
                    {problem.firstNum} {problem.operation} {problem.secondNum} =
                  </Typography>
                  <Box 
                    sx={{ 
                      flex: 1,
                      position: 'relative',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'flex-end'
                    }} 
                  >
                    <Box sx={{ 
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      borderBottom: `1px solid ${theme.textColor}`
                    }} />
                    {settings.includeCodeBreaker && (
                      <Typography 
                        sx={{ 
                          position: 'absolute',
                          top: '0',
                          right: '8px',
                          color: '#1565c0',
                          fontSize: '0.9em',
                          fontFamily: theme.font.problems,
                          bgcolor: 'rgba(25, 118, 210, 0.12)',
                          px: 1.5,
                          py: 0.25,
                          borderRadius: 1,
                          border: '1px dashed #1565c0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          whiteSpace: 'nowrap',
                          height: 'fit-content'
                        }}
                      >
                        <span style={{ 
                          fontSize: '0.85em', 
                          opacity: 0.9,
                          fontWeight: 'bold'
                        }}>
                          ANS:
                        </span>
                        {problem.answer}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Grid>
          <Grid item xs={12} md={6} sx={{
            '@media print': {
              width: '100%',
              maxWidth: '100%',
              flexBasis: '100%',
              padding: '0 !important'
            }
          }}>
            {problems.slice(Math.ceil(problems.length / 2)).map((problem, index) => (
              <Box 
                key={index}
                sx={{ 
                  p: 2,
                  mb: 2,
                  '@media print': {
                    pageBreakInside: 'avoid'
                  }
                }}
              >
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: theme.font.problems,
                      color: theme.textColor,
                      fontSize: '1.2em',
                      flex: '0 0 auto'
                    }}
                  >
                    {problem.firstNum} {problem.operation} {problem.secondNum} =
                  </Typography>
                  <Box 
                    sx={{ 
                      flex: 1,
                      position: 'relative',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'flex-end'
                    }} 
                  >
                    <Box sx={{ 
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      borderBottom: `1px solid ${theme.textColor}`
                    }} />
                    {settings.includeCodeBreaker && (
                      <Typography 
                        sx={{ 
                          position: 'absolute',
                          top: '0',
                          right: '8px',
                          color: '#1565c0',
                          fontSize: '0.9em',
                          fontFamily: theme.font.problems,
                          bgcolor: 'rgba(25, 118, 210, 0.12)',
                          px: 1.5,
                          py: 0.25,
                          borderRadius: 1,
                          border: '1px dashed #1565c0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          whiteSpace: 'nowrap',
                          height: 'fit-content'
                        }}
                      >
                        <span style={{ 
                          fontSize: '0.85em', 
                          opacity: 0.9,
                          fontWeight: 'bold'
                        }}>
                          ANS:
                        </span>
                        {problem.answer}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Grid>
        </Grid>

        {renderSecretMessage()}
        {renderNumberKey()}
      </Box>
    </Box>
  );
};

export default Worksheet; 