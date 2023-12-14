import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

export default function Home() {
  const handleAccessDenied = () => {
    Swal.fire({
      icon: 'error',
      title: 'Access Denied',
      text: 'You must log in to access this page.',
    });
  };
  const { currentUser} = useSelector((state) => state.user);
  
  return (
    <Container>
    <Box>
      <Typography>
        Welcome
      </Typography>
      {currentUser ? <Link to={'/mony'}>Buy Now</Link> : <button onClick={handleAccessDenied}>Buy Now</button>}
    </Box>
    </Container>
  )
}
