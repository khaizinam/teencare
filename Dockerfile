FROM node:22-slim
WORKDIR /app

# Container sẽ chỉ dùng để cung cấp môi trường Node.js.
# Source code và thư viện sẽ được mount trực tiếp từ máy thật vào.
