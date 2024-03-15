//Core
import React, { useState } from 'react';

//Components

//Hooks
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePhotographer } from '../../contexts/PhotographerContext';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  media: {
    height: 340,
  },
}));

const CategoryCard = ({ category }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  const [photographer] = usePhotographer();

  const handleCardClick = () => {
    history.push(
      `/photographer/${photographer.photographId}/categories/${category.Id}`
    );
  };

  return (
    <Card className={classes.root} key={category.Id}>
      <CardActionArea onClick={handleCardClick}>
        <CardMedia
          className={classes.media}
          image={category.FileUrl}
          title={category.Name}
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='h5'>
            {category.Name}
          </Typography>
          <Typography variant='body' color='textSecondary' component='p'>
            {category.Description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CategoryCard;
