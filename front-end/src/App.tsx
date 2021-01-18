import React from 'react';
import { Layout } from 'antd';
import { MainMenu } from './MainMenu';
import { HomeViz } from './HomeViz';
import { Gallery } from './gallery';
import { About } from './about';
import { Search } from 'src/Search';
import { Scan } from 'src/Components/Scan';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';


import "antd/dist/antd.css";
import './App.css';


const { Content } = Layout;

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
            <Route exact path="/result" component={HomeViz} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/scan" component={Scan} />
            <Route exact path="/" component={Search} />
          </Switch>

        </Content>

        {/* <Footer>
        </Footer> */}


      </Layout>
    </Router>
  );
}

export default App;
