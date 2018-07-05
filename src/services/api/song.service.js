export default class SongService {
    static list({ category = 'new', ...rest }) {
        return fetch(`/songs/${category}`, { params: rest });
    }
}
