import { Route, Switch } from 'react-router-dom';
const DashboardScene = asyncComponent(() => import(/* webpackChunkName: "dashboard" */ './home'));
const music = asyncComponent(() => import(/* webpackChunkName: "dashboard" */ './music'));

const NotFound = props => <div>404 {JSON.stringify(props.location, null, 2)}</div>;

export default class AppScenes extends React.PureComponent {
    render() {
        return (
            <Switch>
                <Route path="/dashboard" component={DashboardScene} exact />
                <Route path="/music" component={music} />
                <Route component={NotFound} />
            </Switch>
        );
    }
}
