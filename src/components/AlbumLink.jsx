import { Link } from 'react-router-dom';
import classNames from 'classnames';
export default function AlbumLink({ data = {}, className }) {
    return (
        <Link className={classNames(className)} key={data.id} to={`/${data.id}`}>
            {data.name}
        </Link>
    );
}
