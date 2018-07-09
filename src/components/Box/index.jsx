import styles from './styles.less';

export default ({ title, children, extra, style }) => (
    <div className={styles.box} style={style}>
        {(title || extra) && (
            <div className={styles['box-header']}>
                <h2 className={styles['box-title']}>{title}</h2>
                {extra && <div className={styles['box-extra']}>{extra}</div>}
            </div>
        )}
        <div className={styles['box-body']}>{children}</div>
    </div>
);
