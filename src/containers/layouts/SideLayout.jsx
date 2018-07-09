export default class SideLayout extends React.PureComponent {
    render() {
        return (
            <section id="page-content-inner" className="app-side-layout">
                <aside className="app-side-layout-aside">{this.props.aside}</aside>
                <section style={{ height: 'auto', overflow: 'hidden' }}>
                    <div className="page-content">{this.props.children}</div>
                </section>
            </section>
        );
    }
}
