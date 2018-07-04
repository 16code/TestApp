import classNames from 'classnames';
export default function Icon({ className, type }) {
    const clsStr = classNames('iconfont', className, `icon-${type}`);
    return <i className={clsStr} />;
}
