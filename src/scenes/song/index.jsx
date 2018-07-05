import styles from './style.less';
export default class Song extends React.PureComponent {
    state = {
        data: {}
    };
    componentDidMount() {
        fetch('/songs/top').then(({ playlist }) => {
            this.setState({ data: playlist.tracks.slice(0, 5) });
        });
    }
    render() {
        return (
            <div className={styles.div}>
                1313113131
                <pre>
                    <code>{JSON.stringify(this.state.data, null, 4)}</code>
                </pre>
            </div>
        );
    }
}
