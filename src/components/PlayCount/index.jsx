import { formatPlayCount } from 'utils';
import classNmaes from 'classnames';
import styles from './styles.less';
export default ({ number, className }) => {
    const classString = classNmaes(className, styles['play-count']);
    return (
        <small className={classString}>
            <i className="iconfont icon-headset" />
            <span className={styles.count}>{formatPlayCount(number)}</span>
        </small>
    );
};
