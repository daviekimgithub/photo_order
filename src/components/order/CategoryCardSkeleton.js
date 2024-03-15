//Core
import React, { useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  media: {
    height: 240,
    marginBottom: '28px',
  },
  short: {
    width: '35%',
  },
}));

const CategoryCardSkeleton = ({ key }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Card className={classes.root} key={key}>
      <Skeleton variant='rect' animation='wave' className={classes.media} />
      <CardContent>
        <Typography component='div' variant='h3'>
          <Skeleton animation='wave' width='60%' />
        </Typography>
        <Skeleton animation='wave' />
        <Skeleton animation='wave' />
        <Skeleton animation='wave' className={classes.short} />
      </CardContent>
    </Card>
  );
};

export default CategoryCardSkeleton;
