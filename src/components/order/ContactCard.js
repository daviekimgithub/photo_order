//Core
import React, { useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';

//Utils
import { usePhotographer } from '../../contexts/PhotographerContext';

//UI
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    padding: '28px',
  },
  gridConainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    maxWidth: '200px',
  },
  noPadding: {
    padding: '0 !important',
  },
  link: {
    textDecoration: 'none',
    color: '#3a3a3a',
  },
  conatiner: {
    paddingTop: '16px'
  }
}));

const ContactCard = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [photographer] = usePhotographer();

  return (
    <Container maxWidth='md' className={classes.conatiner} >
      <Paper square className={classes.paper}>
        <Grid
          container
          spacing={3}
          className={classes.gridConainer}
          direction='column'
        >
          <Grid item>
            <img
              src={photographer.logoUrl}
              alt='company logo'
              className={classes.logo}
            />
          </Grid>
          <Grid item>
            <Typography variant='h4' component='h1'>
              {photographer.companyName}
            </Typography>
          </Grid>
          <Grid item className={classes.noPadding}>
            <Typography variant='body1'>{photographer.street}</Typography>
          </Grid>
          <Grid item className={classes.noPadding}>
            <Typography variant='body1'>{photographer.phone}</Typography>
          </Grid>
          <Grid item>
            <Typography variant='body1'>
              <a href={`mailto:${photographer.email}`} className={classes.link}>
                {photographer.email}
              </a>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ContactCard;
