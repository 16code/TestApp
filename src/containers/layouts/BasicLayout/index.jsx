import DocumentTitle from 'react-document-title';
import Scenes from 'scenes/index';
import Layout from 'components/layout';
import Menu from 'components/Menu';
import { AudioPlayer } from 'components/player';
import { getMenuData } from 'common/menu';

const menuData = getMenuData();

const { Sider, Header, Content, Player } = Layout;
export default class BasicLayout extends React.PureComponent {
    render() {
        return (
            <DocumentTitle title="Home">
                <Layout data-layout="root">
                    <Sider>
                        <Menu data={menuData} />
                    </Sider>
                    <Header>Header</Header>
                    <Content id="page-content-wrapper">
                        <div id="page-content-inner" className="page-content">
                            <Scenes {...this.props} />
                        </div>
                    </Content>
                    <Player>
                        <AudioPlayer />
                    </Player>
                </Layout>
            </DocumentTitle>
        );
    }
}
