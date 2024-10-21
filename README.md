# **AI-Powered FinanceGuru**

FinanceGuru is a new app that helps you take control of your finances. It offers personalized financial advice, similar to consulting with a human advisor. With features like AI chat and goal planning, FinanceGuru helps you achieve your financial goals. Powered by Next.js and OpenAI's GPT-4, this app provides tailored advice based on your unique financial situation.

## Table of Contents

- [**AI-Powered FinanceGuru**](#ai-powered-financeguru)
  - [Table of Contents](#table-of-contents)
  - [Live Demo](#live-demo)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [How to run the project](#how-to-run-the-project)
  - [Screenshots](#screenshots)
  - [How to use the application](#how-to-use-the-application)
  - [Use cases and further enhanchements](#use-cases-and-further-enhanchements)
  - [API Reference](#api-reference)
  - [Contributing](#contributing)
  - [License](#license)
  - [Acknowledgments](#acknowledgments)
  - [Contact](#contact)

## Live Demo

[Link to live demo - To be added]

## Features

- User authentication and registration
- AI-powered chatbot for financial queries
- Personalized financial advice using AI
- Financial snapshot and goal setting

## Technologies Used

- React.js with Chakra UI
- Next.js
- Database: MongoDB
- AI Integration: OpenAI's GPT-4
- State Management: Redux Toolkit
- Authentication: JSON Web Tokens (JWT)

## Getting Started

### Prerequisites

- Next.js
- MongoDB
- OpenAI API key

### How to run the project

**1. Clone the repository:**

```bash
git clone https://github.com/AveekGoyal/gpt-powered-ai-finance-advisor.git
cd gpt-powered-ai-finance-advisor
```

**2. Install dependencies:**

```bash
npm install
npm install react-icons
```

**3. Set up environment variables:**

Create a `.env.local` file in the root directory and add the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

**4. Set up the database:**

Ensure you have [MongoDB](https://www.mongodb.com/) installed and running on your system, or use a cloud-hosted MongoDB service like [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database).

**5. Update Next.js configuration:**

Ensure your `next.config.js` file includes the necessary configurations:

```jsx
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
}

module.exports = nextConfig
```

**6. Run the development server:**

```bash
npm run dev
```

**7. Open your browser and navigate to `http://localhost:3000`**

You should now see the AI Powered FinanceGuru  application running with Next.js.

## Screenshots

[2-3 screenshots to be added]

## How to use the application

1. Register for a new account or log in
2. Complete the onboarding process to set up your financial profile
3. Explore the financial snapshot dashboard
4. Set financial goals and receive AI-powered strategies
5. Use the chatbot for financial guidance

## Use cases and further enhanchements
1. Integrate with real-time financial data APIs to provide up-to-date market information and analysis.
2. Implement a document upload feature for analyzing financial statements and tax returns.
3. Create interactive financial education modules with quizzes and rewards.
4. Implement a feature using which users can access older chats
5. Add support for cryptocurrency tracking and investment advice.
6. etc, etc, etc...

## API Reference

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/auth/register` | POST | To register new user |
| `/api/auth/login` | POST | To authenticate returning user |
| `/api/financial-snapshot` | GET/PUT | To view/update user’s financial data |
| `/api/financial-advice` | POST | To fetch financial advice based on the data provided |
| `/api/goals` | GET/POST/PUT/DELETE | To fetch goal-based advice  |
| `/api/chat` | POST | To fetch general chat response from OpenAI |

## Contributing

We love contributions! Here's how you can help make the AI-powered FinanceGuru even better:

1. Fork the project (`gh repo fork https://github.com/0xmetaschool/ai-finance-advisor.git`)
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](https://www.notion.so/0xmetaschool/LICENSE) file for details.

## Acknowledgments

- OpenAI for providing the GPT-4 API
- The Chakra UI team for their excellent React component library

## Contact

Please open an issue in the GitHub repository for any queries or support.
