import { AccountCircle, Logout, Person, Settings } from "@mui/icons-material";
import { Box, createStyles, IconButton, Popper, Grow, Paper, ClickAwayListener, MenuItem } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { useContext, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import LogoContent from '../assets/images/app-logo.jpg'
import { UserContext } from '../context/UserContext';

const useStyles = makeStyles((theme) => createStyles({
    root: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: `1px 1px 1px ${theme.palette.grey[300]}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1)
    },
    logo: {
        width: 70,
        height: 70,
        objectFit: 'cover',
        borderRadius: '50%'
    },
    profilePicture: {
        width: 60,
        height: 60,
        borderRadius: '50%',
        objectFit: 'center',
    },
    contextMenuItem: {
        padding: theme.spacing(2) + ' !important;'
    },
    menuItemIcon: {
        marginRight: theme.spacing(1)
    }
}));

const TopBar = ({ className }) => {
    const classes = useStyles();
    const { user, logout } = useContext(UserContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const anchorRef = useRef(null);
    return (
        <Box className={clsx(className, classes.root)}>
            <NavLink to="/">
                <img
                    src={LogoContent}
                    alt="app logo"
                    className={classes.logo}
                />
            </NavLink>
            {
                user != null && (
                    
                    <IconButton 
                        ref={anchorRef} 
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {user?.photoURL && (
                            <img
                                src={user?.photoURL}
                                className={classes.profilePicture}
                                alt="Profile picture"
                            />
                        ) || (
                            <AccountCircle
                                fontSize="large"
                            />
                        )}
                </IconButton>
                )
            }
            <Popper
                open={menuOpen}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
            >
            {({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{
                        transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
                    }}

                >
                    <Paper>
                        <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
                            <Box>
                                <MenuItem className={classes.contextMenuItem}>
                                    <Settings className={classes.menuItemIcon} />
                                    Settings
                                </MenuItem>
                                <MenuItem
                                    className={classes.contextMenuItem}
                                    onClick={logout}
                                >
                                    <Logout className={classes.menuItemIcon} />
                                    Log Out
                                </MenuItem>
                            </Box>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
            </Popper>
        </Box>
    );
}

export default TopBar;