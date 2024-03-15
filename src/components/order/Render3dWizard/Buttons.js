import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

export const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  fullWidth: {
    width: '100%',
  },
  p6: {
    padding: '6px',
  },
  m6: {
    margin: '6px',
  },
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerHorizontal: {
    display: 'flex',
    justifyContent: 'center',
  },
  visible: {
    display: 'block',
    width: '100%',
  },
  hidden: {
    display: 'none',
  },
  spaceBetweenContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    color: '#3A3A3A',
    fontWeight: 600,
    marginBottom: '20px',
  },
  description: {
    marginBottom: '20px',
  },
  mb24: {
    marginBottom: '24px',
  },
  btnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  thumbImage: {
    width: '100%',
    maxWidth: '100px',
    height: '100%',
    maxHeight: '60px',
    marginTop: '4px',
  },
  thumbImageSelected: {
    width: '100%',
    maxWidth: '100px',
    height: '100%',
    maxHeight: '60px',
    marginTop: '4px',
    border: 'solid 2px blue',
  },
  minheight: {
    minHeight: '150px',
  },
  shareBox: {
    padding: '10px',
  },
  newLines: {
    whiteSpace: 'pre-line',
    textAlign: 'center',
  },
}));

export const NextButton = withStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '400px',
    color: 'white',
    borderRadius: '50px',
    padding: '12px 28px',
    backgroundColor: '#28a745',
    '&:hover': {
      backgroundColor: '#218838',
    },
  },
}))(Button);

export const OtherButton = withStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '400px',
    color: '#28a745',
    borderRadius: '50px',
    padding: '12px 28px',
    border: '1px solid #28a745',
    '&:hover': {
      color: 'white',
      backgroundColor: '#28a745',
    },
  },
}))(Button);
