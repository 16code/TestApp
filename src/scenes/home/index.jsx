import Box from 'components/Box';
import PlayList from 'components/PlayLists';
import SongList from 'components/SongLists';
import Icon from 'components/Icon';
import { FullSpinner } from 'components/Spinner';
export default class HomeScenes extends React.PureComponent {
    state = { isFetching: true };
    componentDidMount() {
        this.getDashboardData();
    }
    async getDashboardData() {
        this.setState({ isFetching: true });
        const {
            data: { latest, topboard, playlist }
        } = await fetch('/dashboard').catch(() => this.setState({ isFetching: false }));
        this.setState({ playlist: playlist, topSongs: topboard, newSongs: latest, isFetching: false });
    }
    renderPlaylist = item => {
        return <PlayList.Card data={item} />;
    };
    renderSong = item => {
        return <SongList.Item data={item} />;
    };
    render() {
        const { playlist, topSongs, newSongs, isFetching } = this.state;
        if (isFetching) return <FullSpinner loading="run" />;
        return (
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
            </div>
        );
    }
}
