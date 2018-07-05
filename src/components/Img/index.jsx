import throttle from 'lodash/throttle';
import scrollParent from 'utils/scrollParent';
export default class Img extends React.Component {
    imgElementRef = React.createRef();
    visible = false;
    static defaultProps = {
        lazyload: false
    };
    componentDidMount() {
        this.imgElement = this.imgElementRef.current;
        if (this.props.lazyload) {
            this.content = scrollParent(this.imgElement) || document.getElementById('page-content-inner');
            this.addEvent();
        }
    }
    shouldComponentUpdate(nextProps) {
        return !this.visible && this.props.src !== nextProps.src;
    }
    componentWillUnmount() {
        this.props.lazyload && this.removeEvent();
    }
    addEvent = () => {
        this.throttled = throttle(this.loadImg, 200);
        this.content.addEventListener('scroll', this.throttled, { passive: true });
        this.throttled();
    };
    removeEvent = () => {
        this.throttled && this.throttled.cancel;
        this.content.removeEventListener('scroll', this.throttled, { passive: true });
    };
    loadImg = () => {
        if (this.visible) return;
        const inView = isElementInViewport(this.imgElement, this.content);
        if (inView) {
            const { src } = this.props;
            const image = new Image();
            image.onload = () => {
                this.removeEvent();
                this.visible = true;
                this.imgElement.src = src;
                this.imgElement.classList.add('loaded');
            };
            image.src = src;
        }
    };
    render() {
        const { style, lazyload, src, className } = this.props;
        const imgProps = {
            className: lazyload ? `${className} lazyimg` : className,
            style: style && style
        };
        if (!lazyload) imgProps.src = src;
        return <img {...imgProps} ref={this.imgElementRef} />;
    }
}
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;
    // prettier-ignore
    const isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
    return isVisible;
}
