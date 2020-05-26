import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import theme from '../material/theme';
import UserProvider from '../firebase/userContext';
import AppBar from '../components/AppBar/AppBar';

export default ({ Component, pageProps }) => (
  <ThemeProvider theme={theme}>
    <UserProvider>
      <CssBaseline />
      <AppBar />
      <Container>
        <Component {...pageProps} />
      </Container>
    </UserProvider>
  </ThemeProvider>
);
