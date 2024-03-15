//Core
import './App.css';

//Components
import Router from './components/router/Router';
import GlobalProviders from './core/GlobalProviders';
import CookieConsent from "react-cookie-consent";

//UI
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    fontFamily: ['Nunito', 'sans-serif'].join(','),
  },
});

function App() {
  return (
    <GlobalProviders>
      <ThemeProvider theme={theme}>
        <Router />
        <CookieConsent
          location="bottom"
          buttonText="Accept"
          cookieName="photoorderCookieAgree"
          style={{ background: "#2B373B" }}
          buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
          expires={150}
        >
          This website uses cookies to enhance the user experience. Rede more <a href="/cookie" style={{color:'#aaa'}}> here</a>
        </CookieConsent>
      </ThemeProvider>
    </GlobalProviders>
  );
}

export default App;
