import React from 'react';
import{BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from './pages/Home';
import Character from './pages/Character';
import Erro from './pages/Erro';
import Header from './components/Header';

const Routes = () => {
    return(
    <BrowserRouter>
        <Header />
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/character/:id" component={Character}/>
            <Route path="*" component={Erro} />
        </Switch>

    </BrowserRouter>
    );
}

export default Routes;  