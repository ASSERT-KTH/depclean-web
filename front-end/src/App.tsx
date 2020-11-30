import React from 'react';
import { Layout } from 'antd';
import { MainMenu } from './MainMenu';
import { HomeViz } from './HomeViz';
import { Gallery } from './gallery';
import { About } from './about'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';


import "antd/dist/antd.css";
import './App.css';


const { Content, Footer } = Layout;

function App() {

  return (
    <Router>
      <Layout
        className="layout"
      >
        <MainMenu />
        <Content>
          <Switch>
            <Route exact path="/about" component={About} />
            <Route exact path="/gallery" component={Gallery} />
            <Route exact path="/" component={HomeViz} />
          </Switch>

        </Content>

        <Footer>


        </Footer>


      </Layout>
    </Router>
  );
}

export default App;
