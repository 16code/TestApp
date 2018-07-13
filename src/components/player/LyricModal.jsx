import Modal from 'components/Modal';
import Lyric from 'components/Lyric';

export default class LyricModal extends React.Component {
    state = { isFirstRender: true };
    componentDidMount() {
        this.modalContainer = document.getElementById('page-content-wrapper');
        if (this.modalContainer) {
            this.setState({ container: this.modalContainer });
        }
    }
    static getDerivedStateFromProps(props, state) {
        if (props.visible && state.isFirstRender) {
            return {
                isFirstRender: false
            };
        }
        return null;
    }
    shouldComponentUpdate(nextProps) {
        const { visible, data, playingSongId, isFetching, playerState } = this.props;
        return (
            nextProps.visible !== visible ||
            (data && data.id !== nextProps.data.id) ||
            playingSongId !== nextProps.playingSongId ||
            playerState !== nextProps.playerState ||
            isFetching !== nextProps.isFetching
        );
    }
    render() {
        const { container, isFirstRender } = this.state;
        const { visible, data, playerState, playingSongId, onClose, isFetching } = this.props;
        if (isFirstRender) return null;
        return (
            <Modal
                title="当前播放"
                header={null}
                visible={visible}
                getContainer={container}
                className="lyric-modal"
                overlay={false}
            >
                <Lyric
                    data={data}
                    visible={visible}
                    isFetching={isFetching}
                    playerState={playerState}
                    playingSongId={playingSongId}
                    onCloseModal={onClose}
                />
            </Modal>
        );
    }
}
LyricModal.displayName = 'LyricModal';
