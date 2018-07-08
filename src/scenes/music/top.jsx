import Box from 'components/Box';
import SongList from 'components/SongLists';
import InfiniteScroll from 'components/InfiniteScroll';
import { ListLoading } from 'components/Spinner';
import SongService from 'services/api/song.service';

export default class MusicTop extends React.PureComponent {
    state = {
        topSongs: []
    };
    pagination = { category: 'top', id: 24, limit: 10, offset: 0 };
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
    renderSong = (item, index) => {
        return <SongList.Item data={item} index={index + 1} showAlbum showNumber />;
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
                <Box>
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
