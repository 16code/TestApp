import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import BasicLayout from './layouts/BasicLayout';
import { store } from './Store';

export default () => (
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Redirect from="/" to="/dashboard" exact />
                <Route path="/" component={BasicLayout} />
            </Switch>
        </BrowserRouter>
    </Provider>
);
