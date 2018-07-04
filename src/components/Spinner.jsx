export const Spinner = ({ playState = 'paused' }) => (
    <div className={`wave-spinner ${playState}`}>
        <div />
        <div />
        <div />
        <div />
        <div />
    </div>
);

export const AjaxLoading = ({ visible = false, className }) =>
    visible && <div className={`ajax-loading ${className}`} />;
