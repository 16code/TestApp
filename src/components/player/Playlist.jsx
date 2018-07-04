import { HISTORY_BY_SONG_LIST } from 'common/constants';
import Modal from 'components/Modal';
import SongList from 'components/SongLists';

export default class Playlist extends React.Component {
    state = {
        isFirstRender: true
    };
    componentDidMount() {
        this.modalContainer = document.querySelector('.container-wrapper');
        if (this.modalContainer) {
            this.setState({ container: this.modalContainer });
        }
    }
    shouldComponentUpdate(nextProps) {
        const { visible } = nextProps;
        return visible !== this.props.visible;
    }
    static getDerivedStateFromProps(props, state) {
        const { visible } = props;
        const { isFirstRender } = state;
        if (visible && isFirstRender) {
            return {
                isFirstRender: false
            };
        }
        return null;
    }
    renderSong = item => {
        return <SongList.History data={item} />;
    };
    handleClearHistory = () => {
        window.localStorage.removeItem(HISTORY_BY_SONG_LIST);
    };
    headExtra = () => {
        const { dataSource } = this.props;
        return [
            <span key="total">共{dataSource.length}首歌曲</span>,
            <button key="handle" role="button" onClick={this.handleClearHistory}>
                <i className="iconfont icon-lajixiang" /> 清空
            </button>
        ];
    };
    render() {
        const { isFirstRender, container } = this.state;
        const { dataSource, visible, onClose } = this.props;
        return (
            !isFirstRender && (
                <Modal
                    title="播放列表"
                    headExtra={this.headExtra()}
                    size="small"
                    visible={visible}
                    onClose={onClose}
                    getContainer={container}
                    className="playlist-modal"
                    overlay={false}
                >
                    <SongList dataSource={dataSource} renderItem={this.renderSong} rowKey="id" />
                </Modal>
            )
        );
    }
}
