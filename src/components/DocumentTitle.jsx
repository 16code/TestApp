import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { actions } from 'reducers/title';

@connect(
    null,
    {
        updateTitle: actions.updateTitle
    }
)
export default class Title extends React.PureComponent {
    componentDidMount() {
        this.props.updateTitle(this.props.title);
    }
    componentDidUpdate(prevProps) {
        if (this.props.title !== prevProps.title) {
            this.props.updateTitle(this.props.title);
        }
    }
    render() {
        const { title, ...rest } = this.props;
        return <DocumentTitle title={`${title} - React Music`} {...rest} />;
    }
}
