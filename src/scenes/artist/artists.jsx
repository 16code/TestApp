import queryString from 'query-string';
import SideLayout from 'layouts/SideLayout';
import { FullSpinner } from 'components/Spinner';

import categories from './data.json';
import ArtistList from './ArtistList';

export default class Artists extends React.PureComponent {
    state = {
        id: 1001,
        dataSource: [],
        isFetching: true
    };
    componentDidMount() {
        const parsed = queryString.parse(this.props.location.search);
        this.getCategories(parsed);
    }
    handleCLick = id => {
        this.setState({ id }, () => {
            this.getCategories();
        });
    };
    async getCategories() {
        this.setState({ isFetching: true });
        const { id } = this.state;
        const result = await fetch(`/artist/categorie/${id}`);
        this.setState({ dataSource: result.data, isFetching: false });
    }
    renderGroup(items) {
        const { id } = this.state;
        return items.map(c => {
            return (
                <li key={c.id} className="categorie-item">
                    <a
                        href="javascript:"
                        onClick={() => this.handleCLick(c.id)}
                        className={`categorie-item ${c.id === id ? 'current' : ''}`}
                    >
                        <span>{c.name}</span>
                    </a>
                </li>
            );
        });
    }
    renderCategories() {
        return (
            <div className="categories">
                {categories.map(c => {
                    return (
                        <div className="categorie-group" key={c.id}>
                            <span className="categorie-group-name">{c.name}</span>
                            <ul className="categorie-group-items">{this.renderGroup(c.children)}</ul>
                        </div>
                    );
                })}
            </div>
        );
    }
    render() {
        const { dataSource, isFetching } = this.state;
        return (
            <SideLayout aside={this.renderCategories()}>
                <ArtistList dataSource={dataSource} />
                {isFetching && <FullSpinner visible={isFetching} />}
            </SideLayout>
        );
    }
}
