import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loader() {
  return (
    <div style={{ display: 'flex'  , width:"100%" ,alignItems:"center",justifyContent:"center",padding:"200px"}}>
      <CircularProgress />
    </div>
  );
}