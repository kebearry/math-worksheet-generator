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
  const letterToNumber = problems.letterToNumber || {};

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
    if (!problems.length) return null;

    // Check current theme
    const isMinecraftTheme = settings.theme === 'minecraft';
    const isSuperheroTheme = settings.theme === 'superhero';
    const isDinosaurTheme = settings.theme === 'dinosaur';
    const isCandylandTheme = settings.theme === 'candyland';

    if (isMinecraftTheme) {
      return (
        <Box sx={{
          backgroundColor: '#2F2F2F',
          border: '3px solid #373737',
          borderRadius: '0px',
          padding: '16px',
          boxShadow: 'inset -2px -4px #0006, inset 2px 2px #ffffff40',
          position: 'relative',
          marginBottom: '24px',
          mt: 4
        }}>
          <Typography sx={{
            color: '#FFFFFF',
            fontFamily: '"Minecraft", monospace',
            fontSize: '20px',
            marginBottom: '16px',
            textShadow: '2px 2px #000000',
            fontWeight: 'bold',
            textAlign: 'left'
          }}>
            NUMBER KEY:
          </Typography>
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'flex-start'
          }}>
            {Object.entries(letterToNumber).map(([letter, number]) => (
              <Box
                key={letter}
                sx={{
                  backgroundColor: '#727272',
                  border: '2px solid #373737',
                  borderRadius: '0px',
                  padding: '8px 12px',
                  color: '#FFFFFF',
                  fontFamily: '"Minecraft", monospace',
                  fontSize: '16px',
                  boxShadow: 'inset -2px -4px #0006, inset 2px 2px #ffffff40',
                  cursor: 'pointer',
                  transition: 'all 0.1s ease',
                  minWidth: '60px',
                  textAlign: 'center',
                  position: 'relative',
                  '&:hover': {
                    backgroundColor: '#8B8B8B',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {`${number}=${letter}`}
              </Box>
            ))}
          </Box>
        </Box>
      );
    }

    if (isSuperheroTheme) {
      return (
        <Box sx={{ 
          mt: 4,
          backgroundColor: '#1a237e',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(33, 150, 243, 0.4)',
          border: '3px solid #90caf9',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 30%, rgba(33, 150, 243, 0.4) 0%, transparent 70%)',
            pointerEvents: 'none'
          }
        }}>
          <Typography sx={{ 
            color: '#ffffff',
            fontFamily: "'Bangers', cursive",
            fontSize: '28px',
            textAlign: 'center',
            mb: 3,
            textShadow: '2px 2px 0 #1565c0, -2px -2px 0 #1565c0, 2px -2px 0 #1565c0, -2px 2px 0 #1565c0',
            letterSpacing: '2px'
          }}>
            SECRET CODE KEY
          </Typography>
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center'
          }}>
            {Object.entries(letterToNumber).map(([letter, number]) => (
              <Box
                key={letter}
                sx={{
                  backgroundColor: '#ff5252',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontFamily: "'Bangers', cursive",
                  fontSize: '20px',
                  letterSpacing: '1px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  transform: 'rotate(-2deg)',
                  transition: 'all 0.2s ease',
                  border: '2px solid #ffffff',
                  position: 'relative',
                  '&:hover': {
                    transform: 'rotate(2deg) scale(1.05)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.4)'
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '2px',
                    left: '2px',
                    right: '2px',
                    bottom: '2px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '4px',
                    pointerEvents: 'none'
                  }
                }}
              >
                {`${number}=${letter}`}
              </Box>
            ))}
          </Box>
        </Box>
      );
    }

    if (isDinosaurTheme) {
      return (
        <Box sx={{ 
          mt: 4,
          backgroundColor: '#2E7D32',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(67, 160, 71, 0.4)',
          border: '4px solid #81C784',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(129, 199, 132, 0.1) 10px,
                rgba(129, 199, 132, 0.1) 20px
              )
            `,
            pointerEvents: 'none'
          }
        }}>
          <Typography sx={{ 
            color: '#FFFFFF',
            fontFamily: "'Fredoka One', cursive",
            fontSize: '28px',
            textAlign: 'center',
            mb: 3,
            textShadow: '2px 2px 0 #1B5E20',
            letterSpacing: '1px',
            position: 'relative'
          }}>
            🦖 NUMBER KEY 🦕
          </Typography>
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center'
          }}>
            {Object.entries(letterToNumber).map(([letter, number]) => (
              <Box
                key={letter}
                sx={{
                  backgroundColor: '#A5D6A7',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  color: '#1B5E20',
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: '18px',
                  letterSpacing: '1px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                  border: '2px solid #388E3C',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  transform: 'rotate(1deg)',
                  '&:nth-of-type(2n)': {
                    transform: 'rotate(-1deg)',
                    backgroundColor: '#81C784'
                  },
                  '&:nth-of-type(3n)': {
                    transform: 'rotate(2deg)',
                    backgroundColor: '#C8E6C9'
                  },
                  '&:hover': {
                    transform: 'scale(1.05) rotate(0deg)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.3)'
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '2px',
                    left: '2px',
                    right: '2px',
                    bottom: '2px',
                    border: '1px dashed rgba(27, 94, 32, 0.3)',
                    borderRadius: '6px',
                    pointerEvents: 'none'
                  }
                }}
              >
                {`${number}=${letter}`}
              </Box>
            ))}
          </Box>
        </Box>
      );
    }

    if (isCandylandTheme) {
      return (
        <Box sx={{ 
          mt: 4,
          background: '#FFE5EE',
          borderRadius: '30px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(255, 105, 180, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 182, 193, 0.2) 10px, rgba(255, 182, 193, 0.2) 20px)',
            pointerEvents: 'none'
          }
        }}>
          <Typography sx={{ 
            color: '#FF69B4',
            fontFamily: "'Comic Sans MS', cursive",
            fontSize: '24px',
            textAlign: 'center',
            mb: 2,
            textShadow: '2px 2px 0px white',
            letterSpacing: '1px',
            position: 'relative',
            fontWeight: 'bold'
          }}>
            🍭 Number Key 🍬
          </Typography>
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
            padding: '8px'
          }}>
            {Object.entries(letterToNumber).map(([letter, number], index) => (
              <Box
                key={letter}
                sx={{
                  backgroundColor: 'white',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  color: '#FF69B4',
                  fontFamily: "'Comic Sans MS', cursive",
                  fontSize: '16px',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  boxShadow: '3px 3px 0px #FFB6C1',
                  border: '2px solid #FFB6C1',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '4px 4px 0px #FFB6C1'
                  }
                }}
              >
                {`${number}=${letter}`}
              </Box>
            ))}
          </Box>
          <Box sx={{
            position: 'absolute',
            top: -10,
            left: -10,
            right: -10,
            height: '20px',
            background: 'repeating-linear-gradient(90deg, #FFB6C1, #FFB6C1 20px, transparent 20px, transparent 40px)'
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: -10,
            left: -10,
            right: -10,
            height: '20px',
            background: 'repeating-linear-gradient(90deg, #FFB6C1, #FFB6C1 20px, transparent 20px, transparent 40px)'
          }} />
        </Box>
      );
    }

    // Original theme-specific styling for other themes
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
          {Object.entries(letterToNumber).map(([letter, number], index) => (
            <Typography key={index} sx={{ 
              fontWeight: 'bold',
              backgroundColor: 'rgba(255, 182, 193, 0.3)',
              padding: '4px 12px',
              borderRadius: '8px',
              border: '1px dashed #FFB6C1',
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