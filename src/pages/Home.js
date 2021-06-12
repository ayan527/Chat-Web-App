import React from 'react';
import { Col, Grid, Row } from 'rsuite';
import Sidebar from '../components/Sidebar';
import { ChatRoomsProvider } from '../context/rooms.context';

const Home = () => {
  return (
    <ChatRoomsProvider>
      <Grid fluid className="h-100">
        <Row className="h-100">
          <Col xs={24} md={8} className="h-100">
            <Sidebar />
          </Col>
        </Row>
      </Grid>
    </ChatRoomsProvider>
  );
};

export default Home;
