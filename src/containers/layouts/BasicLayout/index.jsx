import DocumentTitle from 'react-document-title';
import Scenes from 'scenes/index';
import Layout from 'components/layout';
import Menu from 'components/Menu';
import { AudioPlayer } from 'components/player';
import { getMenuData } from 'common/menu';

const menuData = getMenuData();

const { Sider, Header, Content, Player } = Layout;
export default class BasicLayout extends React.PureComponent {
    getFlatMenuKeys(menus) {
        let keys = {};
        menus.forEach(item => {
            if (item.children) {
                keys = Object.assign(keys, this.getFlatMenuKeys(item.children));
            }
            keys[item.path] = {
                name: item.name
            };
        });
        return keys;
    }
    getPageTitle() {
        const { location } = this.props;
        const { pathname } = location;
        const routerData = this.getFlatMenuKeys(menuData);
        let title = 'React Music';
        if (routerData[pathname] && routerData[pathname].name) {
            title = `${routerData[pathname].name} - React Music`;
        }
        return title;
    }

    render() {
        return (
            <DocumentTitle title={this.getPageTitle()}>
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
