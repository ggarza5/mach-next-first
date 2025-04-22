import { NextPage, NextPageContext } from 'next';

interface ErrorProps {
  statusCode: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">{statusCode ? `Error ${statusCode}` : 'An error occurred'}</h1>
        <p>
          {statusCode === 404
            ? 'Sorry, the page you are looking for does not exist.'
            : 'Sorry, something went wrong on our server.'}
        </p>
      </div>
    </div>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res ? res.statusCode || 500 : err ? err.statusCode || 500 : 404;
  return { statusCode };
};

export default Error;
