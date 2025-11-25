FROM ollama/ollama:latest
RUN apt-get update && \
    apt-get install -y curl ca-certificates && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY public ./public
COPY package*.json index.js start.sh ./
RUN npm ci
RUN chmod +x start.sh
EXPOSE 80
ENTRYPOINT ["/app/start.sh"]