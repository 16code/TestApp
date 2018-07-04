import Box from 'components/Box';
import PlayList from 'components/PlayLists';
import SongList from 'components/SongLists';
import PlaylistService from 'services/api/playlist.service';
import SongService from 'services/api/song.service';

export default class HomeScenes extends React.PureComponent {
    state = {};
    componentDidMount() {
        this.getPlaylist();
        this.getTopSongs();
        this.getNewSongs();
        // this.getArtist();
    }
    async getPlaylist() {
        const result = await PlaylistService.list({ limit: 4, offset: 0 });
        this.setState({ playlist: result.playlists });
    }
    async getTopSongs() {
        const result = await SongService.list({ limit: 12, offset: 2, id: 24, category: 'top' });
        this.setState({ topSongs: result.data });
    }
    async getNewSongs() {
        const result = await SongService.list({ limit: 12, offset: 2, category: 'new' });
        this.setState({ newSongs: result.data });
    }
    // async getArtist() {
    //     const result = await PlaylistService.artist({ limit: 3, offset: 0 });
    //     this.setState({ artists: result.data });
    // }
    renderPlaylist = item => {
        return <PlayList.Card data={item} />;
    };
    renderSong = item => {
        return <SongList.Item data={item} />;
    };
    render() {
        const { playlist, topSongs, newSongs } = this.state;
        return (
            <div>
                <Box
                    title="推荐歌单"
                    extra={
                        <a href="#">
                            <i className="iconfont icon-more" />
                        </a>
                    }
                >
                    <PlayList
                        title="推荐歌单"
                        itemLayout="horizontal"
                        dataSource={playlist}
                        renderItem={this.renderPlaylist}
                        rowKey="id"
                    >
                        131
                    </PlayList>
                </Box>

                <div className="grid grid-app-home-layout">
                    <Box
                        title="云音乐热歌榜"
                        extra={
                            <a href="#">
                                <i className="iconfont icon-more" />
                            </a>
                        }
                    >
                        <SongList title="云音乐热歌榜" dataSource={topSongs} renderItem={this.renderSong} rowKey="id">
                            topSongs
                        </SongList>
                    </Box>
                    <Box
                        title="新曲推荐"
                        extra={
                            <a href="#">
                                <i className="iconfont icon-more" />
                            </a>
                        }
                    >
                        <SongList title="云音乐热歌榜" dataSource={newSongs} renderItem={this.renderSong} rowKey="id">
                            topSongs
                        </SongList>
                    </Box>
                </div>
            </div>
        );
    }
}
