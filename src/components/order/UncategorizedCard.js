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

//Assets
import placeholderImg from '../../assets/our-other-products.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  media: {
    height: 340,
  },
}));

const UncategorizedCard = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  const [photographer] = usePhotographer();

  const handleCardClick = () => {
    history.push(`/photographer/${photographer.photographId}/uncategorized`);
  };

  return (
    <Card className={classes.root} key={'uncategorized-card'}>
      <CardActionArea onClick={handleCardClick}>
        <CardMedia
          className={classes.media}
          image={placeholderImg}
          title={t('Other products')}
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='h5'>
            {t('Other products')}
          </Typography>
          <Typography variant='body' color='textSecondary' component='p'>
            {t('Our other products, check what else do we have.')}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default UncategorizedCard;
