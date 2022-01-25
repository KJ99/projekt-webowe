import { checkActionCode, getAuth } from "firebase/auth";
import { useParams } from "react-router";
import { Box, Button, Card, CardActions, CardContent, Grid, IconButton, TextField, Typography, Hidden } from "@mui/material";
import { AccountCircle, PlayArrow, Send } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { get, onChildAdded, onValue, push, ref } from "firebase/database";
import { getApp, getDatabase } from "../utils/FirebaseUtil";
import { makeStyles } from "@mui/styles";
import { UserContext } from "../context/UserContext";
import { useContext, useMemo } from "react";
import { Formik } from "formik";
import moment from "moment";
import clsx from "clsx";
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useSnackbar } from 'notistack'

const languages = {
    eng: 'English',
    pl: 'Polski',
    fr: 'Française',
    jp: '日本',
    chn: '普通話'
}

const useStyles = makeStyles(theme => ({
    sidePanel: {
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        alignItems: 'center',
        height: 48,
        [theme.breakpoints.up('md')]: {  
            height: 'calc(100vh - 70px)',
            flexDirection: 'column',
            justifyContent: 'flex-start',
        },
        [theme.breakpoints.down('md')]: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%'
        }
    },
    image: {
        width: 100,
        height: 100,
        objectFit: 'cover',
        borderRadius: '50%'
    },
    chatContainer: {
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.up('md')]: {
            height: `calc(100vh - 70px)`,
        },
        [theme.breakpoints.down('md')]: {
            height: `calc(100vh - 118px)`,
        },
        justifyContent: 'flex-start',
    },
    messagesContainer: {
        flex: 10,
        overflowY: 'auto'
    },
    inputArea: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
    },
    formCard: {
        height: 20,
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(4),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    inputContainer: {
        flexGrow: 1
    },
    submitContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    messageRow: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(2)
    },
    myMessageRow: {
        justifyContent: 'flex-end'
    },
    notMyMessageRow: {
        justifyContent: 'flex-start'
    },
    message: {
        borderRadius: 25,
        padding: theme.spacing(1)
    },
    myMessage: {
        backgroundColor: theme.palette.primary.main
    },
    notMyMessage: {
        backgroundColor: theme.palette.grey[300]
    },
    speaker: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            flexDirection: 'column'
        },
        [theme.breakpoints.down('md')]: {
            flexDirection: 'row'
        },
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
}));

const ChatView = () => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const messagesContainerRef = useRef(null);
    const { roomKey } = useParams();
    const [room, setRoom] = useState();
    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const messagesRef = useMemo(() => ref(getDatabase(), `rooms/${roomKey}/messages`), [roomKey]);
    const speaker = useMemo(() => {
        let result = null;
        if(room != null) {
            Object.keys(room?.speakers).forEach(key=>{
                if(room.speakers[key]?.uid !== user.uid) {
                    result = room.speakers[key];
                }
            })
        }
        
        return result;
    }, [room]);

    useEffect(() => {
        if (speaker != null) {
            enqueueSnackbar(`${speaker.name} has join the room`, { variant: 'success' });
        }
    }, [speaker]);

    useEffect(() => {
        const roomRef = ref(getDatabase(), `rooms/${roomKey}`)
        get(roomRef)
            .then(snapshot => {
                setRoom(snapshot.toJSON());
                onChildAdded(messagesRef, snapshot => {
                    setMessages(prev => [...prev, snapshot.toJSON()].sort((a, b) => a.createdAt - b.createdAt))
                });
            })
            .catch(e => console.error(e))
    }, [roomKey]);
    
    useEffect(() => {
        messagesContainerRef.current?.scroll({
            top: messagesContainerRef.current?.clientHeight + messagesContainerRef.current?.scrollHeight,
        
        })
    }, [messages]);
    return (
        <Grid container>
            <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                <Box className={classes.sidePanel}>
                    {speaker != null && (
                        <Box className={classes.speaker}>
                            {speaker?.pictureUrl != null && (
                                <img 
                                    src={speaker?.pictureUrl} 
                                    alt="Profile picture" 
                                    className={classes.image}
                                />
                            ) || (
                                <AccountCircle
                                    fontSize="large"
                                    className={classes.image}
                                />
                            )}
                            <Hidden mdDown>
                                <p>{speaker?.name}</p>
                            </Hidden>
                        </Box>
                    ) || (
                        <Typography>Waiting for the speaker...</Typography>
                    )} 
                    <Typography>{languages[room?.lang]}</Typography>
                    <Button
                    variant="text"
                    component={NavLink}
                    to="/"
                    >
                        Close
                    </Button>
                </Box>
            </Grid>
            <Grid item md={9} xs={12}>
                <Box className={classes.chatContainer}>
                        <Box 
                            ref={messagesContainerRef} 
                            className={classes.messagesContainer}
                        >
                            {messages.map((message, i) => (
                                <Box key={i} className={clsx(classes.messageRow, {
                                    [classes.myMessageRow]: message.sender === user?.uid,
                                    [classes.notMyMessageRow]: message.sender === speaker?.uid
                                })}>
                                    <Box className={clsx(classes.message, {
                                        [classes.myMessage]: message.sender === user.uid,
                                        [classes.notMyMessage]: message.sender === speaker.uid
                                    })}>
                                        <Typography>{message.content}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    <Box className={classes.inputArea}>
                        <Formik
                            initialValues={{
                                content: ''
                            }}
                            onSubmit={(values, helpers) => {
                                push(messagesRef, {
                                    createdAt: moment().unix(),
                                    sender: user.uid,
                                    content: values.content
                                })
                                .then((ref) => {
                                    console.log(ref)
                                    helpers.resetForm()
                                })
                                .catch(e => console.warn(e));
                            }}
                        >
                            {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
                                <form onSubmit={handleSubmit}>
                                    <Card className={classes.formCard}>
                                        <CardContent className={classes.inputContainer}>
                                            <TextField
                                                variant="standard"
                                                fullWidth
                                                name="content"
                                                label="Send message"
                                                value={values.content}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(touched.content && errors.content)}
                                                helperText={touched.content && errors.content}
                                            />
                                        </CardContent>
                                        <CardActions className={classes.submitContainer}>
                                            <IconButton
                                                color="primary"
                                                type="submit"
                                                disabled={values.content.trim().length == 0}
                                            >
                                                <Send />
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                </form>
                            )}
                        </Formik>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default ChatView;