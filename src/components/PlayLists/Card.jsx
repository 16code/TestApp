import { connect } from 'react-redux';

import Thumb from 'components/Thumb';
import PlayCount from 'components/PlayCount';
import PlayControl from 'components/PlayControl';
import styles from './card.less';

@connect(({ player }) => ({
    playerState: player.playState,
    currentPlay: player.current
}))
export default class Card extends React.PureComponent {
    handlePlay = () => {
        const { data } = this.props;
        console.log(data);
    };
    static defaultProps = {
        albumSize: '140y140'
    };
    render() {
        const { data, playerState, currentPlay, albumSize } = this.props;
        const meta = <a href="?13131">{data.name}</a>;
        return (
            <article className={styles['playlist-item']} key={data.id}>
                <Thumb source={data.coverImgUrl} size={albumSize} metaExtra={meta} lazyload={false} />
                <PlayCount className={styles['playlist-item-count']} number={data.playCount} />
                <PlayControl
                    size="large"
                    musicId={data.id}
                    className={styles['playlist-item-control']}
                    playerState={playerState}
                    currentPlay={currentPlay}
                    onPlay={this.handlePlay}
                />
            </article>
        );
    }
}
