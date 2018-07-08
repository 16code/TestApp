import Box from 'components/Box';
import SongList from 'components/SongLists';
import InfiniteScroll from 'components/InfiniteScroll';
import { ListLoading } from 'components/Spinner';
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
        const { isFetching, total, topSongs } = this.state;
        if (isFetching) return;
        if (topSongs.length === total) {
            this.setState({ allDataLoaded: true, isFetching: false });
            return;
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
                <Box title="推荐新音乐">
                    <InfiniteScroll
                        scrollThreshold={50}
                        onScrollEnd={this.handleScrollEnd}
                        loading={isFetching}
                        destroy={allDataLoaded}
                    >
                        <SongList dataSource={topSongs} loading={isFetching} renderItem={this.renderSong} rowKey="id" />
                    </InfiniteScroll>
                    {!allDataLoaded && <ListLoading loading={isFetching} />}
                </Box>
            </div>
        );
    }
}
