# Firebase Login Authentication

Sample code that demonstrates simple email / password using firebase login authentication

Demo app requires mongodb to be running.  You can quickly run a docker version of mongo that will allow you to run this code.
From a separate terminal, run the following commands:

>docker pull mongo:latest<br/>
> docker container run -d -p 27017:27017 --name=mongodb mongo:latest<br/>

Firebase Auth Docs:
https://firebase.google.com/docs

Firebase Console:
https://console.firebase.google.com/

Create project app from Firebase console and enable userid/pw.  Read documentation to see steps and requirements.

Code provided as is and feel free to contribute any fixes or updates.  This is only intended to get you started if you are feeling totally lost.

firebaseConfig config object needs to provided in a file called firebase-key.js.  See server.js for more details.



Todo:
- Add support for google login.  Any volunteers are welcome.  Fork the repo and create a pull request.



# Notes from ChatGPT

To enable Firebase authentication in a Node.js web app, you can follow these general steps:

1. Set up a Firebase project:
   - Go to the Firebase console (https://console.firebase.google.com/) and create a new project.
   - Enable the authentication feature for your project by navigating to the "Authentication" section and choosing the authentication providers you want to use (e.g., email/password, Google, etc.).

2. Install Firebase SDK:
   - Open your Node.js project directory in a terminal.
   - Run `npm install firebase` to install the Firebase SDK.

3. Initialize Firebase in your Node.js app:
   - Create a new JavaScript file (e.g., `app.js`) and require the Firebase SDK:

     ```javascript
     const firebase = require('firebase/app');
     require('firebase/auth');
     ```

   - Initialize Firebase with your project's configuration, which you can find in the Firebase console:

     ```javascript
     const firebaseConfig = {
       apiKey: 'YOUR_API_KEY',
       authDomain: 'YOUR_AUTH_DOMAIN',
       projectId: 'YOUR_PROJECT_ID',
       // ...
     };

     firebase.initializeApp(firebaseConfig);
     ```

4. Implement Firebase authentication in your Node.js app:
   - Depending on the authentication provider you want to use, you need to configure the appropriate Firebase authentication method. Here's an example of email/password authentication:

     ```javascript
     const email = 'user@example.com';
     const password = 'password123';

     firebase
       .auth()
       .signInWithEmailAndPassword(email, password)
       .then((userCredential) => {
         // User signed in successfully
         const user = userCredential.user;
         console.log('Logged in user:', user);
       })
       .catch((error) => {
         // Handle errors
         console.error('Login error:', error);
       });
     ```

   - Refer to the Firebase documentation for more information on different authentication providers and their specific implementation details.

5. Run your Node.js app:
   - Start your Node.js app by running `node app.js` in the terminal.
   - If everything is set up correctly, your app should authenticate users using Firebase.

Remember to handle errors appropriately and secure any sensitive information, such as API keys and credentials. Additionally, this example demonstrates server-side authentication. If you're building a web app, you may need to handle client-side authentication as well.

For detailed information and further customization, refer to the Firebase documentation: https://firebase.google.com/docs/web/setup

