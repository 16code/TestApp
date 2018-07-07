import PropTypes from 'prop-types';
import { Spinner } from 'components/Spinner';
const { Fragment } = React;
export default class ListBase extends React.Component {
    static propTypes = {
        dataSource: PropTypes.array,
        renderItem: PropTypes.func
    };
    keys = {};
    renderItem = (item, index) => {
        const { dataSource, renderItem, rowKey } = this.props;
        let key;
        if (typeof rowKey === 'function') {
            key = rowKey(dataSource[index]);
        } else if (typeof rowKey === 'string') {
            key = dataSource[rowKey];
        } else {
            key = dataSource.key;
        }
        if (!key) {
            key = `list-item-${index}`;
        }
        this.keys[index] = key;
        return renderItem(item, index);
    };
    renderChildrenContent = () => {
        const { dataSource, playSong, playingSongId, playerState, loading } = this.props;
        let childrenContent;
        if (dataSource.length > 0) {
            const items = dataSource.map((item, index) => this.renderItem(item, index));
            const childrenList = React.Children.map(items, (child, index) =>
                React.cloneElement(child, { key: this.keys[index], playSong, playingSongId, playerState })
            );
            childrenContent = childrenList;
        } else {
            childrenContent = !loading && this.renderEmpty();
        }
        return (
            <Fragment>
                {childrenContent}
                {loading && this.renderLoading()}
            </Fragment>
        );
    };
    renderLoading = () => {
        return (
            <div className={'ui-list-loading'}>
                <Spinner playState="run" visible />
            </div>
        );
    };
    renderEmpty = () => {
        return <div className={'ui-list-empty-text'}>empty</div>;
    };
}
