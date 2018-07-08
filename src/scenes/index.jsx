import { Route, Switch, Redirect } from 'react-router-dom';
const DashboardScene = asyncComponent(() => import(/* webpackChunkName: "dashboard" */ './home'));
const MusicRecommendScenes = asyncComponent(() => import(/* webpackChunkName: "music-recommend" */ './music/new'));
const MusicTopScenes = asyncComponent(() => import(/* webpackChunkName: "music-top" */ './music/top'));

const NotFound = props => <div>404 {JSON.stringify(props.location, null, 2)}</div>;

export default class AppScenes extends React.PureComponent {
    render() {
        return (
            <Switch>
                <Route path="/dashboard" component={DashboardScene} exact />
                <Route path="/music" component={MusicRecommendScenes} exact />
                <Route path="/music/new" component={MusicRecommendScenes} exact />
                <Route path="/music/top" component={MusicTopScenes} exact />
                <Redirect from="/music" to="/music/new" exact />
                <Route component={NotFound} />
            </Switch>
        );
    }
}
