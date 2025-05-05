# Paatthya Educator Backend

Backend for the Paatthya Educator admin web app. This server provides APIs for file uploads to AWS S3 and integration with Firebase Firestore.

## Features

- Generate pre-signed URLs for direct S3 uploads
- File type validation based on content category
- Firebase Firestore integration for document management
- Secure API with proper error handling
- CORS and security headers configured

## Prerequisites

- Node.js (v14 or later)
- AWS account with S3 bucket
- Firebase project with Firestore
- AWS EC2 instance for deployment

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/paatthya-educator-backend.git
cd paatthya-educator-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=your-bucket-name

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"

# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Generate Upload URL

- **URL**: `/api/generate-upload-url`
- **Method**: `POST`
- **Request Body**:
```json
{
  "fileName": "lecture.mp4",
  "fileType": "video/mp4",
  "fileCategory": "lecture", // or "notes", "assignment", "notice"
  "batchId": "abc123" // Optional for linking in Firestore later
}
```
- **Response**:
```json
{
  "uploadUrl": "https://...",
  "fileUrl": "https://your-bucket.s3.amazonaws.com/filename.ext",
  "key": "path/to/file.ext",
  "message": "Pre-signed URL generated successfully"
}
```

### Confirm Upload

- **URL**: `/api/confirm-upload`
- **Method**: `POST`
- **Request Body**:
```json
{
  "fileUrl": "https://your-bucket.s3.amazonaws.com/filename.ext",
  "fileCategory": "lecture",
  "batchId": "abc123",
  "fileName": "lecture.mp4"
}
```
- **Response**:
```json
{
  "message": "File reference saved successfully",
  "data": {
    "id": "firestore-doc-id",
    "fileName": "lecture.mp4",
    "fileUrl": "https://your-bucket.s3.amazonaws.com/filename.ext",
    "category": "lecture",
    "batchId": "abc123",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

## Deployment to AWS EC2

1. SSH into your EC2 instance:
```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
```

2. Install Node.js and npm:
```bash
curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs
```

3. Install PM2 globally:
```bash
sudo npm install pm2 -g
```

4. Clone the repository and set up the project:
```bash
git clone https://github.com/your-username/paatthya-educator-backend.git
cd paatthya-educator-backend
npm install
```

5. Create the `.env` file with your production values.

6. Start the application with PM2:
```bash
pm2 start index.js --name paatthya-backend
pm2 startup
pm2 save
```

### Optional: Set up Nginx as a reverse proxy

1. Install Nginx:
```bash
sudo amazon-linux-extras install nginx1
```

2. Create Nginx config:
```bash
sudo nano /etc/nginx/conf.d/paatthya.conf
```

3. Add the configuration:
```
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. Test and restart Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

5. Configure your EC2 security group to allow traffic on ports 80 (HTTP) and 443 (HTTPS).

## License

MIT 