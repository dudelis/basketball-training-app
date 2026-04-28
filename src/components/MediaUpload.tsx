import { useRef } from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

type Props = {
  label: string;
  accept: string;
  multiple?: boolean;
  existingUrls?: string[];
  onUpload: (files: File[]) => void;
  onRemoveExisting: (url: string) => void;
};

function getFileName(url: string): string {
  const decoded = decodeURIComponent(url.split('?')[0]);
  return decoded.split('/').pop() ?? 'file';
}

export default function MediaUpload({
  label,
  accept,
  multiple = false,
  existingUrls = [],
  onUpload,
  onRemoveExisting,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) {
      onUpload(Array.from(e.target.files));
      e.target.value = '';
    }
  }

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
        {label}
      </Typography>
      {existingUrls.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {existingUrls.map((url) => (
            <Chip
              key={url}
              label={getFileName(url)}
              onDelete={() => onRemoveExisting(url)}
              size="small"
              sx={{ maxWidth: 220 }}
            />
          ))}
        </Box>
      )}
      <Button
        variant="outlined"
        size="small"
        startIcon={<UploadIcon />}
        onClick={() => inputRef.current?.click()}
      >
        Upload {label}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </Box>
  );
}
