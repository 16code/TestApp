import classNames from 'classnames';
import { delay } from 'utils/index.js';
import styles from './styles.less';

export default class Modal extends React.PureComponent {
    static defaultProps = {
        visible: false,
        overlay: false,
        header: true
    };
    modalRef = React.createRef();
    state = {
        modalId: `modal-${Math.random()
            .toString(36)
            .substr(2, 7)}`
    };
    componentDidMount() {
        const { visible, overlay } = this.props;
        if (visible && !overlay) {
            this.addEvents();
        }
    }
    componentDidUpdate() {
        const { overlay, visible } = this.props;
        if (!overlay && visible) {
            this.addEvents();
        } else {
            this.removeEvents();
        }
    }
    componentWillUnmount() {
        this.removeEvents();
    }
    addEvents() {
        document.addEventListener('click', this.handleClosePanel);
    }
    removeEvents() {
        document.removeEventListener('click', this.handleClosePanel);
    }
    handleClosePanel = event => {
        const article = event.target.closest(`#${this.state.modalId}`);
        if (article) return;
        const { onClose } = this.props;
        if (onClose) this.props.onClose();
    };
    get renderMask() {
        const { visible } = this.props;
        const maskCls = classNames(styles['modal-mask'], { [styles.visible]: visible });
        return <div className={maskCls} key="modalMask" onClick={this.handleClosePanel} />;
    }
    get renderChild() {
        const { children, className, visible, title, headExtra, header } = this.props;
        let modalCls = classNames(styles['modal-content'], className, { visible: visible });
        if (!this.modalRef.current && visible) {
            modalCls = modalCls.replace('visible', '');
            delay(0).then(() => {
                this.modalRef.current.classList.add('visible');
            });
        }
        const bodyCls = classNames(styles['modal-body'], { [styles['modal-with-header']]: header });
        return (
            <div className={modalCls} key="modalContent" id={this.state.modalId} ref={this.modalRef}>
                <div className={styles['modal-children-content']}>
                    {header && (
                        <div className={styles['modal-head']}>
                            {title && <h2 className={styles['modal-title']}>{title}</h2>}
                            {headExtra && <div className={styles['modal-head-extra']}>{headExtra}</div>}
                        </div>
                    )}
                    <div className={bodyCls}>{children}</div>
                </div>
            </div>
        );
    }
    render() {
        const el = this.props.getContainer || document.body;
        if (!el) return null;
        el.style.position = 'relative';
        const content = [this.renderChild];
        if (this.props.overlay) content.push(this.renderMask);
        return ReactDOM.createPortal(content, el);
    }
}
