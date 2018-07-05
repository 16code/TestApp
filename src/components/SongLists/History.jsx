import classNames from 'classnames';
import { formatDuration } from 'utils';
import Thumb from 'components/Thumb';
import PlayControl from 'components/PlayControl';
import Singer from 'components/SingerLink';
import styles from './history.less';

export default class SongHistoryItem extends React.PureComponent {
    displayName = 'SongItemHistoryPureComponent';
    handlePlay = music => {
        this.props.playSong(music);
    };
    render() {
        const { data, playerState, playingSongId } = this.props;
        const disabled = playerState === 'pending' && playingSongId === data.id;
        const playCtrl = (
            <PlayControl
                musicId={data.id}
                className={styles['history-item-control']}
                playState={playerState}
                currentPlay={playingSongId}
                disabled={disabled}
                onPlay={() => this.handlePlay(data)}
                size="small"
            />
        );
        return (
            <article
                className={classNames(styles['song-history-item'], {
                    [styles.current]: playingSongId === data.id
                })}
                key={data.id}
            >
                <Thumb source={data.al.picUrl} size="42y42" playCtrl={playCtrl} />
                <div className={styles['song-info']}>
                    <span className={styles['song-name']}>{data.name}</span>
                    <div className={styles['song-meta']}>
                        <Singer data={data.ar} />
                    </div>
                </div>
                <div className={styles['song-extra']}>
                    <span className={styles.duration}>{formatDuration(data.dt)}</span>
                </div>
            </article>
        );
    }
}
