import { Route, Switch, Redirect } from 'react-router-dom';
import NotFound from 'components/NotFound';
const DashboardScene = asyncComponent(() => import(/* webpackChunkName: "dashboard" */ './dashboard'));
const musicScene = asyncComponent(() => import(/* webpackChunkName: "dashboard" */ './music'));
const artistScene = asyncComponent(() => import(/* webpackChunkName: "dashboard" */ './artist'));

export default class AppScenes extends React.PureComponent {
    render() {
        return (
            <Switch>
                <Route path="/dashboard" component={DashboardScene} exact />
                <Route path="/music" component={musicScene} />
                <Route path="/artist" component={artistScene} />
                <Route path="/404" component={NotFound} />
                <Route path="*" render={() => <Redirect to="/404" />} />
            </Switch>
        );
    }
}
