import React, { useState } from 'react';
import {
  Box,
  Typography,
  Pagination,
  Stack
} from '@mui/material';
import ClimbingLogCard from './ClimbingLogCard';

export default function ClimbingLogNew({
  scores,
  onDelete
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(scores.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentEntries = scores.slice(startIndex, endIndex);

  // Pagination info
  const showingStart = scores.length > 0 ? startIndex + 1 : 0;
  const showingEnd = Math.min(endIndex, scores.length);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {showingStart}–{showingEnd} of {scores.length} climbs
      </Typography>
      
      <Stack spacing={2} sx={{ mb: 3 }}>
        {currentEntries.map((score) => (
          <ClimbingLogCard
            key={score.id}
            onDelete={onDelete}
            score={score}
          />
        ))}
      </Stack>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </>
  );
}
