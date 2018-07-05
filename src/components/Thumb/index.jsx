import classNames from 'classnames';
import Img from 'components/Img';
import styles from './styles.less';

const metaExtraContent = metaExtra => <figcaption className={styles['ui-thumb-meta']}>{metaExtra}</figcaption>;

export default function Thumb({ source, size = '54y54', className, metaExtra, playCtrl, lazyload, ...rest }) {
    const classString = classNames(styles['ui-thumb'], className);
    let [w, h] = size.split('y');
    w = +w;
    h = +h;
    const size2x = `${w * 2}y${h * 2}`;
    const boxSizeStyle = { width: px2rem(w), height: px2rem(h) };
    return (
        <figure className={classString} style={boxSizeStyle} {...rest}>
            <Img src={`${source}?param=${size2x}`} className={styles['ui-thumb-img']} lazyload={lazyload || true} />
            {metaExtra && metaExtraContent(metaExtra)}
            {playCtrl && playCtrl}
        </figure>
    );
}
const getBodyFontSize = (function () {
    let bodyFontSize = null;
    return function () {
        if (bodyFontSize) return bodyFontSize;
        const docEl = document.documentElement;
        const clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        bodyFontSize = clientWidth >= 640 ? 100 : 100 * (clientWidth / 640);
        return bodyFontSize;
    };
})();
export function px2rem(px = 0) {
    const htmlFontSize = getBodyFontSize();
    return `${px / htmlFontSize}rem`;
}
