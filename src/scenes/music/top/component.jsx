import DocumentTitle from 'react-document-title';
import Box from 'components/Box';
import SongList from 'components/SongLists';
import { FullSpinner } from 'components/Spinner';
import SongService from 'services/api/song.service';

export default class MusicTop extends React.Component {
    state = {
        pagination: {
            id: 0,
            category: 'top'
        },
        topSongs: [],
        isFetching: true,
        title: ''
    };
    componentDidMount() {
        this.requestData();
    }
    componentDidUpdate() {
        this.pageContent = document.querySelector('.page-content');
        if (!this.state.topSongs.length && !this.state.isFetching) {
            this.requestData();
        }
    }
    static getDerivedStateFromProps(props, state) {
        if (props.match.params.id !== state.pagination.id) {
            return {
                pagination: { id: props.match.params.id, category: 'top' },
                topSongs: []
            };
        }
        return null;
    }
    async requestData() {
        this.pageContent && this.pageContent.scrollTo(0, 0);
        this.setState({ isFetching: true });
        const result = await SongService.list(this.state.pagination);
        this.setState({
            topSongs: result.data,
            title: result.title,
            isFetching: false
        });
    }
    renderSong = (item, index) => {
        return <SongList.Item data={item} index={index + 1} albumSize="46y46" showAlbum showNumber />;
    };
    render() {
        const { topSongs, isFetching, title } = this.state;
        return (
            <DocumentTitle title={`${title} - React Music`}>
                <Box style={{ height: '100%' }}>
                    {!isFetching && (
                        <SongList dataSource={topSongs} loading={isFetching} renderItem={this.renderSong} rowKey="id" />
                    )}
                    <FullSpinner visible={isFetching} />
                </Box>
            </DocumentTitle>
        );
    }
}
