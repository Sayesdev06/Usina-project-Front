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
import PencilOutline from 'mdi-material-ui/PencilOutline'

import { connect } from "react-redux";
import * as actionCreator from "../../actions";
import { useEffect } from "react";
import { useSnackbar } from 'notistack';

import { TextareaAutosize } from '@mui/base';
import Loader from "../../components/loader";
import Cookies from 'js-cookie'



const SetupCompany = (props) => {
  const { message, } = props

  const { enqueueSnackbar } = useSnackbar();

 const [hasCompany, setHasCompany] = useState(false)
  const [loading, setLoading] = useState(false)

  const [attributeCompany, setAttributeCompany] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    email: "",
    phoneNumber: "",
    tvaNumber: "",
    registrationNumber: ""
  })

  // *************************************************
  useEffect(() => {

      setLoading(true)
      getAllDetailsCompany()
  }, [])
  // *************************************************

  const handleChangeAttributeCompany = prop => event => {
    setAttributeCompany({ ...attributeCompany, [prop]: event.target.value })
  }


  // *************************************************

  const getAllDetailsCompany = () => {
    const data = {
      attributeCompany: (value) => setAttributeCompany(value),
      setLoading,
      setHasCompany
    }
    props.getDetailsCompany(data)
  }
  // *************************************************

  const configCompany = (e) => {
    e.preventDefault()
    const data = {
      ...attributeCompany,
      getAllDetailsCompany: () => {
        getAllDetailsCompany()
      },
      // editConfigCompany: (value) => setEditConfigCompany(value),
      handleClickVariant: (msg, val) => {
        let variant = val
        enqueueSnackbar(msg, { variant });
      }
    }
    // props.createCompany(data)
   hasCompany ? props.EditCompany(data) : props.createCompany(data)
  }
  // *************************************************

  return (
    <>
    {loading?<Loader/>:

    

    <>
    <div className="d-flex justify-content-between mb-5">

    <Typography sx={{color: "#000", fontWeight: "600" }}>
Configuration de votre société  :
        </Typography>

            {/* <button
                onClick={() => setEditConfigCompany(true)} 
                className="orange-button"
              >
                Modifier
              </button> */}
    </div>

      <Card>

            



        <CardContent>
          <form onSubmit={e => configCompany(e)}>
            <Grid container spacing={5}>
              <Grid item xs={12} md={4}>
                <Typography variant='body2' className="color-title-1" sx={{ fontWeight: 600, mb: 2 }}>
                Nom commercial <span style={{ color: "red" }} >*</span>
                </Typography>
                <TextField
                  fullWidth
                  value={attributeCompany.name}
                  // disabled={message === null && editConfigCompany === false ? true : false}
                  className="input-setup-company"
                  onChange={handleChangeAttributeCompany("name")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant='body2' className="color-title-1" sx={{ fontWeight: 600, mb: 2 }}>
                E-mail de contact : <span style={{ color: "red" }} >*</span>
                </Typography>
                <TextField
                  fullWidth
                  type='email'
                  value={attributeCompany.email}
                  // disabled={message === null && editConfigCompany === false ? true : false}
                  className="input-setup-company"
                  onChange={handleChangeAttributeCompany("email")}
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
                <Typography variant='body2' className="color-title-1" sx={{ fontWeight: 600, mb: 2 }}>
                  Numéro du téléphone <span style={{ color: "red" }} >*</span>
                </Typography>
                <TextField
                  fullWidth
                  type='number'
                  placeholder='+216 73 000 000'
                  value={attributeCompany.phoneNumber}
                  // disabled={message === null && editConfigCompany === false ? true : false}
                  className="input-setup-company"
                  onChange={handleChangeAttributeCompany("phoneNumber")}
                  InputProps={{
                    min: 0,
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Phone />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant='body2' className="color-title-1" sx={{ fontWeight: 600, mb: 2 }}>
                  Pays <span style={{ color: "red" }} >*</span>
                </Typography>
                <TextField
                  fullWidth
                  // disabled={message === null && editConfigCompany === false ? true : false}
                  className="input-setup-company"
                  value={attributeCompany.country}
                  onChange={handleChangeAttributeCompany("country")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant='body2' className="color-title-1" sx={{ fontWeight: 600, mb: 2 }}>
                  Ville <span style={{ color: "red" }} >*</span>
                </Typography>
                <TextField
                  fullWidth
                  // disabled={message === null && editConfigCompany === false ? true : false}
                  className="input-setup-company"
                  value={attributeCompany.city}
                  onChange={handleChangeAttributeCompany("city")}
                />
              </Grid>
              <Grid item xs={12} md={4} sx={{ height:70}}>
                <Typography variant='body2' className="color-title-1" sx={{ fontWeight: 600, mb: 2 }}>
                  Adresse <span style={{ color: "red" }} >*</span>
                </Typography>
                <TextareaAutosize
                  fullWidth
                  minRows={5}
                  placeholder='Adresse'
                  value={attributeCompany.address}
                  // disabled={message === null && editConfigCompany === false ? true : false}
                  className="text-area-style"
                  onChange={handleChangeAttributeCompany("address")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant='body2' className="color-title-1" sx={{ fontWeight: 600, mb: 2 }}>
                Numéro de registre de commerce <span style={{ color: "red" }} >*</span>
                </Typography>
                <TextField
                  fullWidth
                  // disabled={message === null && editConfigCompany === false ? true : false}
                  className="input-setup-company"
                  value={attributeCompany.tvaNumber}
                  onChange={handleChangeAttributeCompany("tvaNumber")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant='body2' className="color-title-1" sx={{ fontWeight: 600, mb: 2 }}>
                  Matricule Fiscale <span style={{ color: "red" }} >*</span>
                </Typography>
                <TextField
                  fullWidth
                  // disabled={message === null && editConfigCompany === false ? true : false}
                  className="input-setup-company"
                  value={attributeCompany.registrationNumber}
                  onChange={handleChangeAttributeCompany("registrationNumber")}
                />
              </Grid>

            </Grid>
          
              <Grid item xs={12} sx={{ textAlign: "end" }} >
                <button type='submit' className="btn- bg-primary py-2 px-3 m-1 rounded-lg">
                  Valider
                </button>
              </Grid>
{/*         
            {editConfigCompany === true ? (
              <Grid item xs={12} sx={{ textAlign: "end" }} >
                <button type='submit' className="btn- bg-primary py-2 px-3 m-1 rounded-lg">
                Enregistrer
                </button>
              </Grid>
            ) : (null)} */}

          </form>
        </CardContent>
      </Card>
      </>}
    


    </>
  )
};

const mapStateToProps = (state) => {
  return {

    message: state.userServices.message,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    createCompany: (data) => dispatch(actionCreator.createCompany(data)),
    EditCompany: (data) => dispatch(actionCreator.EditCompany(data)),
    getDetailsCompany: (data) => dispatch(actionCreator.getDetailsCompany(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SetupCompany);
