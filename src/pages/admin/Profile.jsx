import React, { useState } from "react";
// Icons

import { Link } from "react-router-dom";
import { Grid, Box, Typography, TextField, Button, Paper, Divider } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings';

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import Phone from 'mdi-material-ui/Phone'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import MessageOutline from 'mdi-material-ui/MessageOutline'
import ApartmentIcon from '@mui/icons-material/Apartment';
import PlaceIcon from '@mui/icons-material/Place';

const Profile = () => {

  return (
    <>
      {/*
         
          <Typography sx={{ color: "#72819b", fontSize: '0 .9rem', mb: 2 }} >Ville </Typography>
          <Typography sx={{ color: "#72819b", fontSize: '0.9rem', mb: 2 }}  >Numéro TVA </Typography>
          <Typography sx={{ color: "#72819b", fontSize: '0.9rem', mb: 2 }}  >Matricule Fiscale  </Typography> */}
      <Card>
        <Box sx={{display:"flex", alignItems:"center" , ml:4}} >
          <SettingsIcon />
          <CardHeader title='Configuration-Société ' titleTypographyProps={{ variant: 'h6' }} />
        </Box>

        <Divider sx={{ color: "black", width: '100%', mt: 2, mb: 5 }} />
        <CardContent>
          <form onSubmit={e => e.preventDefault()}>
            <Grid container spacing={5}>
              <Grid item xs={12} md={4}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Account Details
              </Typography>
                <TextField
                  fullWidth
                  label='Nom de la société'
                  placeholder='Nom de la société'
                  InputProps={{
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type='email'
                  label='Email'
                  placeholder='exemple@gmail.com'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <EmailOutline />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type='number'
                  inputProps={{ min: 0}}
                  label='Numéro de téléphone '
                  placeholder='+1-123-456-8790'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Phone />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label='Adresse'
                  placeholder='Adresse'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <AccountOutline />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label='Pays'
                  placeholder='Pays'
                  InputProps={{
                    
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label='Ville'
                  placeholder='Ville'
                  InputProps={{
                    
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label='TVA'
                  placeholder='TVA'
                  InputProps={{
                 
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label='Matricule Fiscale'
                  placeholder='Matricule Fiscale'
                  InputProps={{
                    
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type='submit' variant='contained' size='large'>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  )
};

export default Profile;
