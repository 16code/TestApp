export const Spinner = ({ playState = 'paused', visible }) => {
    const props = {
        className: `wave-spinner ${playState}`
    };
    if (visible) props.className = 'wave-spinner run';

    return (
        <div {...props} style={{ opacity: visible ? '1' : '0' }}>
            <div />
            <div />
            <div />
            <div />
            <div />
        </div>
    );
};

const style = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: '26px',
    height: '18px',
    margin: 'auto'
};
export const FullSpinner = ({ visible }) => (
    <div style={style}>
        <Spinner playState={'runing'} visible={visible} />
    </div>
);
export const AjaxLoading = ({ visible = false, className }) =>
    visible && <div className={`ajax-loading ${className}`} />;

export const ListLoading = ({ loading }) => (
    <div className={'ui-list-loading'}>
        <Spinner playState="run" visible={loading} />
    </div>
);
