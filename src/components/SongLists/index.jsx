import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { actions as playerActions } from 'reducers/playerState';
import ListBase from '../ListBase';
import Item from './Item';
import History from './History';
import styles from './styles.less';

@connect(
    ({ player }) => ({
        playerState: player.playerState,
        playingSongId: player.playingSongId
    }),
    { playSong: playerActions.playSong }
)
export default class SongList extends ListBase {
    static Item = Item;
    static History = History;
    static propTypes = {
        dataSource: PropTypes.array
    };
    static defaultProps = {
        dataSource: []
    };
    shouldComponentUpdate(nextProps) {
        const { dataSource, playerState, playingSongId, loading, allDataLoaded } = nextProps;
        return (
            dataSource.length !== this.props.dataSource.length ||
            playerState !== this.props.playerState ||
            playingSongId !== this.props.playingSongId ||
            loading !== this.props.loading ||
            allDataLoaded !== this.props.allDataLoaded
        );
    }
    render() {
        const clsStr = classNames(styles['ui-songlists'], this.props.className);
        return <section className={clsStr}>{this.renderChildrenContent()}</section>;
    }
}
