import React from 'react';
import "antd/dist/antd.css";

import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import SingleCocktail from './pages/SingleCocktail';

export default function app() {
  return (
    <>
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/cocktails/:id">
          <SingleCocktail />
        </Route>
      </Switch>
    </Router>
    </>
  )
}
