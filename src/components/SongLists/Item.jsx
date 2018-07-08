import classNames from 'classnames';
import { formatDuration } from 'utils/index.js';

import Thumb from 'components/Thumb';
import AlbumLink from 'components/AlbumLink';
import PlayControl from 'components/PlayControl';
import { Spinner } from 'components/Spinner';
import Singer from 'components/SingerLink';

import styles from './item.less';

export default class SongItem extends React.PureComponent {
    displayName = 'SongItemPureComponent';
    static defaultProps = {
        showAlbum: false,
        showNumber: false
    };
    handlePlay = music => {
        this.props.playSong(music);
    };
    renderPlayState(music, playerState, playingSongId) {
        let content = null;
        if (playingSongId === music.id && playerState) {
            content = <Spinner playState={playerState} />;
        }
        return content;
    }
    render() {
        const { data, playerState, playingSongId, showAlbum, className, showNumber, index } = this.props;
        const disabled = playerState === 'pending' && playingSongId === data.id;
        const playCtrl = (
            <PlayControl
                musicId={data.id}
                className={styles['playlist-item-control']}
                playState={playerState}
                currentPlay={playingSongId}
                disabled={disabled}
                onPlay={() => this.handlePlay(data)}
                size="small"
            />
        );
        const clsStr = classNames(styles['song-item'], className, {
            [styles['item-with-album']]: showAlbum,
            [styles['item-with-number']]: showNumber
        });
        // with
        return (
            <article className={clsStr} key={data.id}>
                {showNumber && <span className="number">{index}</span>}
                <Thumb source={data.al.picUrl} size="60y60" playCtrl={playCtrl} lazyload />
                <div className={styles['song-info']}>
                    <a className={styles['song-name']} href="?13131">
                        {data.name}
                    </a>
                    <div className={styles['song-meta']}>
                        <Singer data={data.ar} />
                    </div>
                </div>
                {showAlbum && (
                    <span className={styles.album}>
                        <AlbumLink data={data.al} />
                    </span>
                )}
                <div className={styles['song-extra']}>
                    {this.renderPlayState(data, playerState, playingSongId)}
                    <span className={styles.duration}>{formatDuration(data.dt)}</span>
                </div>
            </article>
        );
    }
}
