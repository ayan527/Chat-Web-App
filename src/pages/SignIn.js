import React from 'react';
import firebase from 'firebase/app';
import { Alert, Button, Col, Container, Grid, Icon, Panel, Row } from 'rsuite';
import { auth, database } from '../misc/firebase';

const SignIn = () => {
  const signInWithProvider = async provider => {
    try {
      const result = await auth.signInWithPopup(provider);
      // console.log(result);

      const { additionalUserInfo, user } = result;

      if (additionalUserInfo.isNewUser) {
        database.ref(`/profiles/${user.uid}`).set({
          name: user.displayName,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }

      Alert.success('Successfully Signed In', 4000);
    } catch (err) {
      Alert.error(err.message, 4000);
    }
  };

  const onFacebookSignIn = () => {
    signInWithProvider(
      new firebase.auth.FacebookAuthProvider().setCustomParameters({
        auth_type: 'reauthenticate',
      })
    );
  };

  const onGoogleSignIn = () => {
    signInWithProvider(
      new firebase.auth.GoogleAuthProvider().setCustomParameters({
        prompt: 'select_account',
      })
    );
  };

  return (
    <Container className="signin-page">
      <Grid className="mt-page">
        <Row>
          <Col xs={24} md={12} mdOffset={6}>
            <Panel>
              <div className="text-center text-signin">
                <h2>
                  Welcome to{' '}
                  <span className="text-orange chat-animation">Chat</span>
                  <span className="text-green base-animation">Base</span>
                </h2>
                <div className="wrapper">
                  <p className="mt-1 typing-demo">
                    Would you like a world with magic in it? Join us!
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <Button block color="green" onClick={onGoogleSignIn}>
                  <Icon icon="google" /> Login with Google
                </Button>
                <Button block color="blue" onClick={onFacebookSignIn}>
                  <Icon icon="facebook" /> Login with Facebook
                </Button>
              </div>
            </Panel>
          </Col>
        </Row>
      </Grid>
      <footer className="bottom-container">
        <p className="copyright-para">© 2021 Ayan Mukherjee.</p>
      </footer>
    </Container>
  );
};

export default SignIn;
