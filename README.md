This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Set up MQTT broker
- disable Mosquitto broker: `systemctl stop mosquitto` -> `systemctl disable mosquitto`
- check the port is already used or not: `sudo lsof -i :18883`
- kill port `sudo kill -9 <PID>`
- set up EMQX broker in docker: `docker run -d --name emqx -p 1883:1883 -p 8083:8083 -p 8084:8084 -p 8883:8883 -p 18083:18083 emqx/emqx`


To set up an HTTPS reverse proxy using Nginx, follow these steps. This configuration will enable Nginx to handle HTTPS requests and forward them to your backend application (e.g., NestJS) running in a Docker container.

Step 1: Install Nginx
If Nginx isn’t already installed, install it on your server:

bash
Sao chép mã
sudo apt update
sudo apt install nginx
Step 2: Obtain an SSL Certificate
For production, you can get a free SSL certificate from Let’s Encrypt. For development, you could use self-signed certificates.

To use Let’s Encrypt:

Install Certbot:

bash
Sao chép mã
sudo apt install certbot python3-certbot-nginx
Run Certbot to get the certificate:

bash
Sao chép mã
sudo certbot --nginx -d your-domain.com
Replace your-domain.com with your actual domain. Certbot will automatically configure Nginx to use HTTPS with the certificate.

If Certbot doesn’t automatically configure Nginx for you, you’ll need to configure it manually (see Step 3 below). Certbot will save the certificate files in /etc/letsencrypt/live/your-domain.com/.

Step 3: Configure Nginx as an HTTPS Reverse Proxy
Open or create a new Nginx configuration file in /etc/nginx/sites-available/your-domain.com with the following content:

nginx
Sao chép mã
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    # SSL certificate files
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL settings for security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # Proxy settings
    location / {
        proxy_pass http://localhost:8080;  # Replace with your backend's port
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
Replace:

your-domain.com with your actual domain.
localhost:8080 with the internal address and port where your backend (e.g., NestJS) is running.
Enable the configuration by creating a symbolic link to sites-enabled:

bash
Sao chép mã
sudo ln -s /etc/nginx/sites-available/your-domain.com /etc/nginx/sites-enabled/
Test the Nginx configuration for syntax errors:

bash
Sao chép mã
sudo nginx -t
Reload Nginx to apply the changes:

bash
Sao chép mã
sudo systemctl reload nginx
Step 4: Adjust Docker Settings (Optional)
If your backend service is running in Docker and you’re not directly exposing it to the public network, make sure the Docker container exposes the necessary internal port (e.g., 8080).

In your docker-compose.yml, ensure the backend service is configured as follows:

yaml
Sao chép mã
services:
  backend:
    image: your-backend-image
    ports:
      - "8080:8080"  # Internal port for Nginx to access
Step 5: Verify the Setup
Access your application using https://your-domain.com to verify that Nginx is correctly proxying requests to your backend over HTTPS.
If you encounter a security warning (self-signed certificate in development), proceed by clicking through the warning or replace it with a Let’s Encrypt certificate for production use.
Notes
Automatic Certificate Renewal: Let’s Encrypt certificates expire every 90 days. To automate renewal, you can set up a cron job:
bash
Sao chép mã
sudo crontab -e
Add this line to run the renewal check daily:
bash
Sao chép mã
0 0 * * * certbot renew --quiet
This setup should enable HTTPS access for your backend securely through Nginx!

