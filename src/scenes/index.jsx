import { Route, Switch, Redirect } from 'react-router-dom';
const DashboardScene = asyncComponent(() => import(/* webpackChunkName: "dashboard" */ './home'));
const MusicRecommendScenes = asyncComponent(() =>
    import(/* webpackChunkName: "music-recommend" */ './music/recommend')
);

const NotFound = props => <div>404 {JSON.stringify(props.location, null, 2)}</div>;

export default class AppScenes extends React.PureComponent {
    render() {
        return (
            <Switch>
                <Route path="/dashboard" component={DashboardScene} exact />
                <Route path="/music" component={MusicRecommendScenes} exact />
                <Route path="/music/recommend" component={MusicRecommendScenes} exact />
                <Redirect from="/music" to="/music/recommend" exact />
                <Route component={NotFound} />
            </Switch>
        );
    }
}
