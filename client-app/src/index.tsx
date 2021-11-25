import ReactDOM from 'react-dom'; //web version of the react
import 'semantic-ui-css/semantic.min.css';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.min.css'
import 'react-datepicker/dist/react-datepicker.css';
import './app/layout/styles.css';
import App from './app/layout/App';
import reportWebVitals from './reportWebVitals';
import { store, StoreContext } from './app/stores/store';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import ScrollToTop from './app/layout/ScrollToTop';

export const history = createBrowserHistory();

ReactDOM.render(
  <StoreContext.Provider value={store}>
    {/*put our app isnide the router*/}
    {/* <BrowserRouter>
      <App />
    </BrowserRouter> */}
    <Router history={history}>
      {/*252*/}
      <ScrollToTop />
      <App />
    </Router>
  </StoreContext.Provider>,

  document.getElementById('root')//inside this div root will going our react application that is inside .<React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
