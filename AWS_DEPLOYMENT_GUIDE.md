# Next.js AWS EC2 Deployment Guide for Beginners

This guide will walk you through deploying your Next.js application to AWS EC2 using GitHub Actions for CI/CD.

## Prerequisites
- AWS Account
- GitHub Account
- Basic terminal/command line knowledge

## Step 1: Set up AWS EC2 Instance

### 1.1 Launch EC2 Instance
1. Log into AWS Console → EC2 Dashboard
2. Click "Launch Instance"
3. Choose **Ubuntu Server 22.04 LTS** (free tier eligible)
4. Instance type: **t2.micro** (free tier)
5. Create new key pair:
   - Name: `my-nextjs-key`
   - Type: RSA
   - Format: .pem
   - **Download and save the .pem file securely**
6. Security Group settings:
   - SSH (22) - Your IP
   - HTTP (80) - Anywhere (0.0.0.0/0)
   - HTTPS (443) - Anywhere (0.0.0.0/0)
   - Custom TCP (3000) - Anywhere (for Next.js dev)
7. Launch Instance

### 1.2 Connect to EC2 Instance
```bash
# Make key file secure (Mac/Linux)
chmod 400 my-nextjs-key.pem

# Connect to instance
ssh -i my-nextjs-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

## Step 2: Setup EC2 Environment

### 2.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 Install Node.js and npm
```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2.3 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 2.4 Install Nginx (Optional - for production)
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 3: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `EC2_SSH_KEY`: Contents of your .pem file
- `HOST_IP`: Your EC2 public IP address
- `USERNAME`: ubuntu (for Ubuntu instances)

### How to get SSH key content:
```bash
# On your local machine
cat my-nextjs-key.pem
# Copy the entire output including BEGIN/END lines
```

## Step 4: Test Manual Deployment

### 4.1 Clone your repository on EC2
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### 4.2 Install dependencies and build
```bash
npm install
npm run build
```

### 4.3 Start application
```bash
# Start with PM2
pm2 start npm --name "next-aws-deploy" -- start

# Check status
pm2 status

# View logs
pm2 logs next-aws-deploy
```

### 4.4 Test your application
Visit `http://YOUR_EC2_PUBLIC_IP:3000` in browser

## Step 5: Configure Production Setup (Optional)

### 5.1 Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/nextjs-app
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/nextjs-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 6: Push to GitHub and Test CI/CD

1. Commit and push your changes:
```bash
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

2. Go to GitHub → Actions tab to watch the deployment

3. If successful, visit your EC2 IP address to see the deployed app

## Common Issues & Solutions

### Issue 1: SSH Connection Failed
- Check security group allows SSH (port 22)
- Verify your IP address is whitelisted
- Ensure .pem file permissions are 400

### Issue 2: GitHub Actions Deployment Fails
- Verify all GitHub secrets are correctly set
- Check EC2 instance is running
- Ensure security group allows SSH from GitHub Actions IPs

### Issue 3: Application Not Accessible
- Check if PM2 process is running: `pm2 status`
- Verify port 3000 is open in security group
- Check application logs: `pm2 logs nextjs-app`

### Issue 4: Build Fails
- Ensure package.json scripts are correct
- Check for TypeScript errors: `npm run lint`
- Verify Node.js version compatibility

## Next Steps

1. **Domain Setup**: Configure a domain name with Route 53
2. **SSL Certificate**: Use Let's Encrypt or AWS Certificate Manager
3. **Environment Variables**: Set up `.env` files for different environments
4. **Database**: Connect to RDS or MongoDB Atlas
5. **Monitoring**: Set up CloudWatch or other monitoring tools
6. **Auto Scaling**: Configure load balancers and auto-scaling groups

## Useful Commands

```bash
# EC2 Management
pm2 start npm --name "nextjs-app" -- start
pm2 stop nextjs-app
pm2 restart nextjs-app
pm2 delete nextjs-app
pm2 logs nextjs-app

# System Management
sudo systemctl status nginx
sudo systemctl restart nginx
htop  # Monitor system resources

# Git Operations
git pull origin main  # Update code manually
```

This setup gives you a complete CI/CD pipeline that automatically deploys your Next.js app to EC2 whenever you push to the main branch!