import React, { useEffect, useState } from 'react'
import { Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography, Paper, InputAdornment, Divider, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, OutlinedInput, IconButton, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'

// import icons
import Laptop from 'mdi-material-ui/Laptop';
import EyeOutline from 'mdi-material-ui/EyeOutline';
import DeleteOutline from 'mdi-material-ui/DeleteOutline';
import PencilOutline from 'mdi-material-ui/PencilOutline';

import PlusCircleOutline from 'mdi-material-ui/PlusCircleOutline';
import AccountPlusOutline from "mdi-material-ui/AccountPlusOutline"
import { Close, EyeOffOutline, Reload, Magnify } from 'mdi-material-ui';
import { useSnackbar } from 'notistack';

import { connect } from "react-redux";
import * as actionCreator from "../../actions";
import DetailsUser from './DetailsUser';
import CachedIcon from '@mui/icons-material/Cached';
import Loader from '../../components/loader';

//  Gestion de stock ,Gestion des comptes tiers, Gestion des commande , Gestion des factures , Gestion des paiements .
// Vendeur, chef, responsable


const Users = (props) => {
    const { allPermession, arrayAllUsers, arrayAllPostes } = props


    const { enqueueSnackbar } = useSnackbar();

    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const [values, setValues] = useState({
        password: '',
        showPassword: false
    })
    const [firstName, setFirstName] = useState("")
    const [lastName, setlastName] = useState("")
    const [login, setLogin] = useState("")
    const [poste, setPoste] = useState("")
    // const [permissionIds, setPermissionIds] = useState([])
    const [editUser, seteditUser] = useState(false)
    const [loading, setLoading] = useState(false)
    const [idUser, setIdUser] = useState(null)
    // const [permissionArray, setPermissionArray] = useState([])
    const [attributeSearch, setAttributeSearch] = useState({
        firstName: "",
        poste: "",
        login: "",
        // permissionId: null
    })

    const handleChangeAttributeTiersSearch = prop => event => {
        setAttributeSearch({ ...attributeSearch, [prop]: event.target.value })
    }

    const handleChange = prop => event => {
        setValues({ ...values, [prop]: event.target.value })
    }

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword })
    }

    const handleMouseDownPassword = event => {
        event.preventDefault()
    }
    // ** States
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [openModalAddUser, setOpenModalAddUser] = useState(false)


    // ***********************************************************************

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    // ***********************************************************************

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    // ***********************************************************************

    const onOpenModalAddUser = () => {
        setOpenModalAddUser(!openModalAddUser)
        setIdUser(null)
        setFirstName('')
        setlastName('')
        setLogin('')
        setPoste('')
        setValues({ ...values, password: "" })
        // setPermissionIds([])
        seteditUser(false)
    }

    // ***********************************************************************
    useEffect(() => {
        setLoading(true)
        getAllUsers()
    }, [])

    const getAllUsers = () => {
        const data = {
            ...attributeSearch,
            setLoading
        }
        props.getAllUsers(data)
        
    }
    const addUser = () => {
        // setOpenModalAddUser(!openModalAddUser)
        const data = {
            firstName: firstName,
            lastName: lastName,
            login: login,
            password: values.password,
            poste: poste,
            // permissionIds: permissionIds,
            openModalAddUser: (value) => setOpenModalAddUser(value),
            getAllUsers: () => {
                getAllUsers()
            },

            afterSave: () => {
                setIdUser(null)
                setFirstName('')
                setlastName('')
                setLogin('')
                setPoste('')
                setValues({ ...values, password: "" })
                // setPermissionIds([])

            },
            handleClickVariant: (msg, val) => {
                let variant = val
                enqueueSnackbar(msg, { variant });
            }

        }
        const rgExp = /^[a-zA-Z]+(\d|.|\w)*@[a-zA-Z]+.[a-zA-Z]+.*[a-zA-Z]+$/;
        // const rgExp = /^[a-zA-Z0-9._]+@[a-z]+\.[a-z]{2-6}$/

        if (firstName === "" || lastName == "" || login == "" || values.password === "" || poste === "" 
           ) { // || permissionIds.length === 0
            let variant = "warning"
            enqueueSnackbar("Tous les champs sont obligatoire!", { variant });

        } else if (!rgExp.test(login)) {
            let variant = "error"
            enqueueSnackbar("Email non valide!", { variant });
        } else {
            props.createUser(data)

        }


    }

    // ***********************************************************************

    const toggleDrawer = (row) => {
        const anchor = "right"
        setFirstName(row.firstName)
        setlastName(row.lastName)
        setLogin(row.login)
        setPoste(row.poste)
        // setPermissionArray(row.permissions)
        setState({ ...state, [anchor]: true });

    };
    const toggleDrawerClose = () => (event) => {
        const anchor = "right"
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: false });
    };
    // ***********************************************************************
    // useEffect(() => {
    //     props.getAllPermession()
    // }, [])


    // const changePermesiion = (permession) => {
    //     if (permissionIds.includes(permession.id)) {

    //         setPermissionIds(permissionIds.filter(id => id !== permession.id))
    //     } else {
    //         setPermissionIds([...permissionIds, permession.id])
    //     }


    // }
    // ***********************************************************************

    const onOpenModalEditUser = (data) => {


        // const dataPermissionIds = data.permissions
        // let arrayOfIds = []
        // for (let i = 0; i < dataPermissionIds.length; i++) {
        //     const element = dataPermissionIds[i];
        //     arrayOfIds.push(element.id)
        // }

        setIdUser(data.id)
        setFirstName(data.firstName)
        setlastName(data.lastName)
        setLogin(data.login)
        setPoste(data.poste)
        setValues({ ...values, password: "" })
        // setPermissionIds(arrayOfIds)
        setOpenModalAddUser(true)
        seteditUser(true)
    }
    const onUpdateUser = () => {
        const data = {
            id: idUser,
            firstName: firstName,
            lastName: lastName,
            login: login,
            password: values.password,
            poste: poste,
            // permissionIds: permissionIds,
            afterSave: () => {

                setIdUser(null)
                setFirstName('')
                setlastName('')
                setLogin('')
                setPoste('')
                setValues({ ...values, password: "" })
                // setPermissionIds([])
                setOpenModalAddUser(false)
                seteditUser(false)
            },
            getAllUsers: () => {
                getAllUsers()
            },
            handleClickVariant: (msg, val) => {
                let variant = val
                enqueueSnackbar(msg, { variant });
            }
        }

        if (firstName === "" || lastName == "" || login == "" || poste === "") { //  || permissionIds.length === 0
            let variant = "warning"
            enqueueSnackbar("Tous les champs sont obligatoire!", { variant });

        } else {
            props.updateUser(data)
        }

    }

    const onDeletetUser = (row) => {
        const data = {
            id: row.id,
            getAllUsers: () => {
                getAllUsers()
            },
            handleClickVariant: (msg, val) => {
                let variant = val
                enqueueSnackbar(msg, { variant });
            }
        }


        props.deleteUser(data)
    }


    const onReload = () => {

        setAttributeSearch({
            firstName: "",
            poste: "",
            login: "",
            // permissionId: null
        })
        const data = {
            firstName: "",
            poste: "",
            login: "",
            // permissionId: null
        }
        props.getAllUsers(data)

        
    }



    return (
        <div>
            {loading? <Loader/>

            :<>
        <Typography className='color-title' sx={{ fontWeight: '600' }}>Gestion des utilisateurs </Typography>

        <Paper sx={{ width: '100%', mb: 2 }}>
        <Grid container sx={{ p: 2 }} >

        <Grid item xs={12} md={3} sx={{display:"flex",alignItems:"center",gap:"15px"}}>
        Nom et prénom : 
                            <TextField
                                
                                size='small'
                            
                                value={attributeSearch.firstName}
                                onChange={handleChangeAttributeTiersSearch('firstName')}

                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }} />

                        </Grid>
                        <Grid item xs={12} md={3} sx={{display:"flex",alignItems:"center",gap:"15px"}}>
                        Email :
                            <TextField
                                
                                size='small'
                               
                                value={attributeSearch.login}
                                onChange={handleChangeAttributeTiersSearch('login')}

                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 },width:'280px' }}

                            />
                        </Grid>
                        <Grid item xs={12} md={3} sx={{display:"flex",alignItems:"center",gap:"15px"}}>
                            Role :
                            <FormControl size="small" sx={{width:"250px"}}>
                                <Select
                                    onChange={handleChangeAttributeTiersSearch('poste')}
                                    defaultValue=''
                                    id='form-layouts-separator-select'
                                    labelId='form-layouts-separator-select-label' >
                        
                                    <MenuItem value="COMMERCIALE">COMMERCIALE</MenuItem>
                                    {/* <MenuItem value="ADMIN">Administrateur</MenuItem> */}
                                    <MenuItem value="MAGASINIER">MAGASINIER</MenuItem>
                                    <MenuItem value="COMPTABLE">COMPTABLE</MenuItem>
                                    <MenuItem value="RESPONSABLE DE PRODUCTION">RESPONSABLE DE PRODUCTION</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3} className="flex-Box" sx={{ justifyContent: "end" }}  >
                         

                            <Button  onClick={() => getAllUsers()} sx={{ color: "black", backgroundColor: "#9155fd !important" , marginRight:"30px"}} >
                Chercher
              </Button>


              
                <CachedIcon className='color-orange pointer'  onClick={() => onReload()}/>
                        </Grid>

                    </Grid>
        </Paper>

        <Grid container sx={{justifyContent: "space-between" }} >
                        <Grid item className='flex-Box' >
                            <Typography className='color-title' sx={{ fontSize: "1.1rem", fontWeight: '600', mr: 3 }} >Membres de l'équipe </Typography>
                            <Box className='number-listing' > <Typography className='color-title' sx={{ fontSize: "0.75rem", fontWeight: '600' }} > {arrayAllUsers.length} Membres</Typography>  </Box>
                        </Grid>

                        
            



                        <Grid item sx={{ textAlign: "end" }} >
                        <button onClick={() => onOpenModalAddUser()}className="btn- bg-primary py-2 px-3 m-1 rounded-lg color-black">
          + Ajouter
                </button>
                            

                        </Grid>
                    </Grid>

            <Grid container sx={{ mt: 2 }} >
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                
                    <TableContainer >
                        <Table stickyHeader aria-label='sticky table'>
                            <TableHead >
                                <TableRow >

                                    <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }} > Nom et prénom </TableCell>
                                    <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Email  </TableCell>
                                    <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Poste  </TableCell>
                                    <TableCell sx={{ color: "#3a3541de", fontSize: '0.9rem', fontWeight: '600' }}> Actions  </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {arrayAllUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                                    return (
                                        <TableRow hover role='checkbox' tabIndex={-1} key={row.login}>

                                            <TableCell sx={{ color: "#3a3541ad" }}>
                                                {row.firstName} {row.lastName}
                                            </TableCell>
                                            <TableCell sx={{ color: "#3a3541ad" }}>  {row.login}   </TableCell>
                                            <TableCell sx={{ color: "#3a3541ad" }}>
                                                <div className='role-icons-table-user' >
                                                    <Laptop sx={{ color: 'red', mr: 3 }} />
                                                    {row.poste}
                                                </div>

                                            </TableCell>
                                            <TableCell sx={{ color: "#3a3541ad" }} >
                                                <EyeOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} onClick={() => toggleDrawer(row)} />
                                                <DeleteOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} onClick={() => onDeletetUser(row)} />
                                                <PencilOutline sx={{ fontSize: '1.2rem', cursor: "pointer", ml: 2 }} onClick={() => onOpenModalEditUser(row)} />
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component='div'
                        count={arrayAllUsers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Grid>
            </>}


            <Dialog
                fullWidth
                maxWidth={"sm"}
                open={openModalAddUser} commer
                onClose={onOpenModalAddUser}
            >
                <DialogTitle className='flex-Box-between' sx={{ display: "flex", alignItems: "center", mb: 5 }} >
                    <Box className='flex-Box' >
                        <Avatar sx={{
                            // color: theme.palette.primary.main,
                            mr: 3
                        }} >
                            <AccountPlusOutline />
                        </Avatar>
                        <Typography className='color-title' sx={{ fontWeight: '600' }}>    Ajouter un nouveau utilisateur</Typography>
                    </Box>
                    <Close sx={{ cursor: "pointer" }} onClick={onOpenModalAddUser} />
                </DialogTitle>
                {/* <Divider /> */}
                <DialogContent>

                    <Grid container spacing={4} >


                        <Grid item xs={12} md={6} >
                            <Typography className='color-title-1' variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                                Prénom*
                            </Typography>
                            <TextField
                                size='small'
                                fullWidth
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} >
                            <Typography className='color-title-1' variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                                Nom *
                            </Typography>
                            <TextField
                                size='small'
                                fullWidth
                                value={lastName}
                                onChange={(e) => setlastName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}  >
                            <Typography className='color-title-1' variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                                Email*
                            </Typography>
                            <TextField
                                size='small'
                                fullWidth
                                type={"email"}
                                placeholder='Email'
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}  >
                            <Typography variant='body2' className='color-title-1' sx={{ fontWeight: 600, mb: 1 }}>
                                Mot de passe*
                            </Typography>
                            <OutlinedInput
                                size='small'
                                value={values.password}
                                id='auth-login-password'
                                onChange={handleChange('password')}
                                type={values.showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position='end'>
                                        <IconButton
                                            edge='end'
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            aria-label='toggle password visibility'
                                        >
                                            {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />

                        </Grid>


                        <Grid item xs={12} md={12} >
                            <Typography className='color-title-1' variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                                Poste*
                            </Typography>
                            <FormControl fullWidth size="small">
                                <Select
                                    onChange={(e) => setPoste(e.target.value)}
                                    value={poste}
                                    id='form-layouts-separator-select'
                                    labelId='form-layouts-separator-select-label' >

                                    <MenuItem value="COMMERCIALE">COMMERCIALE</MenuItem>
                                    {/* <MenuItem value="Administrateur">Administrateur</MenuItem> */}
                                    <MenuItem value="MAGASINIER">MAGASINIER</MenuItem>
                                    <MenuItem value="COMPTABLE">COMPTABLE</MenuItem>
                                    <MenuItem value="RESPONSABLE DE PRODUCTION">RESPONSABLE DE PRODUCTION</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>
                        {/* <Grid item xs={12} md={6} >
                            <Typography className='color-title-1' variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                                Droit d’accès*
                            </Typography>
                            <FormGroup>
                                {allPermession && allPermession.map((permession, key) =>

                                    <FormControlLabel key={key} control={<Checkbox onChange={() => changePermesiion(permession)}
                                        checked={permissionIds.includes(permession.id)} />} label={permession.name} sx={{ textTransform: "lowercase" }} />



                                )}
                            </FormGroup>
                        </Grid> */}

                    </Grid>
                </DialogContent>
                <Divider />
                <DialogActions>
                    {editUser ? <Button variant='contained' sx={{
                        //  backgroundColor: theme.palette.primary.main, 
                        color: 'white'
                    }} onClick={onUpdateUser}>Modifier</Button> : <Button variant='contained' sx={{
                        //  backgroundColor: theme.palette.primary.main, 
                        color: 'white'
                    }} onClick={addUser}>Valider</Button>}
                </DialogActions>
            </Dialog>

            <DetailsUser

                toggleDrawerClose={() => toggleDrawerClose()}
                state={state}
                anchor={"right"}
                firstName={firstName}
                lastName={lastName}
                login={login}
                poste={poste}
                // permissionArray={permissionArray}
            />

        </div>
    )
}

const mapStateToProps = (state) => {
    return {

        userRole: state.auth.userRole,
        allPermession: state.userServices.allPermession,
        arrayAllUsers: state.userServices.arrayAllUsers,
        arrayAllPostes: state.userServices.arrayAllPostes,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

        // getAllPermession: () => dispatch(actionCreator.getAllPermession()),
        createUser: (data) => dispatch(actionCreator.createUser(data)),
        getAllUsers: (data) => dispatch(actionCreator.getAllUsers(data)),
        updateUser: (data) => dispatch(actionCreator.updateUser(data)),
        deleteUser: (data) => dispatch(actionCreator.deleteUser(data)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)

