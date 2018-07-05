import PropTypes from 'prop-types';

const generateId = (() => {
    let i = 0;
    return (prefix: string = '') => {
        i += 1;
        return `${prefix}${i}`;
    };
})();

export default class Sider extends React.Component {
    displayName = 'SiderComponent';
    static contextTypes = {
        siderHook: PropTypes.object
    };
    constructor() {
        super();
        this.uniqueId = generateId('app-sider-');
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.children !== this.props.children;
    }
    componentDidMount() {
        if (this.context.siderHook) {
            this.context.siderHook.addSider(this.uniqueId);
        }
    }
    componentWillUnmount() {
        if (this.context.siderHook) {
            this.context.siderHook.removeSider(this.uniqueId);
        }
    }
    render() {
        return (
            <aside className="app-layout-sider">
                <div className="app-layout-sider-children">{this.props.children}</div>
            </aside>
        );
    }
}
