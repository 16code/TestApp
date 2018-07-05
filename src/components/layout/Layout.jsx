import PropTypes from 'prop-types';
import classNames from 'classnames';
import Sider from './Sider';

function generator(props) {
    return BasicComponent => {
        return class Adapter extends React.PureComponent {
            displayName = 'AdapterComponent';
            static Header: any;
            static Player: any;
            static Content: any;
            static Sider: any;
            render() {
                const { prefixCls } = props;
                return <BasicComponent prefixCls={prefixCls} {...this.props} />;
            }
        };
    };
}

class Basic extends React.PureComponent {
    displayName = 'BasicComponent';
    render() {
        const { prefixCls, className, children, ...others } = this.props;
        const divCls = classNames(prefixCls, className);
        let c = null;
        switch (prefixCls) {
            case 'app-layout-header':
                c = (
                    <header className={divCls} {...others}>
                        {children}
                    </header>
                );
                break;
            case 'app-layout-content':
                c = (
                    <section className={divCls} {...others}>
                        {children}
                    </section>
                );
                break;
            case 'app-layout-player':
                c = (
                    <footer className={divCls} {...others}>
                        {children}
                    </footer>
                );
                break;
        }
        return c;
    }
}
const Header = generator({
    prefixCls: 'app-layout-header'
})(Basic);
const Player = generator({
    prefixCls: 'app-layout-player'
})(Basic);
const Content = generator({
    prefixCls: 'app-layout-content'
})(Basic);

export default class Layout extends React.PureComponent {
    displayName = 'BasicLayout';
    static childContextTypes = {
        siderHook: PropTypes.object
    };
    state = { siders: [] };
    getChildContext() {
        return {
            siderHook: {
                addSider: id => {
                    this.setState({
                        siders: [...this.state.siders, id]
                    });
                },
                removeSider: id => {
                    this.setState({
                        siders: this.state.siders.filter(currentId => currentId !== id)
                    });
                }
            }
        };
    }
    render() {
        const { className, children, ...others } = this.props;
        const divCls = classNames('app-layout', className, {
            ['app-layout-has-sider']: this.state.siders.length > 0
        });
        return (
            <div className={divCls} {...others}>
                {children}
            </div>
        );
    }
}
Layout.Header = Header;
Layout.Player = Player;
Layout.Sider = Sider;
Layout.Content = Content;
