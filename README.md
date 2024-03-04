
Sagetech Capstone Project

Dependencies:
- Postgres
- Node.js crypto library

Authors:
Joshua Mathwich
Janna Tanninen
Alexander Flores
Satchel Hamilton
-- sponsored by Sagetech Avionics

Overview

The ADSB Exchange System is designed to store and broker ADSB messages in the form of JSON objects, providing a robust solution for real-time aviation data processing. This document outlines how to set up and test the system, including backend hosting on AWS EC2, running a simulator for ADSB messages, and testing the system with a dummy client.

Components

- Broker: Facilitates message exchange and manages WebSocket connections.
- Dummy Client: Simulates user interactions with the system, testing its functionalities.
- User and Auth Services: Handle user registration, authentication, and device management.
- Database Setup: Stores ADSB messages, user, and device information.

Setup

1. AWS EC2 Setup: Deploy the backend components on an AWS EC2 instance. Ensure Node.js is installed and configure security groups to allow necessary inbound connections.

2. Database Initialization: Run the SQL scripts provided (`adsb_db.sql`, `user_db.sql`, `oauth_db.sql`) to set up the databases.

3. Environment Configuration: Set up the `.env` file with database credentials, service ports, and other environment variables.

4. Running the Broker: Start the broker component to initiate the WebSocket server and REST API endpoints.

5. Running the ADSB Simulator: Execute the ADSB message simulator to generate and send messages to the broker for processing.

6. Testing with Dummy Client: Use the dummy client to simulate user interactions, such as fetching ADSB messages and testing user and auth functionalities.

Testing the System

1. WebSocket Connection: Test WebSocket connectivity by requesting a connection through the dummy client. Use the `/users/:id/client/connect` endpoint to initiate a connection.

2. ADSB Message Retrieval: Retrieve and display ADSB messages from the database using the dummy client, ensuring the broker correctly processes and stores incoming messages.

3. User and Authentication Testing: Utilize the dummy client to test user registration, login, and device registration through the respective URIs detailed in the provided URI document.

Additional Functionalities

- URI Calls: The system supports various operations through specific URIs for user and device management, authentication, and ADSB message streaming. Refer to the "NewURIs-ExternalInternal.docx" for a comprehensive list of available endpoints and their purposes.




