# SmartCart: Customer Segmentation & Recommendation System

## Overview
SmartCart is an end-to-end Machine Learning pipeline designed to segment retail customers based on purchasing behaviors (RFM) and provide personalized product recommendations. Built to demonstrate a complete data science workflow, this project spans from raw data processing to cloud deployment.

## Business Value
- **Targeted Marketing:** Grouping customers into actionable segments (e.g., "Loyalists", "At-Risk", "New Customers").
- **Increased Revenue:** Generating personalized recommendations to improve conversion rates and customer lifetime value.

## Architecture
- **Data Engineering:** Cleaned and transformed raw transactional datasets.
- **Machine Learning:** Implemented K-Means clustering for customer segmentation.
- **Backend API:** Built a robust API to serve predictions and recommendations in real-time.
- **Deployment:** Containerized the application and deployed it to the cloud.

## Technologies Used
- **Language:** Python
- **Machine Learning:** Scikit-learn, Pandas, NumPy
- **Deployment:** Docker, Cloud Platforms

## How to Run Locally
1. Clone the repository: `git clone https://github.com/rahultwoapl8130/Smartcart_Customers.git`
2. Install dependencies: `pip install -r requirements.txt`
3. Run the application: `python app.py`

## Future Enhancements
- Integration with real-time data streaming (e.g., Apache Kafka).
- Implementing deep learning models for advanced collaborative filtering.
