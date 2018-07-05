export const loadMp3Address = id => {
    return fetch('/play-urls', { params: { id, type: 'song' } });
};
export const loadLrc = id => {
    return fetch(`/songs/lyric/${id}`, { params: { id } });
};
export const loadSongInfo = id => {
    return fetch(`/songs/${id}`, { params: { id } });
};
