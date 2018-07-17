import { Route, NavLink, Redirect } from 'react-router-dom';
import { safaJsonParse } from 'utils/index';
import SideLayout from 'layouts/SideLayout';
import Thumb from 'components/Thumb';
import Component from './component';

export default class MusicTop extends React.PureComponent {
    state = {
        categories: []
    };
    componentDidMount() {
        this.getCategories();
    }
    async getCategories() {
        const result = safaJsonParse(localStorage.getItem('categories')) || (await fetch('/songs/categories'));
        window.localStorage.setItem('categories', JSON.stringify(result));
        this.setState({ categories: result.data });
    }
    renderCategories() {
        return (
            <div className="categories">
                {this.state.categories.map(c => {
                    return (
                        <NavLink
                            activeClassName="current"
                            to={`/music/top/${c.id}`}
                            className="categorie-item"
                            key={c.id}
                        >
                            <Thumb source={c.coverImgUrl} size="26y26" lazyload={false} />
                            <span>{c.name}</span>
                        </NavLink>
                    );
                })}
            </div>
        );
    }
    render() {
        const { match } = this.props;
        return (
            <SideLayout aside={this.renderCategories()}>
                <Route path={`${match.url}/:id([0-9]{0,2})`} component={Component} />
                <Route exact path={match.url} render={() => <Redirect to={`${match.url}/0`} />} />
            </SideLayout>
        );
    }
}
