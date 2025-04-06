# Setting Up Slither Analysis API for DeFi Watchdog

This guide explains how to set up the Slither analysis API server on your VPS and configure it to work with your Vercel deployment.

## Prerequisites

- A VPS (you're using Contabo)
- Root access to the VPS
- Your DeFi Watchdog project deployed on Vercel

## Step 1: Install Dependencies on VPS

SSH into your VPS:

```bash
ssh root@89.147.103.119
```

Install required dependencies:

```bash
apt update
apt install -y python3 python3-pip nodejs npm git
```

Install PM2 for process management:

```bash
npm install -g pm2
```

## Step 2: Install Slither

```bash
pip3 install slither-analyzer
```

Verify it's installed:

```bash
slither --version
```

## Step 3: Create API Service Directory

```bash
mkdir -p /opt/defi-watchdog-api
cd /opt/defi-watchdog-api
```

Initialize a Node.js project:

```bash
npm init -y
npm install express cors body-parser
```

## Step 4: Create the server.js File

Create/edit the server.js file with the content from this repository.

## Step 5: Start the Service

```bash
pm2 start server.js
pm2 save
pm2 startup
```

Follow the instructions to ensure the service starts on server reboot.

## Step 6: Security Configuration

For production, you should secure your API:

1. Update CORS settings in server.js to only allow your Vercel domain:

```javascript
app.use(cors({
  origin: 'https://your-defi-watchdog.vercel.app'
}));
```

2. Set up a simple API key for authentication:

```javascript
// Add this to server.js
const API_KEY = 'your-secret-key-here';

// Add this middleware before your routes
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

3. Set up Nginx as a reverse proxy with SSL:

```bash
apt install -y nginx certbot python3-certbot-nginx
```

Create an Nginx config file:

```
server {
    listen 80;
    server_name analysis.your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Save it to `/etc/nginx/sites-available/defi-watchdog-api` and enable it:

```bash
ln -s /etc/nginx/sites-available/defi-watchdog-api /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

Get an SSL certificate:

```bash
certbot --nginx -d analysis.your-domain.com
```

## Step 7: Update Your Vercel Project

In your DeFi Watchdog project, update the tools-analyzer.js file to use your secured API endpoint:

```javascript
const response = await fetch('https://analysis.your-domain.com/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-secret-key-here'
  },
  body: JSON.stringify({
    sourceCode,
    contractName,
    tool: 'slither'
  }),
});
```

## Testing

Test your API with curl:

```bash
# Test basic connectivity
curl http://89.147.103.119:3001/ping

# Test Slither version
curl http://89.147.103.119:3001/version

# Test analysis with a simple contract
curl -X POST http://89.147.103.119:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "sourceCode": "pragma solidity ^0.8.0;\n\ncontract Test {\n    function unsafeFunction() public {\n        msg.sender.transfer(address(this).balance);\n    }\n\n    function checkOrigin() public view returns (bool) {\n        return tx.origin == msg.sender;\n    }\n}"
  }'
```

## Troubleshooting

If you encounter issues:

1. Check if the API server is running: `pm2 list`
2. Check the logs: `pm2 logs server`
3. Test API connectivity from your browser with the "Test API Connection" button
4. Ensure Slither is correctly installed: `slither --version`
5. Check for any CORS issues in your browser console
