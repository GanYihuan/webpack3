import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { AppContainer } from 'react-hot-loader'
const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
     document.getElementById('root')
  )
}
render(App)
if(module.hot) {
  module.hot.accept('./components/App/', () => {
    render(App)
  })
}

fetch('api/comments/show?id=4199740256395164&page=1')
  .then(res => {
    res.json().then(data => {
      console.log(data)
    })
  })

// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
