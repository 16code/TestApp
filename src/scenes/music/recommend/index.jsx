import Box from 'components/Box';
import SongList from 'components/SongLists';
import InfiniteScroll from 'components/InfiniteScroll';
import SongService from 'services/api/song.service';

export default class MusicRecommend extends React.PureComponent {
    state = {};
    componentDidMount() {
        this.getTopSongs();
    }
    async getTopSongs() {
        const result = await SongService.list({ limit: 12, offset: 1, id: 1, category: 'new' });
        this.setState({ topSongs: result.data });
    }
    renderSong = item => {
        return <SongList.Item data={item} showAlbum />;
    };
    handleScrollEnd = pos => {
        console.log(pos);
    };
    render() {
        const { topSongs } = this.state;
        return (
            <div className="music-recommend">
                <Box title="每日推荐">
                    <InfiniteScroll scrollThreshold={100} onScrollEnd={this.handleScrollEnd}>
                        <SongList dataSource={topSongs} renderItem={this.renderSong} rowKey="id" />
                    </InfiniteScroll>
                </Box>
            </div>
        );
    }
}
