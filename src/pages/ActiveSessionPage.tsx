import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function ActiveSessionPage() {
  const { sessionId } = useParams();
  return <Typography variant="h5">Active Session: {sessionId}</Typography>;
}
