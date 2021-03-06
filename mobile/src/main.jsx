import 'babel-polyfill'

import '../../src/styles/main'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { Router, Route, hashHistory } from 'react-router'
import localforage from 'localforage'
import cozy from 'cozy-client-js'

import { I18n } from '../../src/lib/I18n'

import filesApp from './reducers'
import AppRoute from '../../src/components/AppRoute'

import OnBoarding from './containers/OnBoarding'

const context = window.context
const lang = (navigator && navigator.language) ? navigator.language.slice(0, 2) : 'en'

const loggerMiddleware = createLogger()

const store = createStore(
  filesApp,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
)

document.addEventListener('DOMContentLoaded', () => {
  localforage.getItem('state').then(state => {
    if (state) {
      store.dispatch({ type: 'SET_STATE', state })
      cozy.init({
        cozyURL: state.serverUrl
      })
    }

    function requireSetup (nextState, replace) {
      const { isSetup } = store.getState().mobile
      if (!isSetup) {
        replace({
          pathname: '/onboarding',
          state: { nextPathname: nextState.location.pathname }
        })
      }
    }

    render((
      <I18n context={context} lang={lang}>
        <Provider store={store}>
          <Router history={hashHistory}>
            <Route onEnter={requireSetup}>
              {AppRoute}
            </Route>
            <Route path='onboarding' component={OnBoarding} />
          </Router>
        </Provider>
      </I18n>
    ), document.querySelector('[role=application]'))
  })
})

