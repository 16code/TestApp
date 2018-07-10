import { NavLink, withRouter } from 'react-router-dom';
import Icon from 'components/Icon';
const clsStr = (str = '') => `color color${str.toLowerCase().replace(/\//g, '-')}`;

const renderItem = (items = []) =>
    items.map(item => {
        return (
            !item.hidden && (
                <li className="menu-item" key={item.path}>
                    <NavLink activeClassName="menu-item-selected" to={item.path}>
                        {item.icon ? <Icon type={item.icon} /> : <span className={clsStr(item.path)} />}
                        <span className="item-name">{item.name}</span>
                    </NavLink>
                </li>
            )
        );
    });

const renderGroup = item => {
    if (item.children) {
        return (
            <div className="app-menu-item-group" key={item.path}>
                <div className="app-menu-item-group-title">{item.name}</div>
                <div className="divider divider-horizontal" />
                <ul className="app-menu-item-group-list list-unstyled">{item.children && renderItem(item.children)}</ul>
            </div>
        );
    }
    return (
        <NavLink activeClassName="menu-item-selected" key={item.path} to={item.path}>
            {item.icon && <Icon type={item.icon} />}
            <span className="item-name">{item.name}</span>
        </NavLink>
    );
};

@withRouter
export default class Menu extends React.Component {
    displayName = 'MenuComponent';
    static defaultProps = {
        width: 220
    };
    shouldComponentUpdate(nextProps) {
        return nextProps.location.pathname !== this.props.location.pathname;
    }
    render() {
        const { data } = this.props;
        return (
            <div className="app-menu">
                <div className="logo" hidden>
                    <h1>Beats Music App</h1>
                </div>
                {data.map(renderGroup)}
            </div>
        );
    }
}
