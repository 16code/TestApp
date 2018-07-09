import Box from 'components/Box';
import SongList from 'components/SongLists';
import { FullSpinner } from 'components/Spinner';
import PrimaryLayout from 'layouts/PrimaryLayout';
import SongService from 'services/api/song.service';

export default class MusicRecommend extends React.PureComponent {
    state = {
        topSongs: []
    };
    pagination = { category: 'new' };
    componentDidMount() {
        this.requestData();
    }
    async requestData() {
        this.setState({ isFetching: true });
        const result = await SongService.list(this.pagination);
        this.setState({
            topSongs: result.data,
            isFetching: false
        });
    }
    renderSong = item => {
        return <SongList.Item data={item} showAlbum />;
    };
    render() {
        const { topSongs, isFetching } = this.state;
        return (
            <PrimaryLayout>
                <Box style={{ height: '100%' }}>
                    <SongList dataSource={topSongs} loading={isFetching} renderItem={this.renderSong} rowKey="id" />
                    <FullSpinner visible={isFetching} />
                </Box>
            </PrimaryLayout>
        );
    }
}
