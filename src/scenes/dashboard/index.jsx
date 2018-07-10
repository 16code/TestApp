import { safaJsonParse } from 'utils/index.js';
import Box from 'components/Box';
import PlayList from 'components/PlayLists';
import SongList from 'components/SongLists';
import ArtistCard from 'components/Artist/ArtistCard';
import Icon from 'components/Icon';
import { FullSpinner } from 'components/Spinner';
import PrimaryLayout from 'layouts/PrimaryLayout';

export default class Dashboard extends React.PureComponent {
    state = { isFetching: true };
    componentDidMount() {
        this.getDashboardData();
        const {
            data: { latest, topboard, playlist, artists }
        } = safaJsonParse(window.sessionStorage.getItem('Dashboard_DATA'));
        this.setState({ playlist: playlist, topSongs: topboard, newSongs: latest, artists, isFetching: false });
    }
    async getDashboardData() {
        this.setState({ isFetching: true });
        const {
            data: { latest, topboard, playlist, artists }
        } = await fetch('/dashboard').catch(() => this.setState({ isFetching: false }));
        window.sessionStorage.setItem(
            'Dashboard_DATA',
            JSON.stringify({
                data: { latest, topboard, playlist, artists }
            })
        );
        this.setState({ playlist: playlist, topSongs: topboard, newSongs: latest, artists, isFetching: false });
    }
    renderPlaylist = item => {
        return <PlayList.Card data={item} />;
    };
    renderSong = item => {
        return <SongList.Item albumSize="52y52" data={item} />;
    };
    render() {
        const { playlist, topSongs, newSongs, artists, isFetching } = this.state;
        if (isFetching) return <FullSpinner visible />;
        return (
            <PrimaryLayout>
                <div className="grid grid-app-home-layout">
                    <Box
                        title="推荐歌单"
                        extra={
                            <a href="#">
                                <Icon type="more" />
                            </a>
                        }
                    >
                        <PlayList
                            title="推荐歌单"
                            itemLayout="horizontal"
                            dataSource={playlist}
                            loading={isFetching}
                            renderItem={this.renderPlaylist}
                            rowKey="id"
                        />
                    </Box>
                    <Box
                        title="云音乐热歌榜"
                        extra={
                            <a href="#">
                                <Icon type="more" />
                            </a>
                        }
                    >
                        <SongList dataSource={topSongs} loading={isFetching} renderItem={this.renderSong} rowKey="id" />
                    </Box>
                    <Box
                        title="新曲推荐"
                        extra={
                            <a href="#">
                                <Icon type="more" />
                            </a>
                        }
                    >
                        <SongList dataSource={newSongs} loading={isFetching} renderItem={this.renderSong} rowKey="id" />
                    </Box>
                    <Box
                        title="推荐歌手"
                        extra={
                            <a href="#">
                                <Icon type="more" />
                            </a>
                        }
                    >
                        <ArtistCard dataSource={artists} />
                    </Box>
                </div>
            </PrimaryLayout>
        );
    }
}
