import { Link } from 'react-router-dom';
import classNames from 'classnames';
export default function SingerLink({ data = [], className }) {
    return (
        <Link className={classNames(className)} key={data[0].id} to={`/${data[0].id}`}>
            {data[0].name}
        </Link>
    );
}

export function SingerLinkCard({ children, data = {}, className }) {
    return (
        <Link className={classNames(className)} key={data.id} to={`/${data.id}`}>
            {children}
        </Link>
    );
}
