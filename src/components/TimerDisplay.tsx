import { Box, Typography, Button, Paper } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { useTimer } from '../hooks/useTimer';

type TimerDisplayProps = {
  initialSeconds: number;
  onComplete: (actualSeconds: number) => void;
};

function formatTime(seconds: number): string {
  const m = Math.floor(Math.max(0, seconds) / 60).toString().padStart(2, '0');
  const s = (Math.max(0, seconds) % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function TimerDisplay({ initialSeconds, onComplete }: TimerDisplayProps) {
  const { state, start, pause, reset, adjust } = useTimer(initialSeconds);

  function getTimerColor(): string {
    if (state.status === 'finished') return 'success.main';
    if (state.status === 'running' && state.remainingSeconds < 10) return 'error.main';
    if (state.status === 'paused') return 'warning.main';
    if (state.status === 'running') return 'success.main';
    return 'text.primary';
  }

  const isFinished = state.status === 'finished';
  const isRunning = state.status === 'running';
  const isPaused = state.status === 'paused';
  const isIdle = state.status === 'idle';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      {/* Countdown display */}
      <Typography
        sx={{
          fontSize: { xs: '5rem', sm: '6rem' },
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          fontFamily: 'monospace',
          lineHeight: 1,
          color: getTimerColor(),
          transition: 'color 0.3s',
        }}
      >
        {formatTime(state.remainingSeconds)}
      </Typography>

      {/* Adjust buttons */}
      {!isFinished && (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {([-300, -60, 60, 300] as const).map((delta) => (
            <Button
              key={delta}
              size="small"
              variant="outlined"
              onClick={() => adjust(delta)}
              sx={{ minWidth: 56, fontSize: '0.7rem' }}
            >
              {delta > 0 ? '+' : ''}{delta / 60} min
            </Button>
          ))}
        </Box>
      )}

      {/* Control buttons */}
      {!isFinished && (
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {(isIdle || isPaused) && (
            <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={start}>
              {isPaused ? 'Resume' : 'Start'}
            </Button>
          )}
          {isRunning && (
            <Button variant="contained" color="warning" startIcon={<PauseIcon />} onClick={pause}>
              Pause
            </Button>
          )}
          <Button variant="outlined" startIcon={<ReplayIcon />} onClick={reset}>
            Reset
          </Button>
        </Box>
      )}

      {/* Completion banner */}
      {isFinished && (
        <Paper
          elevation={0}
          sx={{ p: 2, bgcolor: 'success.light', borderRadius: 2, textAlign: 'center', width: '100%' }}
        >
          <Typography variant="h6" sx={{ color: 'success.contrastText', mb: 2 }}>
            ✅ Time's up!
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => onComplete(state.durationSeconds)}
            >
              Mark as Done
            </Button>
            <Button
              variant="outlined"
              startIcon={<SkipNextIcon />}
              onClick={() => onComplete(0)}
              sx={{ color: 'success.contrastText', borderColor: 'success.contrastText' }}
            >
              Skip
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
