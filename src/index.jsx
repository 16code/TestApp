import { AppContainer as RootContainer } from 'react-hot-loader';
import AppContainer from './containers/AppContainer';
import './utils/fetch';
import './styles/index.less';
const rootElement = document.getElementById('app-root');
const render = Component => {
    ReactDOM.render(
        <RootContainer warnings={false}>
            <div className="container-wrapper">
                <Component />
            </div>
        </RootContainer>,
        rootElement
    );
};
render(AppContainer);
if (__MOCK__ && module.hot) {
    module.hot.accept('./containers/AppContainer', () => render(AppContainer));
}
if (__MOCK__) {
    const { whyDidYouUpdate } = require('why-did-you-update');
    whyDidYouUpdate(React, { groupByComponent: true, exclude: [/(Route|Switch|Link)/i] });
}
