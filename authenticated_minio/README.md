# File Management App with MinIO and Keycloak

## Prerequisites
Before running the project, ensure you meet the following requirements:
1. [Docker](https://www.docker.com/products/docker-desktop)
2. [Docker Compose](https://docs.docker.com/compose/install/)

---

## Setup Instructions
1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>

2. Start the application:
    ```bash
    docker-compose up --build

---

## Endpoint testing

Keycloak is available at http://localhost:8080.

1. Getting access token 
   ```bash
   curl -X POST "http://localhost:8080/realms/file-management/protocol/openid-connect/token" -H "Content-Type: application/x-www-form-urlencoded" -d "grant_type=password" -d "client_id=file-management-app" -d "username=testuser" -d "password=password" -d "email=testuser@gmail.com" -d "client_secret=lRdajqJPCTYFzyxkYyYvKU3C7r8rXSi2"

---

The backend Flask API is available at http://localhost:5000.         
&NewLine;
The backend MinIO is available at http://localhost:9000.
&NewLine;

**1. Upload a File**

  Example:
  
      curl -X POST -H "Authorization: Bearer <access_token>" http://localhost:5000/upload -F "file=@downloaded_example.txt"
&NewLine;

**2. Download a File**

  Example:

    curl -X GET -H "Authorization: Bearer <access_token>" http://localhost:5000/download/ilina.txt --output example.txt
&NewLine;

**3. Update a File**

  Example:

    curl -X PUT -H "Authorization: Bearer <access_token>" http://localhost:5000/update/ilina.txt -F "file=@test.txt"
&NewLine;

**4. Delete a File**
  
  Example:

    curl -X DELETE -H "Authorization: Bearer <access_token>" http://localhost:5000/delete/ilina.txt
