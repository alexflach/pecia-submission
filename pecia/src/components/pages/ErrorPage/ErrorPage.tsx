import { useRouteError } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = () => {
    const error = useRouteError();
    return (
        <div id="error-page">
            <h1>Sorry!</h1>
            <p>An unexpected error has occurred.</p>
            <p>
                <i>
                    {(error as { statusText?: string })?.statusText ||
                        (error as Error)?.message}
                </i>
            </p>
        </div>
    );
};

export default ErrorPage;
