FROM nginx:alpine

# Copy custom nginx configuration if needed (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Copy static frontend files to nginx html directory
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
