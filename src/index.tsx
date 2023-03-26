import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {applyMiddleware, compose, createStore} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {rootReducer} from './redux/reducers/rootReducer';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const store  = createStore(rootReducer, compose(
    applyMiddleware(
        thunk
    ),
));

root.render(
  <React.StrictMode>
      <Provider store={store}>
          <App />
      </Provider>
  </React.StrictMode>
);

