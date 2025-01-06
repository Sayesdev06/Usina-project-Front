import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Typography, Grid, TextField, Avatar, FormControl, Select, MenuItem, } from '@mui/material';
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline '
import { useState } from 'react';
import { connect } from "react-redux";
import * as actionCreator from "../../actions";
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon sx={{ cursor: "pointer" }} />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

const AddTiers = (props) => {
    const { enqueueSnackbar } = useSnackbar();

    const { editTiers, attributeTiers, handleChangeAttributeTiers, afterSave, showDetails, arrayAllTva } = props


    const addNewTiers = () => {
        const data = {
            ...attributeTiers,
            onCloseModalAddTiers: () => {
                props.onCloseModalAddTiers()
            },
            afterSave: () => {
                afterSave()

            },
            getALLList: () => {
                props.getALLList()
            },
            handleClickVariant: (msg, val) => {
                let variant = val
                enqueueSnackbar(msg, { variant });
            }
        }

        if (attributeTiers.fullname === "" ||
            attributeTiers.type === "" ||
            attributeTiers.tvaNumber === "" ||
            attributeTiers.registrationNumber === "" ||
            attributeTiers.address === "" ||
            attributeTiers.city === "" ||
            attributeTiers.country === "" ||
            attributeTiers.phoneNumber === "" ||
            attributeTiers.contactPhoneNumber === "" ||
            attributeTiers.email === "" ||
            attributeTiers.contactEmail === "" ||
            attributeTiers.tvaId === "") {
            let variant = "warning"
            enqueueSnackbar("Tous les champs sont obligatoire!", { variant });
        } else
            props.label === "client" ? props.createClient(data) : props.createProvider(data)

    }
    const onEditTiers = () => {
        const data = {
            ...attributeTiers,
            onCloseModalAddTiers: () => {
                props.onCloseModalAddTiers()
            },
            afterSave: () => {
                afterSave()

            },
            getALLList: () => {
                props.getALLList()
            },
            handleClickVariant: (msg, val) => {
                let variant = val
                enqueueSnackbar(msg, { variant });
            }
        }
        if (attributeTiers.fullname === "" ||
            attributeTiers.type === "" ||
            attributeTiers.tvaNumber === "" ||
            attributeTiers.registrationNumber === "" ||
            attributeTiers.address === "" ||
            attributeTiers.city === "" ||
            attributeTiers.country === "" ||
            attributeTiers.phoneNumber === "" ||
            attributeTiers.contactPhoneNumber === "" ||
            attributeTiers.email === "" ||
            attributeTiers.contactEmail === "" ||
            attributeTiers.tvaId === "") {
            let variant = "warning"
            enqueueSnackbar("Tous les champs sont obligatoire!", { variant });
        } else
            props.label === "client" ? props.updateClient(data) : props.updateProvider(data)

    }

    useEffect(() => {
        const data = {
            name: "",
        }
        props.getAllTva(data)
    }, [])


    return (
        <div>
            <BootstrapDialog
                fullWidth
                maxWidth={"sm"}
                onClose={() => props.onCloseModalAddTiers()}
                aria-labelledby="customized-dialog-title"
                open={props.openModalAddTiers}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={() => props.onCloseModalAddTiers()}>
                    <Avatar sx={{ backgroundColor: "#9155fd1f !important", color: "#9155fd", mr: 2 }} >
                        <AccountPlusOutline sx={{}} />
                    </Avatar>


                    {props.title}
                </BootstrapDialogTitle>
                <DialogContent dividers>

                    <Grid container spacing={3} >

                        <Grid item xs={12} md={6} >
                            <Typography className='color-title' variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                                Nom du {props.label}
                            </Typography>
                            <TextField
                                size='small'
                                fullWidth
                                value={attributeTiers.fullname}
                                onChange={handleChangeAttributeTiers('fullname')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography className='color-title' variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                                Type du {props.label}
                            </Typography>
                            <FormControl size="small" fullWidth >
                                <Select
                                    defaultValue=''
                                    id='form-layouts-separator-select'
                                    labelId='form-layouts-separator-select-label'
                                    value={attributeTiers.type}
                                    onChange={handleChangeAttributeTiers('type')}>
                                    <MenuItem value="PASSAGER">Passager</MenuItem>
                                    <MenuItem value="GRAND COMPTE">Grand compte</MenuItem>
                                    <MenuItem value="PME">PME</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}  >
                            <Typography className='color-title' variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                                Numéro du  TVA
                            </Typography>
                            <TextField
                                size='small'
                                fullWidth
                                value={attributeTiers.tvaNumber}
                                onChange={handleChangeAttributeTiers('tvaNumber')}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography className='color-title' variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                                Tva
                            </Typography>
                            <FormControl size="small" fullWidth >
                                <Select
                                    defaultValue=''
                                    id='form-layouts-separator-select'
                                    labelId='form-layouts-separator-select-label'
                                    value={attributeTiers.tvaId}
                                    onChange={handleChangeAttributeTiers('tvaId')}>
                                    {arrayAllTva.map((tva, key) =>
                                        <MenuItem value={tva.id} key={key} >{tva.name}: {tva.percentage} %</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}  >
                            <Typography className='color-title' variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                                Matricule fiscal
                            </Typography>
                            <TextField
                                size='small'
                                fullWidth
                                value={attributeTiers.registrationNumber}
                                onChange={handleChangeAttributeTiers('registrationNumber')}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} >
                            <Typography className='color-title' variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                                Pays
                            </Typography>
                            <TextField
                                size='small'
                                fullWidth
                                value={attributeTiers.country}
                                onChange={handleChangeAttributeTiers('country')}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} >
                            <Typography className='color-title' variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                                Ville
                            </Typography>
                            <TextField
                                size='small'
                                fullWidth
                                value={attributeTiers.city}
                                onChange={handleChangeAttributeTiers('city')}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} >
                            <Typography className='color-title' variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                                Adresse
                            </Typography>
                            <TextField
                                size='small'
                                fullWidth
                                value={attributeTiers.address}
                                onChange={handleChangeAttributeTiers('address')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}  >
                            <Typography className='color-title' variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                                Numéro de téléphone
                            </Typography>
                            <TextField
                                size='small'
                                fullWidth
                                value={attributeTiers.phoneNumber}
                                onChange={handleChangeAttributeTiers('phoneNumber')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}  >
                            <Typography className='color-title' variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                                Numéro de téléphone du contact
                            </Typography>
                            <TextField
                                size='small'
                                fullWidth
                                value={attributeTiers.contactPhoneNumber}
                                onChange={handleChangeAttributeTiers('contactPhoneNumber')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} >
                            <Typography className='color-title' variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                                Adresse e-mail
                            </Typography>
                            <TextField
                                size='small'
                                fullWidth
                                value={attributeTiers.email}
                                onChange={handleChangeAttributeTiers('email')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} >
                            <Typography className='color-title' variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                                Adresse e-mail de contact
                            </Typography>
                            <TextField
                                size='small'
                                fullWidth
                                value={attributeTiers.contactEmail}
                                onChange={handleChangeAttributeTiers('contactEmail')}
                            />
                        </Grid>
                    </Grid>

                </DialogContent>
                <DialogActions>
                    {editTiers ?
                        <Button  onClick={() => onEditTiers()} sx={{ color: "white", backgroundColor: "#9155fd !important" }} >
                            Modifier
                        </Button> : editTiers === false && showDetails === false ?
                            <Button  onClick={() => addNewTiers()} sx={{ color: "white", backgroundColor: "#9155fd !important" }} >
                                Ajouter
                            </Button> : null}
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        userRole: state.auth.userRole,
        allPermession: state.userServices.allPermession,
        arrayAllTva: state.userServices.arrayAllTva

    };
};

const mapDispatchToProps = (dispatch) => {
    return {

        createClient: (data) => dispatch(actionCreator.createClient(data)),
        createProvider: (data) => dispatch(actionCreator.createProvider(data)),
        updateClient: (data) => dispatch(actionCreator.updateClient(data)),
        updateProvider: (data) => dispatch(actionCreator.updateProvider(data)),
        getAllTva: (data) => dispatch(actionCreator.getAllTva(data)),

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTiers)