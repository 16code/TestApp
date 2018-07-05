import Modal from 'components/Modal';
import Lyric from 'components/Lyric';
import { withRouter } from 'react-router-dom';

class LyricModal extends React.PureComponent {
    state = { isFirstRender: true };
    componentDidMount() {
        this.modalContainer = document.getElementById('page-content-wrapper');
        if (this.props.visible) this.bindEvent();
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
    componentWillUnmount() {
        this.removeEvent();
    }
    componentDidUpdate() {
        if (this.props.visible) this.bindEvent();
    }
    bindEvent() {
        const { history, onClose } = this.props;
        this.historyListen = history.listen(() => {
            if (this.props.visible) {
                onClose && onClose();
                this.removeEvent();
            }
        });
    }
    removeEvent() {
        this.historyListen && this.historyListen();
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
export default withRouter(LyricModal);
