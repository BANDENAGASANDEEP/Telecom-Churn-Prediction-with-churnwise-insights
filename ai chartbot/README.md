# AI Chatbot for Customer Churn Analysis
Overview
This chatbot uses Haystack’s NLP framework to analyze customer churn and offers. It processes customer data, stores it in a BM25-based retrieval system, and allows users to ask queries about churn reasons, offers, and contract details.

## Features
1. Cleans and structures customer data
2. Stores records in a searchable BM25 document store
3. Provides a chatbot for Q&A on churn and offers
4. Saves and reloads processed data for efficiency

## Installation & Usage
1️. Install dependencies:

pip install -U pydantic pandas farm-haystack
2️. Run the script:

python chatbot.py
3️. Ask questions like:

ask_chatbot("Why did customer 123 churn?")
ask_chatbot("What offers are available?")

## Future Enhancements
Deploy as a web API

Improve NLP accuracy

Add real-time data updates
