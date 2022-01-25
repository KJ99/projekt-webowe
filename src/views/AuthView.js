import {
  Grid,
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  FormHelperText
} from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import { Formik, useFormik } from 'formik';
import { useCallback } from 'react';
import Page from '../components/Page';
import * as Yup from 'yup';
import {signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth } from '../utils/FirebaseUtil';
import { getErrorMessage } from '../utils/ErrorUtil';
import { useNavigate } from 'react-router';
const auth = getAuth();

const useStyles = makeStyles((theme) => createStyles({
    root: {
      minHeight: 'calc(100vh - 70px)',
      justifyContent: 'center'
    },
    authSection: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    formInput: {
      marginBottom: theme.spacing(2)
    },
    submitRow: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center'
    }
  })
);

const AuthView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const handleLogin = useCallback((values, helpers) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
    .then((credential) => {
      navigate('/')
    })
    .catch(e => {
      helpers.setFieldError('submit', getErrorMessage(e.code));
    });
  }, []);

  const handleRegister = useCallback((values, helpers) => {
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((credential) => {
        console.log(credential);
      })
      .catch(e => {
        helpers.setFieldError('submit', getErrorMessage(e.code));
      });
  }, []);

  const loginForm = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    
    onSubmit: handleLogin
  });
  const registerForm = useFormik({
    
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      agreed: false
    },
    
    validationSchema: Yup.object({
      email: Yup.string()
        .required('This field is required')
        .email('This field should contain a valid email address'),
      password: Yup.string().required('This field is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
      agreed: Yup.bool().test({
        name: 'agreement',
        message: 'This field is required',
        test: (val) => val === true
      })
    }),
    onSubmit: handleRegister
  });
  return (
    <Page title="Get started">
      <Grid container spacing={1} className={classes.root}>
        <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className={classes.authSection}>
          <form onSubmit={loginForm.handleSubmit}>
            <Card>
              <CardHeader title="Log in" />
              <CardContent>
                <Box mb={2}>
                  <FormHelperText error={loginForm.errors.submit != null}>
                    {loginForm.errors.submit}
                  </FormHelperText>
                </Box>
                <TextField
                  InputProps={{
                    className: classes.formInput
                  }}
                  name="email"
                  fullWidth
                  variant="outlined"
                  label="email"
                  value={loginForm.values.email}
                  onChange={loginForm.handleChange}
                  onBlur={loginForm.handleBlur}
                  error={Boolean(loginForm.touched.email && loginForm.errors.email)}
                  helperText={loginForm.touched.email && loginForm.errors.email}
                />
                <TextField
                  InputProps={{
                    className: classes.formInput
                  }}
                  name="password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  label="Password"
                  value={loginForm.values.password}
                  onChange={loginForm.handleChange}
                  onBlur={loginForm.handleBlur}
                  error={Boolean(loginForm.touched.password && loginForm.errors.password)}
                  helperText={loginForm.touched.password && loginForm.errors.password}
                />
              </CardContent>
              <CardActions className={classes.submitRow}>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                >
                  Log in
                </Button>
              </CardActions>
            </Card>
          </form>
        </Grid>
        <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className={classes.authSection}>
          <form 
            onSubmit={registerForm.handleSubmit} 
          >
            <Card>
              <CardHeader title="Create an account" />
              <CardContent>
                <Box mb={2}>
                  <FormHelperText error={registerForm.errors.submit != null}>
                    {registerForm.errors.submit}
                  </FormHelperText>
                </Box>
                <TextField
                  InputProps={{
                    className: classes.formInput
                  }}
                  name="email"
                  fullWidth
                  variant="outlined"
                  label="Email"
                  value={registerForm.values.email}
                  onChange={registerForm.handleChange}
                  onBlur={registerForm.handleBlur}
                  error={Boolean(registerForm.touched.email && registerForm.errors.email)}
                  helperText={registerForm.touched.email && registerForm.errors.email}
                />
                <TextField
                  InputProps={{
                    className: classes.formInput
                  }}
                  name="password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  label="Password"
                  value={registerForm.values.password}
                  onChange={registerForm.handleChange}
                  onBlur={registerForm.handleBlur}
                  error={Boolean(registerForm.touched.password && registerForm.errors.password)}
                  helperText={registerForm.touched.password && registerForm.errors.password}
                />
                <TextField
                  InputProps={{
                    className: classes.formInput
                  }}
                  name="confirmPassword"
                  type="password"
                  fullWidth
                  variant="outlined"
                  label="Confirm password"
                  value={registerForm.values.confirmPassword}
                  onChange={registerForm.handleChange}
                  onBlur={registerForm.handleBlur}
                  error={Boolean(registerForm.touched.confirmPassword && registerForm.errors.confirmPassword)}
                  helperText={registerForm.touched.confirmPassword && registerForm.errors.confirmPassword}
                />
                <FormControlLabel
                  className={classes.formInput}
                  label="I have read and agreed Terms"
                  control={
                    <Switch
                      name="agreed"
                      checked={registerForm.values.agreed}
                      onChange={
                        (_, val) => {
                          registerForm.setFieldTouched('agreed', true) 
                          registerForm.setFieldValue('agreed', val, true) 
                        }
                      }
                    />
                  }
                />
                <FormHelperText 
                  error={
                    Boolean(registerForm.touched.agreed && registerForm.errors.agreed)
                  }
                >
                  {registerForm.touched.agreed && registerForm.errors.agreed}
                </FormHelperText>
              </CardContent>
              <CardActions className={classes.submitRow}>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                >
                  Register
                </Button>
              </CardActions>
            </Card>
          </form>
        </Grid>
      </Grid>
    </Page>
  );
};

export default AuthView;
