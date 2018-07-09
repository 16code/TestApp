import { Route, Switch, Redirect } from 'react-router-dom';
const MusicRecommendScenes = asyncComponent(() => import(/* webpackChunkName: "music-recommend" */ './new'));
const MusicTopScenes = asyncComponent(() => import(/* webpackChunkName: "music-top" */ './top'));

export default class AppScenes extends React.PureComponent {
    render() {
        const { match } = this.props;
        return (
            <Switch>
                <Route path={`${match.path}/new`} component={MusicRecommendScenes} />
                <Route path={`${match.path}/top`} component={MusicTopScenes} />
                <Redirect from={match.path} to={`${match.path}/new`} exact />
            </Switch>
        );
    }
}
