import { Navigate, useLocation, Route } from 'react-router-dom';
import { FC } from 'react';

interface PublicRouteProps {
  path: string;
  element: JSX.Element;
  isAuthenticated: boolean;
  restricted: boolean;
}

const PublicRoute: FC<PublicRouteProps> = ({
  isAuthenticated,
  restricted,
  element,
  path,
}) => {
  const location = useLocation();
  return isAuthenticated && restricted ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Route path={path} element={element} />
  );
};

export default PublicRoute;
