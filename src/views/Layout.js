import { Box } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { Fragment } from "react";
import { Outlet } from "react-router";
import TopBar from "../components/TopBar";

const TopBarHeight = 70;

const useStyles = makeStyles((theme) => createStyles({
    wrapper: {
        marginTop: TopBarHeight
    },
    topBar: {
        height: TopBarHeight,
        width: '100vw',
        position: 'fixed',
        left: 0,
        top: 0
    }
}));

const Layout = () => {
    const classes = useStyles();
    return (
        <Fragment>
            <TopBar className={classes.topBar} />
            <Box className={classes.wrapper}>
                <Outlet />
            </Box>
        </Fragment>
    );
}

export default Layout;