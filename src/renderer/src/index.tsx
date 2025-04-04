/* @refresh reload */
import { render } from 'solid-js/web'
import { Route, HashRouter } from '@solidjs/router'
import './assets/main.css'
import MainLayout from './layouts/MainLayout'
import { lazy } from 'solid-js'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const PatientDetails = lazy(() => import('./pages/PatientDetails'))
const Appointments = lazy(() => import('./pages/Appointments'))
const Billing = lazy(() => import('./pages/Billing'))
const Settings = lazy(() => import('./pages/Settings'))
const Login = lazy(() => import('./pages/Login'))
const PatientsList = lazy(() => import('./pages/PatientsList'))
const NotFound = lazy(() => import('./pages/NotFound'))

const rootElement = document.getElementById('root')

if (rootElement) {
  render(
    () => (
      <HashRouter>
        {/* Keep your routes the same */}
        <Route path="/login" component={Login} />
        <Route path="/" component={MainLayout}>
          <Route path="/" component={Dashboard} /> {/* Default route */}
          {/* Redundant dashboard route, "/" already handles it */}
          {/* <Route path="/dashboard" component={Dashboard} /> */}
          <Route path="/patients" component={PatientsList} />
          <Route path="/patients/:id" component={PatientDetails} />
          <Route path="/appointments" component={Appointments} />
          <Route path="/billing" component={Billing} />
          <Route path="/settings" component={Settings} />
        </Route>
        <Route path="*" component={NotFound} />
      </HashRouter>
    ),
    rootElement
  )
} else {
  console.error('Root element not found')
}
