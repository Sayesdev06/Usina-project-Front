import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Avatar, Typography, Chip } from '@mui/material';
import { CurrencyUsd, Lock, ShieldCheckOutline, Store } from 'mdi-material-ui';
import { Euro } from '@mui/icons-material';
import BackgroundLetterAvatars from './StringAvatar'


const DetailsUser = (props) => {

    const anchor = props.anchor
    const { firstName, lastName, login, poste,  } = props  //permissionArray

    const list = (anchor) => (
        <Box
            sx={{ width: "100%", p: 4 }}
            role="presentation"
            onClick={props.toggleDrawerClose(anchor, false)}
            onKeyDown={props.toggleDrawerClose(anchor, false)}
        >
            {/* <Typography variant='h6' >Détails</Typography> */}
            <Box className='flex-Box' sx={{ justifyContent: "center", flexDirection: "column", }} >
                {/* <Avatar sx={{ width: '7rem', height: "7rem", bgcolor: "#BEE9FF" }}>
                    <Typography variant='h4' sx={{ color: 'white' }} >RD</Typography>
                </Avatar> */}
                <BackgroundLetterAvatars name={firstName + " " + lastName} />
                <Typography variant='h5' sx={{ mt: 2 }} >{firstName} {lastName} </Typography>

                <Chip
                    label={poste}
                    sx={{
                        mt: 2,
                        mb: 3,
                        backgroundColor: '#ff4c511f',
                        height: 24,
                        fontSize: '0.75rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { fontWeight: 500 },
                        color: "#ff4c51"
                    }}
                />
            </Box>

            <Divider />
            <List>

                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <MailIcon />
                        </ListItemIcon>
                        <ListItemText primary={login} />
                    </ListItemButton>
                </ListItem>

                {/* <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <Lock />
                        </ListItemIcon>
                        <ListItemText primary={"@password"} />
                    </ListItemButton>
                </ListItem> */}


                {/* <ListItem disablePadding>
                    <ListItemButton >
                        <ListItemIcon>
                            <ShieldCheckOutline />
                        </ListItemIcon>
                        <Box >
                            {permissionArray.map((permession, key) =>
                                <ListItemText key={key} primary={permession.name} sx={{ textTransform: "lowercase" }} />
                            )}
                        </Box>
                    </ListItemButton>
                </ListItem> */}

                {/* ShieldCheckOutline */}
            </List>
        </Box >
    );

    return (
        <div>

            {/* <Button onClick={  props.toggleDrawer(anchor, true)}>{anchor}</Button> */}
            <Drawer
                PaperProps={{

                    sx: {
                        width: 440,
                        borderTopLeftRadius: 25,
                        borderBottomLeftRadius: 25,
                    }
                }}
                anchor={anchor}
                open={props.state[anchor]}
                onClose={props.toggleDrawerClose(anchor, false)}
            >
                {list(anchor)}
            </Drawer>

        </div>
    );
}


export default DetailsUser