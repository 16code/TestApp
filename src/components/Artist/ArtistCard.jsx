import Thumb from 'components/Thumb';
import { SingerLinkCard } from 'components/SingerLink';
import styles from './styles.less';

export default class ArtistCard extends React.PureComponent {
    renderItem() {
        const { dataSource = [] } = this.props;
        return dataSource.map(item => (
            <article className={styles['artist-item']} key={item.id}>
                <SingerLinkCard data={item} className={styles.artist}>
                    <Thumb source={`/api/artist/artistimg?url=${item.img1v1Url}`} size="60y60" lazyload />
                    <span>{item.name}</span>
                </SingerLinkCard>
            </article>
        ));
    }
    render() {
        return <section className={styles['artist-cards']}>{this.renderItem()}</section>;
    }
}
