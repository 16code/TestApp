import Box from 'components/Box';
import SongList from 'components/SongLists';
import InfiniteScroll from 'components/InfiniteScroll';
import SongService from 'services/api/song.service';

export default class MusicRecommend extends React.PureComponent {
    state = {
        topSongs: []
    };
    pagination = { category: 'new', limit: 10, offset: 0 };
    componentDidMount() {
        this.requestData();
    }
    async requestData() {
        this.setState({ isFetching: true });
        const result = await SongService.list(this.pagination);
        this.setState(prevState => ({
            topSongs: prevState.topSongs.concat(result.data),
            total: result.total,
            isFetching: false
        }));
    }
    renderSong = item => {
        return <SongList.Item data={item} showAlbum />;
    };
    handleScrollEnd = () => {
        console.log('loading');
        const { isFetching, total, topSongs } = this.state;
        if (isFetching) return;
        if (topSongs.length === total) {
            return this.setState({ allDataLoaded: true, isFetching: false });
        }
        this.setState({ isFetching: true }, () => {
            this.pagination.offset = ++this.pagination.offset;
            this.requestData();
        });
    };
    render() {
        const { topSongs, isFetching, allDataLoaded } = this.state;
        return (
            <div className="music-recommend">
                <Box title="每日推荐">
                    <InfiniteScroll
                        scrollThreshold={50}
                        onScrollEnd={this.handleScrollEnd}
                        loading={isFetching}
                        destroy={allDataLoaded}
                    >
                        <SongList dataSource={topSongs} loading={isFetching} renderItem={this.renderSong} rowKey="id" />
                    </InfiniteScroll>
                </Box>
            </div>
        );
    }
}
