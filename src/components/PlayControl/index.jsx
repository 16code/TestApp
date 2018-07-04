import classNames from 'classnames';
import styles from './styles.less';

export default ({
    className,
    playState,
    currentPlay,
    musicId,
    overlay = true,
    size = 'default',
    theme = 'light',
    disabled = false,
    onPlay
}) => {
    const classString = classNames(styles['ui-play-overlay'], className);
    const classBtn = classNames('btn-playpause', {
        'theme-light': theme === 'light',
        'theme-dark': theme === 'dark',
        [playState]: playState && currentPlay === musicId
    });
    const content = overlay ? (
        <div className={classString} data-size={size}>
            <button className={classBtn} onClick={onPlay} data-size={size} role="button" disabled={disabled} />
        </div>
    ) : (
        <button className={classBtn} onClick={onPlay} data-size={size} role="button" disabled={disabled} />
    );
    return content;
};
