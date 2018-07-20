import { Route, Switch, Redirect } from 'react-router-dom';

const recommend = asyncComponent(() => import(/* webpackChunkName: "music-recommend" */ './recommend'));
const artists = asyncComponent(() => import(/* webpackChunkName: "music-top" */ './artists'));

export default class AppScenes extends React.PureComponent {
    render() {
        const { match } = this.props;
        return (
            <Switch>
                <Route path={match.url} component={artists} />
                <Route path={`${match.url}/recommend`} component={recommend} />
                <Route path="*" render={() => <Redirect to="/404" />} />
            </Switch>
        );
    }
}
