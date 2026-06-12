# ==========================================================================
# Dockerfile for DevOps Personal Portfolio Website
# Base Image: Lightweight Alpine-based Nginx Web Server
# ==========================================================================
FROM nginx:alpine

# Copy static assets to the default Nginx document root
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY projects.json /usr/share/nginx/html/

# Expose Port 80 for HTTP Traffic
EXPOSE 80

# Run Nginx in the foreground to keep the container active
CMD ["nginx", "-g", "daemon off;"]
