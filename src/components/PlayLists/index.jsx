import PropTypes from 'prop-types';
import Card from './Card';
import ListBase from '../ListBase';
import styles from './styles.less';

export default class PlayList extends ListBase {
    static Card = Card;
    static propTypes = {
        dataSource: PropTypes.array,
        itemLayout: PropTypes.oneOf(['vertical', 'horizontal'])
    };
    static defaultProps = {
        dataSource: [],
        itemLayout: 'vertical'
    };
    scrollingWrapper = React.createRef();
    getWrapperStyles(itemLayout, len) {
        const isHorizontalLayout = itemLayout === 'horizontal';
        const styleStr = isHorizontalLayout
            ? {
                'grid-template-columns': `repeat(${len}, minmax(1.4rem, 1fr))`
            }
            : { width: '100%' };

        return Object.keys(styleStr)
            .map(key => `${key}: ${styleStr[key]}`)
            .join(' ');
    }
    componentDidUpdate() {
        const { itemLayout, dataSource } = this.props;
        const wrap = this.scrollingWrapper.current;
        wrap.setAttribute('style', this.getWrapperStyles(itemLayout, dataSource.length));
    }
    render() {
        const { itemLayout } = this.props;
        const isHorizontalLayout = itemLayout === 'horizontal';
        const content = isHorizontalLayout ? (
            <div ref={this.scrollingWrapper} className={styles['scrolling-wrapper']}>
                {this.renderChildrenContent()}
            </div>
        ) : (
            this.renderChildrenContent()
        );
        return (
            <section className={styles['ui-playlists']} data-layout={itemLayout}>
                {content}
            </section>
        );
    }
}
