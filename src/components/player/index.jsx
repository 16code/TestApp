import { connect } from 'react-redux';
import classNames from 'classnames';
import { formatTime, bindEvents, removeEvents } from 'utils';
import { actions as playerActions } from 'reducers/playerState';
import { actions as lyricBoxActions } from 'reducers/lyricBox';
import PlayControl from 'components/PlayControl';
import RangeSlider from 'components/RangeSlider';
import VolumeControl from './Volume';
import Playlist from './Playlist';
import LyricModal from './LyricModal';
import PlayerThumb from './PlayerThumb';
import styles from './styles.less';

@connect(
    ({ player, lyricBox }) => ({
        volume: player.volume,
        canPlaying: player.canPlaying,
        playerState: player.playerState,
        playingSongId: player.playingSongId,
        playingSongData: player.playingSongData,
        listRepeatState: player.listRepeatState,
        playListSongs: player.playListByMusic,
        songFetching: player.songFetching,
        lyricBoxVisible: lyricBox.visible
    }),
    {
        changePendingToPlaying: playerActions.changePendingToPlaying,
        changePlayerCanPlay: playerActions.changePlayerCanPlay,
        playSong: playerActions.playSong,
        playNextOrPrevSong: playerActions.playNextOrPrevSong,
        playerStop: playerActions.playerStop,
        changeVolume: playerActions.changeVolume,
        changeRepeatMode: playerActions.changeRepeatMode,
        toggleLrcBoxVisible: lyricBoxActions.toggleVisible
    }
)
export class AudioPlayer extends React.PureComponent {
    mediaPlayerRef = React.createRef();
    playerBoxRef = React.createRef();
    playerProgressBarRef = React.createRef();
    static defaultProps = {
        audioProps: {
            controls: false,
            preload: 'auto'
        }
    };
    state = { playListVisible: false };
    cachedRepaatModeIcons = {};
    events = () => {
        return {
            progress: this.onProgress,
            durationchange: this.onLoadedMetaData,
            timeupdate: this.onPlayerTimeUpdate,
            canplay: () => {
                const { playerState, changePlayerCanPlay, canPlaying, changePendingToPlaying } = this.props;
                if (!canPlaying) changePlayerCanPlay(true);
                if (playerState === 'pending') changePendingToPlaying('playing');
            },
            ended: () => {
                this.props.playerStop('stoped');
            }
        };
    };
    componentDidMount() {
        this.mediaPlayer = this.mediaPlayerRef.current;
        this.playerProgressBar = this.playerProgressBarRef.current.progressBar;
        const playerBox = this.playerBoxRef.current;
        this.currentTimeElement = playerBox.querySelector('#audio-current-time');
        this.totalTimeElement = playerBox.querySelector('#audio-duration-titme');
        this.preloadedBarElement = playerBox.querySelector('#audio-preload-bar');
        bindEvents(this.mediaPlayer, this.events());
        this.updateVolume(this.props.volume);
    }
    componentWillUnmount() {
        removeEvents(this.mediaPlayer, this.events());
    }
    componentDidUpdate(prevProps) {
        const { playerState, playingSongId } = this.props;
        if (!prevProps.playerState || prevProps.playerState === playerState) return;

        if (prevProps.playingSongId !== playingSongId) {
            this.doPause();
        }

        switch (playerState) {
            case 'paused':
                this.doPause();
                break;
            case 'playing':
                this.doPlay();
                break;
            case 'stoped':
                this.doStop();
                break;
        }
    }
    doPlay() {
        this.mediaPlayer.play();
    }
    doPause() {
        this.mediaPlayer.pause();
    }
    doStop() {
        this.doPause();
        this.mediaPlayer.currentTime = 0;
    }
    // 播放音乐
    handlePlayBtnClick = () => {
        const { playingSongId } = this.props;
        if (playingSongId) {
            this.props.playSong({ id: playingSongId });
        }
    };
    // 切换播放模式
    handleChangeRepeatMode = () => {
        const { listRepeatState, changeRepeatMode } = this.props;
        changeRepeatMode(listRepeatState);
    };
    // 音量调整
    handleVolumeChange = value => {
        this.props.changeVolume(value);
        this.updateVolume(value);
    };
    // 进度条拖拽回调
    handleProgressMoved = ({ eventType, origin: percentageNum }) => {
        if (eventType === 'dragStart') {
            this.disableTimeupdate = true;
        } else {
            const { duration } = this.mediaMetaInfo;
            const currentTime = duration * percentageNum;
            this.updatePlayedTime(currentTime);
            if (eventType === 'dragEnd') {
                this.disableTimeupdate = false;
                this.mediaPlayer.currentTime = currentTime || 0;
            }
        }
    };
    // 切换播放列表
    handleTogglePlaylist = () => {
        this.setState(p => ({ playListVisible: !p.playListVisible }));
    };
    // 播放上一曲下一曲
    handlePlayPrevAndNext = type => {
        this.props.playNextOrPrevSong(type);
    };
    onPlayerTimeUpdate = () => {
        const { currentTime, duration } = this.mediaMetaInfo;
        if (!this.disableTimeupdate) {
            this.updatePlayedTime(currentTime);
            const offset = calcProgressPos(currentTime, duration);
            this.updateProgressBar(offset);
        }
    };
    // 更新当前播放的时间
    updatePlayedTime = currentTime => {
        this.currentTimeElement.textContent = formatTime(currentTime);
    };
    // 更新进度条
    updateProgressBar = offset => {
        this.playerProgressBar.style.width = offset;
    };
    // 加载音频元数据
    onLoadedMetaData = () => {
        const { duration } = this.mediaMetaInfo;
        this.totalTimeElement.textContent = formatTime(duration);
        this.onProgress();
    };
    onProgress = () => {
        const { buffered, duration } = this.mediaMetaInfo;
        updatePreloadBar(buffered, duration, this.preloadedBarElement);
    };
    updateVolume = v => {
        const volume = v / 100;
        this.mediaPlayer.volume = volume;
    };
    // 获取媒体信息
    get mediaMetaInfo() {
        const { buffered, duration, currentTime, currentSrc } = this.mediaPlayer;
        return { buffered, duration, currentTime, currentSrc };
    }
    get playerIsPaused() {
        return this.mediaPlayer.paused;
    }
    createRepeatModeClass = mode => {
        const cls = classNames('iconplayer', `icon-${mode}`);
        this.cachedRepaatModeIcons[mode] = cls;
        return cls;
    };
    getRepeatModeClass = mode => {
        const cached = this.cachedRepaatModeIcons[mode];
        return cached ? cached : this.createRepeatModeClass(mode);
    };
    handleToggleLrcBox = () => {
        this.props.toggleLrcBoxVisible();
    };
    get songInfo() {
        const { playingSongData, lyricBoxVisible } = this.props;
        return (
            playingSongData &&
            playingSongData.id && (
                <PlayerThumb
                    onClick={this.handleToggleLrcBox}
                    lyricModalVisible={lyricBoxVisible}
                    key="playerThumb"
                    data={playingSongData}
                />
            )
        );
    }
    render() {
        const {
            audioProps,
            playingSongId,
            playerState,
            volume,
            listRepeatState,
            playListSongs,
            playingSongData,
            songFetching,
            lyricBoxVisible
        } = this.props;
        const { media: mediaSourceUrl } = playingSongData || {};
        const repeatModeIonClass = this.getRepeatModeClass(listRepeatState);
        const btnDisabled = !playListSongs.length;
        return [
            <div className={styles['audio-player']} ref={this.playerBoxRef} key="audioPlayerBox">
                <div className={classNames(styles['player-controls'], styles['left-controls'])}>
                    <button
                        className={styles['control-button']}
                        title="上一曲"
                        role="button"
                        disabled={btnDisabled}
                        onClick={() => this.handlePlayPrevAndNext('prev')}
                    >
                        <i className="iconplayer icon-skip-back" />
                    </button>
                    <PlayControl
                        musicId={playingSongId}
                        currentPlay={playingSongId}
                        playState={playerState}
                        disabled={playerState === 'pending'}
                        onPlay={this.handlePlayBtnClick}
                        size="middle"
                        theme="dark"
                        className="control-playpause"
                        overlay={false}
                    />
                    <button
                        className={styles['control-button']}
                        title="下一曲"
                        role="button"
                        disabled={btnDisabled}
                        onClick={() => this.handlePlayPrevAndNext('next')}
                    >
                        <i className="iconplayer icon-skip-forward" />
                    </button>
                </div>
                <div className={styles['player-extra']}>
                    <span id="audio-current-time" className={classNames(styles['player-time'], styles.current)}>
                        00:00
                    </span>
                    <RangeSlider
                        ref={this.playerProgressBarRef}
                        percentage={0}
                        onChange={this.handleProgressMoved}
                        disabled={!playingSongId || !mediaSourceUrl}
                    >
                        <span id="audio-preload-bar" className={styles['bar-preload']} />
                    </RangeSlider>
                    <span id="audio-duration-titme" className={classNames(styles['player-time'], styles.duration)}>
                        00:00
                    </span>
                </div>
                <div className={classNames(styles['player-controls'], styles['right-controls'])}>
                    <VolumeControl onChange={this.handleVolumeChange} volume={volume} />
                    <button
                        className={styles['control-button']}
                        title="循环模式"
                        role="button"
                        onClick={this.handleChangeRepeatMode}
                    >
                        <i className={repeatModeIonClass} />
                    </button>
                    <button
                        className={styles['control-button']}
                        title="播放列表"
                        role="button"
                        onClick={this.handleTogglePlaylist}
                    >
                        <i className="iconplayer icon-queue" />
                    </button>
                </div>
                <audio
                    src={mediaSourceUrl}
                    {...audioProps}
                    loop={listRepeatState === 'repeatonce'}
                    ref={this.mediaPlayerRef}
                />
                <Playlist
                    onClose={this.handleTogglePlaylist}
                    visible={this.state.playListVisible}
                    dataSource={playListSongs}
                />
                <LyricModal
                    visible={lyricBoxVisible}
                    isFetching={songFetching}
                    data={playingSongData}
                    playerState={playerState}
                    playingSongId={playingSongId}
                    onClose={this.handleToggleLrcBox}
                />
            </div>,
            this.songInfo
        ];
    }
}

function calcProgressPos(currentTime, duration) {
    return `${(currentTime / duration) * 100}%`;
}
function updatePreloadBar(buffered, duration, ele) {
    if (!ele) return;
    const ranges = [];
    for (let i = 0; i < buffered.length; i++) {
        ranges.push([buffered.start(i), buffered.end(i)]);
    }
    for (let i = 0; i < buffered.length; i++) {
        const pos = Math.round((100 / duration) * (ranges[i][1] - ranges[i][0]));
        ele.style.width = `${pos}%`;
    }
}
