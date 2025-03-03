# **FinanceGPT**

FinanceGPT helps you take control of your finances. It offers personalized financial advice, similar to consulting with a human advisor. With features like AI chat and goal planning, FinanceGPT helps you achieve your financial goals. 
Built with Next.js and AI technology, this open-source template helps developers create their own financial advisory tools. As more people look for smart ways to manage their money, this template lets you build your own financial advisor app quickly and easily.

## Live Demo

[https://finance-gpt-pi.vercel.app/](https://finance-gpt-pi.vercel.app/)

## Features

- User authentication and registration
- AI-powered chatbot for financial queries
- Personalized financial advice using AI
- Financial snapshot and goal setting

## Technologies Used

- Next.js and React for Frontend and BackendDatabase: MongoDB
- AI Integration: OpenAI's GPT-4
- State Management: Redux Toolkit

## Use Cases
- Integrate with real-time financial data APIs to provide up-to-date market information and analysis.
- Implement a document upload feature to analyze financial statements and tax returns.
- Create interactive financial education modules with quizzes and rewards.

## Installation Steps

**1. Clone the repository:**

```bash
git clone https://github.com/0xmetaschool/finance-gpt.git
cd finance-gpt
```

**2. Install dependencies:**

```bash
npm install
```

**3. Set up the database:**

Ensure you have [MongoDB](https://www.mongodb.com/) installed and running on your system, or use a cloud-hosted MongoDB service like [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database). Create a new Cluster, select a free plan, and copy the connection string, this will be required in the next step.

**4. Set up environment variables:**

Create a `.env.local` file in the root directory and add the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

**5. Run the development server:**

```bash
npm run dev
```

**6. Open your browser and navigate to `http://localhost:3000`**

## Screenshots

<div style="float:left; display: flex; justify-content: space-between;">
  <img src="https://github.com/0xmetaschool/finance-gpt/blob/main/public/images/finance-gpt-template-landing-page.png?raw=true" alt="FinanceGPT Template Landing Page screenshot" style="width: 49%; border: 2px solid black;" />
  <img src="https://github.com/0xmetaschool/finance-gpt/blob/main/public/images/finance-gpt-template-home-page.png?raw=true" alt="FinanceGPT Template Home Page screenshot" style="width: 49%; border: 2px solid black;" />
</div>


## How to use the application

1. Register for a new account or log in
2. Complete the onboarding process to set up your financial profile
3. Explore the financial snapshot dashboard
4. Set financial goals and receive AI-powered strategies
5. Use the chatbot for financial guidance


## Contributing

We love contributions! Here's how you can help make FinanceGPT even better:

1. Fork the project (`gh repo fork https://github.com/0xmetaschool/ai-finance-advisor.git`)
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/0xmetaschool/finance-gpt/blob/main/LICENSE) file for details.


## Contact
Please open an issue in the GitHub repository for any queries or support.
