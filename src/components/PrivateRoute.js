import React from 'react';
import { Redirect, Route } from 'react-router';
import { useProfile } from '../context/profile.context';

const PrivateRoute = ({ children, ...routeProps }) => {
  const isSignedIn = useProfile();

  if (!isSignedIn) {
    return <Redirect to="/signin" />;
  }

  return <Route {...routeProps}>{children}</Route>;
};

export default PrivateRoute;
