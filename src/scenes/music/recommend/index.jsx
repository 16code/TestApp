import Box from 'components/Box';
import SongList from 'components/SongLists';
import SongService from 'services/api/song.service';

export default class MusicRecommend extends React.PureComponent {
    state = {};
    componentDidMount() {
        this.getTopSongs();
    }
    async getTopSongs() {
        const result = await SongService.list({ limit: 200, offset: 1, id: 1, category: 'top' });
        this.setState({ topSongs: result.data });
    }
    renderSong = item => {
        return <SongList.Item data={item} showAlbum />;
    };
    handleProgressMoved = data => {
        console.log(data);
    };
    render() {
        const { topSongs } = this.state;
        return (
            <div className="music-recommend">
                <Box title="云音乐热歌榜">
                    <SongList title="云音乐热歌榜" dataSource={topSongs} renderItem={this.renderSong} rowKey="id">
                        topSongs
                    </SongList>
                </Box>
            </div>
        );
    }
}
