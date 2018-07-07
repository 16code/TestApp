// import throttle from 'lodash/throttle';
import scrollParent from 'utils/scrollParent';
import { Spinner } from 'components/Spinner';

export default class InfiniteScroll extends React.Component {
    scrollContentRef = React.createRef();
    ticking = false;
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
    componentDidUpdate(props) {
        const { destroy } = props;
        if (destroy || this.props.destroy) this.removeScrollEvent();
    }
    bindScrollEvent = () => {
        // this.throttled = throttle(this.onScroll, 200);
        this.scroller.addEventListener('scroll', this.onScroll);
    };
    removeScrollEvent = () => {
        this.scroller.removeEventListener('scroll', this.onScroll);
    };
    onScroll = () => {
        if (!this.ticking) {
            requestAnimationFrame(this.cb);
            this.ticking = true;
        }
    };
    cb = () => {
        const bottom = this.scroller.scrollHeight;
        const scrollY = this.scroller.scrollTop + this.scroller.clientHeight;
        const scrollOffset = bottom - scrollY;
        this.ticking = false;
        if (scrollOffset <= this.props.scrollThreshold) {
            this.props.onScrollEnd && this.props.onScrollEnd(scrollOffset);
        }
    };
    renderLoading() {
        return (
            <div className="list-loading">
                <Spinner visible={this.props.loading} />
            </div>
        );
    }
    render() {
        return <div ref={this.scrollContentRef}>{this.props.children}</div>;
    }
}
