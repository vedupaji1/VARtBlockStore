import React from 'react';
import MainDashboardComponent from "./Components/MainDashboardComponent"
import Header from "./Components/Header/Header";
import Error404 from "./Components/Error404";
import './App.css';
import { Route, Switch } from "react-router-dom";
const App = () => {
  return (
    <>
      <Header />
      <Switch>
        <Route exact path='/:username?'>
          {/* Use 'usePrams' Hook To Get Value Of Parameter, And Dont Try To Access Value Of Parameter In Any Other Component Except "MainDashboardComponent" And Its Child Components. */}
          <MainDashboardComponent />
        </Route>
        {
          window.location.pathname !== "/auth/google" ?
            <Route>
              <Error404 />
            </Route> : <></>
        }
      </Switch>
    </>
  )
}

export default App;
