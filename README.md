# 🖤 Atelier Noir API

Atelier Noir is a modern backend API built with Django + Django REST Framework to power scalable web & mobile applications.
It provides secure authentication, robust payment integrations, and well-documented endpoints through an interactive Swagger UI.


This README explains how to set up the project, configure environments, and consume the API with ease.

## 🚀 Features

✅ RESTful API powered by Django REST Framework
✅ Interactive API Docs (Swagger & Redoc)
✅ JWT Authentication for secure login/logout
✅ Payment Integration with Paystack
 (and easily extendable to other gateways)
✅ Production-Ready (Whitenoise static handling, environment-based settings)
✅ Extensible Architecture for future features (multi-gateway payments, caching, etc.)

## 📂 Project Structure
atelier-noir/
├── api/                    # Main API app (endpoints, serializers, views)
├── users/                  # Custom user model & auth endpoints
├── payments/               # Payment logic & integrations
├── config/                 # Django project settings
├── static/                 # Collected static files
├── requirements.txt        # Project dependencies
└── manage.py               # Django management script

## ⚙️ Tech Stack
- Layer	Tech
- Backend	Django 5.x, Django REST Framework
- Database	PostgreSQL (recommended) or SQLite (dev)
- Auth	JWT (via djangorestframework-simplejwt)
- Payments	Paystack and Chapa API
- Docs	drf-yasg (Swagger & Redoc)
- Deployment	Render / Docker-ready

## 🛠️ Local Development
### 1️⃣ Prerequisites

- Python 3.11+

- PostgreSQL (or SQLite for quick testing)

- Git

### 2️⃣ Clone the Repository
```
git clone https://github.com/<your-username>/atelier-noir.git
cd atelier-noir
```

3️⃣ Create a Virtual Environment or Run Docker
virtualenv
```
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
```

docker
```
docker compose build
docker compose up
```

### 4️⃣ Install Dependencies
```
pip install -r requirements.txt
```

Skip 4️⃣ if you are using Docker

### 5️⃣ Create a .env File

Create a .env file in the project root:

```
SECRET_KEY=your_secret_key_here
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DBNAME
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```


⚠️ Never commit .env to GitHub.

### 6️⃣ Run Migrations
```
python manage.py makemigrations
python manage.py migrate
```

### 7️⃣ Create a Superuser
```
python manage.py createsuperuser
```

### 8️⃣ Start the Development Server
```
python manage.py runserver
```


* Visit: http://127.0.0.1:8000

## 🌐 API Documentation
=====================
Tool	URL
Swagger	/swagger/

Redoc	/redoc/
=====================

Interactive documentation lets you test endpoints directly in the browser.

## 🔑 Authentication

The API uses JWT Authentication.

Obtain Token

POST /api/login/

```
{
  "username": "your_username",
  "password": "your_password"
}
```


Response:

```
{
  "refresh": "your_refresh_token",
  "access": "your_access_token"
}
```

Refresh Token

POST /api/token/refresh/

{ "refresh": "your_refresh_token" }


Include the access token in all authenticated requests:

Authorization: Bearer <access_token>

## 💳 Payments (Paystack)

Paystack is integrated for secure, real-time transactions.

### 1️⃣ Initialize Payment

POST /api/payments/initialize/

{
  "email": "customer@example.com",
  "amount": 5000  // Amount in kobo (₦50.00)
}


Response:

{
  "authorization_url": "https://checkout.paystack.com/xyz123",
  "reference": "abc123"
}

### 2️⃣ Verify Payment

Paystack will call your webhook when the payment is complete.
You can also verify manually:

```GET /api/payments/verify/?<reference>/```

## 🖼️ Deployment Notes

This project is production-ready.
Here’s how we deploy on Render
:

Environment Variables

Set all values from .env in Render Dashboard.

Build Command

pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate


Start Command

gunicorn config.wsgi:application --bind 0.0.0.0:$PORT


Make sure DEBUG=False and update:

ALLOWED_HOSTS=atelier-noir.onrender.com

🧩 Extending Payments

The payment system is built with a gateway interface.
Adding a new provider (e.g. Chapa, Stripe) is as simple as:

Creating a new gateway class (e.g. ChapaGateway) that implements the same methods (initialize, verify).

Adding a new endpoint or allowing the frontend to specify gateway in the API body.

## 🛡️ Security

DEBUG=False in production

HTTPS enforced (via Render or custom reverse proxy)

Secure cookies & CSRF protection

Strong SECRET_KEY and environment-based secrets

## 🤝 Contributing

Pull requests are welcome!
For major changes:

Fork the repo

Create a feature branch

Submit a pull request

## 💡 Tips for API Consumers

Always include the Authorization header when calling protected endpoints.

Check the /swagger/ page for real-time testing and request/response samples.

Payments should always be verified server-side to avoid fraud.

## 📬 Support

For questions or issues:

Open a GitHub issue

Contact the developer: wisdomchinonsoagbo@gmail.com

Existing super user for testing:

```
email: admin@example.com
password: StrongPassword123
```