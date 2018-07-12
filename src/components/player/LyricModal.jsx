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
        const { playingSongId, visible } = this.props;
        return nextProps.playingSongId !== playingSongId || nextProps.visible !== visible;
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
