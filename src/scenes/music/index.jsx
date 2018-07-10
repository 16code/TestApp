import { Route, Switch, Redirect } from 'react-router-dom';

const recommendScenes = asyncComponent(() => import(/* webpackChunkName: "music-recommend" */ './new'));
const topScenes = asyncComponent(() => import(/* webpackChunkName: "music-top" */ './top'));

export default class AppScenes extends React.PureComponent {
    render() {
        const { match } = this.props;
        return (
            <Switch>
                <Redirect from={match.url} to={`${match.url}/new`} exact />
                <Route path={`${match.url}/new`} component={recommendScenes} />
                <Route path={`${match.url}/top`} component={topScenes} />
                <Route path="*" render={() => <Redirect to="/404" />} />
            </Switch>
        );
    }
}
