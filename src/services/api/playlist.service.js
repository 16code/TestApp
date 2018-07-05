export default class PlayListService {
    // 获取精品歌单
    static list(paramObj) {
        return fetch('/playlist/hot', { params: paramObj });
    }
    static artist(paramObj) {
        return fetch('/artist', { params: paramObj });
    }
}
