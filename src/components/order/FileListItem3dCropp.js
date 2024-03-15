//Core
import React, { useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { useOrder } from '../../contexts/OrderContext';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CropIcon from '@material-ui/icons/Crop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import Paper from '@material-ui/core/Paper';
import DoneIcon from '@material-ui/icons/Done';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import WarningIcon from '@material-ui/icons/Warning';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: '16px',
    height: '65px',
    display: 'flex',
    alignItems: 'center',
  },
  aligner: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cropp: {
    margin: '12px',
  },
  thumbnail: {
    height: '65px',
  },
  fileName: {
    width: '100%',
    flexGrow: 1,
    marginLeft: '8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    wordWrap: 'break-word',
    [theme.breakpoints.down('sm')]: {
      width: '1px',
    },
  },
  centerVertical: {
    display: 'flex',
    alignItems: 'center',
  },
  success: {
    color: '#28a745',
  },
  warning: {
    color: '#fcba03',
  },
  failure: {
    color: '#dc3545',
  },
}));

const FileListItem3dCropp = ({ file, key }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [openCropp, setOpenCropp] = useState(false);

  const [, orderDispatch] = useOrder();

  const handleRemoveQuantity = () => {
    orderDispatch({
      type: 'DECRESE_ORDER_ITEM_QTY',
      payload: { guid: file.guid },
    });
  };

  return (
    <>
      <Paper square key={key} className={classes.root}>
        <img
          src={file.fileUrl}
          className={classes.thumbnail}
          alt={file.fileName}
        />
        <div className={classes.aligner}>
          <span className={classes.fileName}>{file.fileName}</span>
          <div className={classes.centerVertical}>
            <Button
              variant='contained'
              color='primary'
              className={classes.cropp}
              startIcon={<CropIcon />}
              onClick={() => setOpenCropp(true)}
            >
              {t('Cropp')}
            </Button>
            <WarningIcon className={classes.warning} />
            {file.status === 'idle' && <CircularProgress size={18} />}
            {file.status === 'success' && (
              <DoneIcon className={classes.success} />
            )}
            {file.status === 'failed' && (
              <ErrorOutlineIcon className={classes.failure} />
            )}
            <IconButton aria-label='delete' onClick={handleRemoveQuantity}>
              <RemoveCircleOutlineIcon />
            </IconButton>
          </div>
        </div>
      </Paper>
      <Dialog
        key={`Cropp_${key}`}
        fullWidth={true}
        maxWidth={'lg'}
        open={openCropp ?? false}
        onClose={() => setOpenCropp(false)}
      >
        <DialogContent>
          <DialogContentText id='dialog-3d-cropp-file'>
            <p>content</p>
          </DialogContentText>
          <Divider />
          <DialogActions>
            <p>actions</p>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileListItem3dCropp;
