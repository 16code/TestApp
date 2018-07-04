import { connect } from 'react-redux';
import classNames from 'classnames';
import Singer from 'components/SingerLink';
import { actions as playerActions } from 'reducers/playerState';
import Icon from 'components/Icon';
import Lyric from './lyric';

import styles from './styles.less';
@connect(
    ({ player }) => ({
        mediaSourceLrc: player.mediaSourceLrc,
        playingSongId: player.playingSongId,
        playingSongData: player.playingSongData,
        playListSongs: player.playListByMusic,
        playerState: player.playerState
    }),
    {
        fetchLrc: playerActions.fetchLrc
    }
)
export default class MusicNew extends React.PureComponent {
    static defaultProps = {
        mediaSourceLrc: {}
    };
    state = { imgUrl: require('../../../asstes/default.jpg') };
    lrcScrollBoxRef = React.createRef();
    componentDidMount() {
        const { playingSongId, mediaSourceLrc } = this.props;
        this.lrc = new Lyric({
            container: document.querySelector(`.${styles['lyrics-box']}`),
            scrollBox: this.lrcScrollBoxRef.current,
            lrcMaxVisibleLine: 10,
            lrcLineHeight: 0.28
        });
        this.audio = document.querySelector('audio');
        this.audio.addEventListener('ended', this.onEnd);
        if ((playingSongId && !mediaSourceLrc) || (mediaSourceLrc && mediaSourceLrc.id !== playingSongId)) {
            this.loadLrcData(playingSongId);
        } else if (playingSongId && mediaSourceLrc.lrcData) {
            this.lrc.setOption({ lrcData: Lyric.parseLyric(mediaSourceLrc.lrcData) });
        }
        this.loadCoverImg();
        this.audio.addEventListener('timeupdate', this.onTimeUpdate);
    }
    componentDidUpdate(prevProps) {
        const { mediaSourceLrc, playingSongId } = this.props;
        if (playingSongId !== prevProps.playingSongId) {
            this.loadLrcData(playingSongId);
            this.loadCoverImg();
        }
        if ((mediaSourceLrc && mediaSourceLrc.id) !== (prevProps.mediaSourceLrc && prevProps.mediaSourceLrc.id)) {
            this.lrc.setOption({ lrcData: Lyric.parseLyric(mediaSourceLrc.lrcData) });
        }
    }
    componentWillUnmount() {
        this.audio.removeEventListener('timeupdate', this.onTimeUpdate);
        this.audio.removeEventListener('ended', this.onEnd);
        this.lrc = null;
    }
    loadLrcData(id) {
        this.props.fetchLrc(id);
    }
    onEnd = () => {
        this.onTimeUpdate(0);
    };
    onTimeUpdate = time => {
        const currentTime = time === 0 ? 0 : this.audio.currentTime;
        this.lrc.update(currentTime);
    };
    loadCoverImg = () => {
        const { picUrl } = this.songInfo;
        if (!picUrl) return;
        this.setState({ fetchCoverImg: true }, () => {
            const img = new Image();
            img.onload = () => {
                this.setState({ imgUrl: img.src, fetchCoverImg: false });
            };
            img.src = `${picUrl}?param=300y300&quality=60`;
        });
    };
    get songInfo() {
        const { playingSongId, playListSongs } = this.props;
        if (playingSongId && playListSongs) {
            const { name, ar, al } = this.props.playingSongData;
            return {
                name,
                picUrl: al.picUrl,
                al,
                ar
            };
        }
        return {};
    }
    render() {
        const classStr = classNames(styles.cover, {
            [[styles['cover-loading']]]: this.state.fetchCoverImg
        });
        const { name, ar, al } = this.songInfo;
        return (
            <div className={styles['music-details']}>
                <div className={styles['music-meta']}>
                    <h2>{name}</h2>
                    <div className={styles.meta}>
                        {ar && (
                            <span className={styles.singer}>
                                歌手: <Singer data={ar} />{' '}
                            </span>
                        )}
                        {al && <span className={styles.album}>专辑: {al.name} </span>}
                    </div>
                </div>
                <div className={styles['music-lyrics']}>
                    <div className={styles['album-box']} data-state={this.props.playerState}>
                        <div className={classStr}>
                            <span className={styles.tonearm} />
                            <figure className={styles.album}>
                                {this.state.imgUrl && <img src={this.state.imgUrl} />}
                            </figure>
                            <figure className={styles.cd}>
                                {this.state.imgUrl && (
                                    <img src={this.state.imgUrl} className={styles['vinyl-discCover']} />
                                )}
                            </figure>
                        </div>
                        <div className={styles.actions}>
                            <button className={styles.btn} role="button">
                                <Icon className={styles.icon} type="like" />
                            </button>
                            <button className={styles.btn} role="button">
                                <Icon className={styles.icon} type="download" />
                            </button>
                            <button className={styles.btn} role="button">
                                <Icon className={styles.icon} type="share" />
                            </button>
                            <button className={styles.btn} role="button">
                                <Icon className={styles.icon} type="folder-add" />
                            </button>
                        </div>
                    </div>
                    <div className={styles['lyrics-box']}>
                        <ul ref={this.lrcScrollBoxRef} className={styles.scrollbox} />
                    </div>
                </div>
            </div>
        );
    }
}
