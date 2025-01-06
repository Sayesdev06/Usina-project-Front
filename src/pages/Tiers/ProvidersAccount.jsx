import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import AddTiers from './AddTiers';
import { useSnackbar } from 'notistack';
import { connect } from "react-redux";
import * as actionCreator from "../../actions";
import ListProviders from './ListProviders';
import { Reload } from 'mdi-material-ui';
import CachedIcon from '@mui/icons-material/Cached';
import Loader from '../../components/loader';


const ProvidersAccount = (props) => {


  const [attributeTiersSearch, setAttributeTiersSearch] = useState({
    fullname: "",
    country: "",
    email: "",
    type: '',
  })

    const [addUser,setAddUser] = useState(false)
    const [loading,setLoading] = useState(false)


  const handleChangeAttributeTiersSearch = prop => event => {
    setAttributeTiersSearch({ ...attributeTiersSearch, [prop]: event.target.value })
  }

  useEffect(() => {
    setLoading(true)
    getALLProviders()
  }, [])

  const getALLProviders = () => {
    const data = {
      ...attributeTiersSearch,
      setLoading
    }
    props.getAllProvider(data)
  }

  const onReload = () => {

    setAttributeTiersSearch({
      fullname: "",
      country: "",
      email: "",
      type: '',
    })
    const data = {
      fullname: "",
      country: "",
      email: "",
      type: '',
    }


    props.getAllProvider(data)

    
}

const setAddUserToFalse = ()=>{
  setAddUser(false)
}


  return (
    <>
    {loading?<Loader/>:
    <>
    <Typography className='color-title' sx={{ fontSize: "1.1rem", fontWeight: '600', mr: 3 ,mb:3}} >Gestion des comptes fournisseur</Typography>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>

          <Grid container sx={{ p:2 }} spacing={3} >
            <Grid item xs={12} md={2} sx={{display:"flex",alignItems:"center",gap:"5px" ,whiteSpace:"nowrap",paddingTop:"0px"}}>
            Nom :
              <TextField
                size='small'
                fullWidth

                value={attributeTiersSearch.fullname}
                onChange={handleChangeAttributeTiersSearch('fullname')}
              />
            </Grid>
            <Grid item xs={12} md={2} sx={{display:"flex",alignItems:"center",gap:"5px" ,whiteSpace:"nowrap",paddingTop:"0px"}}>
            Email :
              <TextField
                size='small'
                fullWidth

                value={attributeTiersSearch.email}
                onChange={handleChangeAttributeTiersSearch('email')}
              />
            </Grid>
            <Grid item xs={12} md={2} sx={{display:"flex",alignItems:"center",gap:"5px" ,whiteSpace:"nowrap",paddingTop:"0px"}}>
                Pays :
              <TextField
                size='small'

                fullWidth
                value={attributeTiersSearch.country}
                onChange={handleChangeAttributeTiersSearch('country')}
              />
            </Grid>
            <Grid item xs={12} md={2} sx={{display:"flex",alignItems:"center",gap:"5px" ,whiteSpace:"nowrap",paddingTop:"0px"}}>
              Type :
              <FormControl size="small" fullWidth >
                <Select
                  defaultValue=''
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                  value={attributeTiersSearch.type}
                  onChange={handleChangeAttributeTiersSearch('type')}>
                  <MenuItem value="PASSAGER">Passager</MenuItem>
                  <MenuItem value="GRAND COMPTE">Grand compte</MenuItem>
                  <MenuItem value="PME">PME</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: "end" }} >
              <Button  onClick={() => getALLProviders()} sx={{ color: "black", backgroundColor: "#9155fd !important" , marginRight:"30px"}} >
                Chercher
              </Button>
                <CachedIcon className='color-orange pointer'  onClick={() => onReload()}/>
            </Grid>

          </Grid>
        </Paper>
      </Box>
      <Box sx={{ width: '100%', mt: 3}}>
      <Grid container sx={{justifyContent: "space-between",mb:2 }} >
                        <Grid item className='flex-Box' >
                            <Typography className='color-title' sx={{ fontSize: "1.1rem", fontWeight: '600', mr: 3 }} >Liste des fournisseur</Typography>
                            <Box className='number-listing' > <Typography className='color-title' sx={{ fontSize: "0.75rem", fontWeight: '600' }} > {props.arrayAllProvider?props.arrayAllProvider.length:'0'} Fournisseurs</Typography>  </Box>
                        </Grid>
                        <Grid item sx={{ textAlign: "end" }} >
                        <button 
                        onClick={() => setAddUser(!addUser)}
                        className="btn- bg-primary py-2 px-3 m-1 rounded-lg color-black">
          + Ajouter
                </button>
                            

                        </Grid>
                    </Grid>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <ListProviders source={"providerComponent"} addUser={addUser}  setAddUserToFalse={setAddUserToFalse} />
        </Paper>
      </Box>
      </>}


    </>
  );
}

const mapStateToProps = (state) => {
  return {
    arrayAllProvider: state.userServices.arrayAllProvider
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    getAllProvider: (data) => dispatch(actionCreator.getAllProvider(data)),
    deleteProvider: (data) => dispatch(actionCreator.deleteProvider(data)),

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProvidersAccount)

