import throttle from 'lodash/throttle';
import scrollParent from 'utils/scrollParent';

export default class InfiniteScroll extends React.Component {
    scrollContentRef = React.createRef();
    static defaultProps = {
        scrollThreshold: 0
    };
    componentDidMount() {
        this.scroller = scrollParent(this.scrollContentRef.current);
        if (this.scroller) this.bindScrollEvent();
    }
    componentWillUnmount() {
        this.removeScrollEvent();
    }
    bindScrollEvent = () => {
        this.throttled = throttle(this.onScroll, 200);
        this.scroller.addEventListener('scroll', this.throttled, { passive: true });
    };
    removeScrollEvent = () => {
        this.scroller.removeEventListener('scroll', this.throttled, { passive: true });
    };
    onScroll = () => this.cb();
    cb = () => {
        const bottom = this.scroller.scrollHeight;
        const scrollY = this.scroller.scrollTop + this.scroller.clientHeight;
        const scrollOffset = bottom - scrollY;
        if (scrollOffset <= this.props.scrollThreshold) {
            this.props.onScrollEnd && this.props.onScrollEnd(scrollOffset);
        }
    };
    render() {
        return <div ref={this.scrollContentRef}>{this.props.children}</div>;
    }
}
