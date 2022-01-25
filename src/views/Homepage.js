import { Autocomplete, Button, Dialog, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { Box } from "@mui/system"; 
import Page from "../components/Page";
import People from "../assets/images/people.png";
import { Chat, PlayArrow } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from '../context/UserContext';
import { Formik } from "formik";
import { getDatabase } from "../utils/FirebaseUtil";
import { get, onValue, push, ref, set, update, remove } from "firebase/database";
import { useNavigate } from "react-router";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        paddingTop: theme.spacing(10),
        paddingLeft: theme.spacing(20),
        paddingRight: theme.spacing(20)
    },
    appName: {
        fontWeight: theme.fontWeightBold,
        fontSize: '3.5rem'
    },
    pageSection: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%'
    },
    image: {
        width: '100%',
        height: 'auto',
        objectFit: 'contain'
    },
    actions: {
        marginTop: theme.spacing(3)
    },
    languageSubmitContainer: {
        padding: theme.spacing(1),
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
    }
}));

const Homepage = () => {
    const classes = useStyles();
    const { user } = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    console.log(user);  
    return (
        <Page title="Linguae">
            <Grid container spacing={2} className={classes.root}>
                <Grid item xl={7} lg={7} md={6} sm={12} xs={12}>
                    <Box className={classes.pageSection}>
                        <Typography variant="h1">
                            Linguae
                        </Typography>
                        <Typography variant="subtitle1">
                            Learn languages by chat
                        </Typography>
                        <Box className={classes.actions}>
                            {user == null && (
                                <Button
                                    variant="contained"
                                    startIcon={<PlayArrow />}
                                    component={NavLink}
                                    to="auth"
                                >
                                    Get Started
                                </Button>
                            )
                            ||
                            (
                                <Button
                                    variant="contained"
                                    startIcon={<Chat />}
                                    onClick={() => setOpen(true)}
                                >
                                    Chat
                                </Button>
                            )}   
                        </Box>
                    </Box>
                </Grid>
                <Grid item xl={5} lg={5} md={6} sm={12} xs={12}>
                    <img
                        src={People}
                        alt="Picture"
                        className={classes.image}
                        
                    /> 
                </Grid>
            </Grid>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>
                    Choose a language
                </DialogTitle>
                <DialogContent>
                    <Box mt={3}>
                        <Formik
                            initialValues={{
                                lang: { key: 'eng', label: 'English' }
                            }}
                            onSubmit={async (values, helpers) => {
                                console.log(values);
                                const db = getDatabase();
                                const roomsRef = ref(db, 'rooms');
                                const rooms = (await get(roomsRef)).toJSON() ?? {};
                                const roomToJoinKey = Object.keys(rooms)
                                    .find((key) => {
                                        console.log(rooms[key])
                                        return rooms[key].lang === values.lang.key && 
                                            Object.keys(rooms[key].speakers ?? {}).length < 2
                                    });
                                console.log(roomToJoinKey);
                                if(!roomToJoinKey) {
                                    const targetRoom = await push(roomsRef, {
                                        speakers: [
                                            {
                                                uid: user.uid, 
                                                name: user.email,
                                                pictureUrl: user.photoURL
                                            }
                                        ],
                                        lang: values.lang.key 
                                    });
                                    navigate(`rooms/${targetRoom.key}`);
                                } else {
                                    const speakersRoomRef = ref(db, `rooms/${roomToJoinKey}/speakers`);
                                    const current = rooms[roomToJoinKey];
                                    await push(speakersRoomRef, {
                                            uid: user.uid, 
                                            name: user.email,
                                            pictureUrl: user.photoURL
                                    });
                                    navigate(`rooms/${roomToJoinKey}`);
                                }
                                // const readySpeakersRef = ref(db, `readySpeakers`);
                                // const roomsRef = ref(db, 'rooms');
                                // push(readySpeakersRef, { 
                                //     uid: user.uid, 
                                //     name: user.email,
                                //     pictureUrl: user.photoURL,
                                //     lang: values.lang.key 
                                // })
                                //     .then(() => {
                                //         onValue(readySpeakersRef, (snapshot) => {
                                //             const json = snapshot.toJSON() ?? {};
                                //             const speaker = Object.values(json)
                                //                 .find(item => item.uid != user.uid && item.lang == values.lang.key);
                                //             if(speaker != null) {
                                //                 Object.keys(json).forEach(key => {
                                //                     if (json[key].uid == user.uid || json[key].uid == speaker.uid) {
                                //                         delete json[key]
                                //                     }
                                //                 });
                                //                 set(readySpeakersRef, json);
                                //                 push(roomsRef, { speakers: [
                                //                     {
                                //                         uid: user.uid,
                                //                         name: user.email,
                                //                         pictureUrl: user.photoURL
                                //                     },
                                //                     {
                                //                         uid: speaker.uid,
                                //                         name: speaker.name,
                                //                         pictureUrl: speaker.pictureUrl ?? null
                                //                     }
                                //                 ], lang: values.lang.key })
                                //                     .then(result => {
                                //                         navigate(`rooms/${result.key}`);
                                //                     })
                                //                     .catch(e => console.error(e))
                                //             }
                                //         })
                                //     })
                                //     .catch(e => console.error(e))

                            }}
                        >
                            {({ values, handleSubmit, setFieldValue }) => (
                                <form onSubmit={handleSubmit}>
                                    <Autocomplete
                                        getOptionLabel={opt => opt.label}
                                        onChange={(evt, val) => setFieldValue('lang', val, true)}
                                        options={[
                                            { key: 'eng', label: 'English' },
                                            { key: 'pl', label: 'Polski' },
                                            { key: 'fr', label: 'Française' },
                                            { key: 'jp', label: '日本' },
                                            { key: 'chn', label: '普通話' }
                                        ]}
                                        renderInput={(props) => (
                                            <TextField
                                                {...props}
                                                label="Language"
                                            />
                                        )}
                                        isOptionEqualToValue={(opt) => opt.key == values.lang.key}
                                    />
                                    <Box className={classes.languageSubmitContainer}>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                        >
                                            Proceed
                                        </Button>
                                    </Box>
                                </form>
                            )}
                        </Formik>
                    </Box>
                </DialogContent>
            </Dialog>
        </Page>
    )
}

export default Homepage;