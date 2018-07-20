import { Link } from 'react-router-dom';
import Thumb from 'components/Thumb';
import styles from './styles.less';
const Fragment = React.Fragment;

export default class ArtistList extends React.PureComponent {
    renderThumb(item) {
        return (
            <li key={item.id}>
                <Link to={`/music/top/${item.id}`}>
                    <Thumb source={`/api/artist/artistimg?url=${item.img1v1Url}`} size="138y138" lazyload />
                    <span>{item.name}</span>
                </Link>
            </li>
        );
    }
    renderItem() {
        const { dataSource } = this.props;
        const first = dataSource.slice(0, 10);
        const a = first.map(item => {
            return this.renderThumb(item);
        });
        const b = dataSource.slice(10).map(item => {
            return <li key={item.id}>{item.name}</li>;
        });
        return (
            <Fragment>
                <ul className={styles['artist-thumb-list']}>{a}</ul>
                <ul className={styles['artist-text-list']}>{b}</ul>
            </Fragment>
        );
    }
    render() {
        return <div className={styles['artist-list']}>{this.renderItem()}</div>;
    }
}
