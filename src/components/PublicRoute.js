import React from 'react';
import { Redirect, Route } from 'react-router';
import { useProfile } from '../context/profile.context';

const PublicRoute = ({ children, ...routeProps }) => {
  const isSignedIn = useProfile();

  if (isSignedIn) {
    return <Redirect to="/" />;
  }

  return <Route {...routeProps}>{children}</Route>;
};

export default PublicRoute;
