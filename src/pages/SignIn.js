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
    <Container>
      <Grid className="mt-page">
        <Row>
          <Col xs={24} md={12} mdOffset={6}>
            <Panel>
              <div className="text-center">
                <h2>Welcom to Chatify</h2>
                <p>Hello there!</p>
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
    </Container>
  );
};

export default SignIn;
