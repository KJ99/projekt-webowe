import { Container } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Helmet from 'react-helmet';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: 'calc(100vh - 70px)'
    }
}));

const Page = ({ title, children, disableGutters }) => {
    const classes = useStyles();
  return (
    <>
      <Helmet>
        <title>{title ?? 'Beka z ani xD'}</title>
      </Helmet>
      <Container disableGutters={disableGutters} className={classes.root} maxWidth={false}>{children}</Container>
    </>
  );
};

export default Page;
