const delay = require('utils/index').delay;
const asyncComponent = getComponent => {
    return class AsyncComponent extends React.Component {
        displayName = 'AsyncComponent';
        state = { Component: null };
        firstRender = true;
        constructor() {
            super();
            this.unMount = false;
            this.componentRef = React.createRef();
        }
        async componentDidMount() {
            if (!this.state.Component) {
                const cmp = await getComponent().catch(e => {
                    console.info(e);
                });
                if (!this.unMount) {
                    this.setState({ Component: cmp.default });
                }
            }
        }
        shouldComponentUpdate(nextProps) {
            if (nextProps.location.pathname === this.props.location.pathname && this.firstRender) {
                return true;
            }
            return nextProps.location.pathname !== this.props.location.pathname;
        }
        componentDidUpdate(prevProps) {
            this.firstRender = false;
            if (prevProps.location.pathname !== this.props.location.pathname) {
                this.applyRouterTransition();
            }
        }
        componentWillUnmount() {
            this.unMount = true;
            this.firstRender = true;
            if (this.componentRef) this.componentRef.setState = () => {};
        }
        getAnimatedDomNode() {
            let element;
            const ref = this.componentRef.current;
            const elementRef = ReactDOM.findDOMNode(ref); // eslint-disable-line
            if (ref && elementRef) {
                element = elementRef.querySelector('.page-content');
            }
            return element;
        }
        async applyRouterTransition() {
            const element = this.getAnimatedDomNode();
            if (element) {
                element.setAttribute('animated', 'page-enter');
                await delay(1200);
                element.removeAttribute('animated');
            }
        }
        renderComponent(Component) {
            return <Component key="Component" ref={this.componentRef} {...this.props} />;
        }
        render() {
            const { Component } = this.state;
            return Component ? this.renderComponent(Component) : <div>loading</div>;
        }
    };
};

module.exports = asyncComponent;