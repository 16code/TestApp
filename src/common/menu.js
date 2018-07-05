export const menuData = [
    {
        name: 'Application',
        path: '/',
        children: [
            {
                name: 'Dashboard',
                path: 'dashboard',
                icon: 'dashborad'
            }
        ]
    },
    {
        name: 'Music',
        path: 'music',
        children: [
            {
                name: '每日推荐',
                path: 'recommend'
            },
            {
                name: '最新歌曲',
                path: 'new'
            },
            {
                name: '排行榜',
                path: 'top'
            }
        ]
    },
    {
        name: 'PlayList',
        path: 'playList',
        children: [
            {
                name: '精品歌单',
                path: 'hot'
            }
        ]
    }
];
/* eslint-disable-next-line */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

function isUrl(path) {
    return reg.test(path);
}
function formatter(data, parentPath = '/', parentAuthRole) {
    parentPath = parentPath.replace(/\/\/\//, '/');
    return data.map(item => {
        let { path } = item;
        if (!isUrl(path)) {
            path = parentPath + item.path;
        }
        const result = {
            ...item,
            path,
            authRole: item.role || parentAuthRole
        };
        if (item.children) {
            result.children = formatter(item.children, `${parentPath}${item.path}/`, item.role);
        }
        return result;
    });
}
export const getMenuData = () => formatter(menuData);
