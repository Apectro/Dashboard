import { Navigate, useLocation, Route } from 'react-router-dom';
import { FC } from 'react';

interface PrivateRouteProps {
  path: string;
  element: JSX.Element;
  isAuthenticated: boolean;
}

const PrivateRoute: FC<PrivateRouteProps> = ({
  isAuthenticated,
  element,
  path,
}) => {
  const location = useLocation();
  return isAuthenticated ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
