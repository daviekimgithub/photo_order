import axios from 'axios';

export default axios.create({
  baseURL: `${process.env.REACT_APP_NEW_API_PATH}`,
});
