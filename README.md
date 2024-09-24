# LangTrain 🚀

LangTrain is an innovative language learning app that empowers users to take control of their language journey. With LangTrain, you decide the difficulty level and topics you want to learn. Our app leverages OpenAI's technology to provide personalized lessons and quizzes tailored specifically to your preferences and skill level. Engage with interactive content designed just for you, test your skills with level-matched quizzes, and connect with a global community of learners to enhance your learning experience.

Here's a quick [demonstration](https://www.youtube.com/watch?v=sMpO4HBXUq0) video.


## Features

- 🌍 **Support for Dozens of Languages!**
- 🗨️ **Talk or Text with LangTrain:** Your reliable AI language teacher!
- 🎯 **Personalized Lessons:** Tell us what you want to learn, and we’ll create the perfect lesson for you!
- 🧠 **Level-Matched Quizzes:** Challenge and improve your skills!
- 🌐 **Community Chat:** Connect with other learners worldwide!
  
## Team

🙏 App built by: [Han Yu Lin](https://github.com/Hanlynui), [Alan Wu](https://github.com/alan-w25), and [Peter Zhang](https://github.com/tinysheep007)!

## Feedback

Although we may be wrapping up the project, we’re interested in hearing your thoughts: Is this an app you’d use? Should we continue developing it? Share your feedback through our [forms link](https://lnkd.in/eF9je7ku).
## Setup and Running the Project

### Frontend

1. **Navigate to the Frontend Directory**

   ```bash
   cd frontend/LangTrain_frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Copy `envjs-example.js` to `env.js` and configure it with your API keys and other necessary settings.

4. **Start the Project**

   ```bash
   npx expo start -c
   ```

### Backend

1. **Navigate to the Backend Directory**

   ```bash
   cd backend
   ```

2. **Set Up a Virtual Environment**

   ```bash
   python -m venv venv
   ```

   - **Activate the Virtual Environment:**

     - **Mac:**
       ```bash
       source venv/bin/activate
       ```

     - **Windows:**
       ```bash
       .\venv\Scripts\activate
       ```

3. **Generate Firebase Key**

   Obtain a Firebase key from the service accounts and save it as `firebase_key.json` in the `backend` folder.

4. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

5. **Run the Server**

   ```bash
   python manage.py runserver
   ```

6. **Run Tests**

   ```bash
   python manage.py test
   ```

   - Or check manual tests in `example_tests.txt`.

## Final Note

We originally planned to release this app on app stores, but we underestimated the costs of launching and maintaining the app for hundreds of users. As a result, we’ve decided not to proceed with a launch for the time being.

Thank you all for your support and feedback! 🚀

