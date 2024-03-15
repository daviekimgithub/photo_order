//Core
import React from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { useAlerts } from '../../contexts/AlertContext';

//Utils
import { REMOVE } from '../../reducers/alert/reducer';

//UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';

//Alert
import MuiAlert from '@material-ui/lab/Alert';
import Zoom from '@material-ui/core/Zoom';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

function PaperComponent(props) {
  return <Paper {...props} />;
}

function MyAlert(props) {
  return <MuiAlert elevation={12} variant='filled' {...props} />;
}

const Alert = ({ alert }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [, alertDispatch] = useAlerts();

  if (alert.length) {
    let removeAlert = alert[0];
    if (removeAlert.type !== 'confirm') {
      if (alert.length > 3) {
        alertDispatch({ type: REMOVE, payload: { id: removeAlert.id } });
      } else {
        setTimeout(() => {
          alertDispatch({ type: REMOVE, payload: { id: removeAlert.id } });
        }, 6000);
      }
    }
  }

  function renderAction(action, id, actionprops) {
    // console.log('renderAction: ', action, id, actionprops);
    return () => {
      action(actionprops);
      alertDispatch({ type: REMOVE, payload: { id: id } });
    };
  }

  return (
    <div className='alert'>
      <div className='alert-container'>
        {alert.map((a) => {
          switch (a.type) {
            case 'confirm':
              return (
                <Dialog
                  key={a.id}
                  open='true'
                  onClose={() =>
                    alertDispatch({ type: REMOVE, payload: { id: a.id } })
                  }
                  PaperComponent={PaperComponent}
                  aria-labelledby='draggable-dialog-title'
                >
                  <DialogTitle id='draggable-dialog-title'>
                    {a.content.header}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>{a.content.message}</DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      autoFocus
                      onClick={() =>
                        alertDispatch({ type: REMOVE, payload: { id: a.id } })
                      }
                      color='primary'
                    >
                      {t('Cancel')}
                    </Button>
                    <Button
                      onClick={renderAction(a.action, a.id, a.actionprops)}
                      color='primary'
                    >
                      {t('OK')}
                    </Button>
                  </DialogActions>
                </Dialog>
              );

            case 'alert':
              return (
                <Dialog
                  key={a.id}
                  open='true'
                  onClose={() =>
                    alertDispatch({ type: REMOVE, payload: { id: a.id } })
                  }
                  PaperComponent={PaperComponent}
                  aria-labelledby='draggable-dialog-title'
                >
                  <DialogTitle id='draggable-dialog-title'>
                    {a.content.header}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>{a.content.message}</DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      autoFocus
                      onClick={() =>
                        alertDispatch({ type: REMOVE, payload: { id: a.id } })
                      }
                      color='primary'
                    >
                      {t('OK')}
                    </Button>
                  </DialogActions>
                </Dialog>
              );

            default:
              return (
                <Zoom
                  in={true}
                  style={{ transitionDelay: true ? '100ms' : '100ms' }}
                  key={a.id}
                >
                  <div
                    className={`alert-container-item ${a.type ? a.type : ''}`}
                    key={a.id}
                  >
                    <MyAlert
                      key={a.id}
                      onClose={() =>
                        alertDispatch({ type: REMOVE, payload: { id: a.id } })
                      }
                      severity={a.type}
                    >
                      {a.content.header} {a.content.message}
                    </MyAlert>
                  </div>
                </Zoom>
              );
          }
        })}
      </div>
    </div>
  );
};

export default Alert;
