FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

# Install wget (if not already present)
RUN apt-get update && apt-get install -y wget

# Create directories for vendor files
RUN mkdir -p public/js/vendor public/css

# Download JavaScript files
RUN wget -O public/js/vendor/jquery-3.5.1.min.js https://code.jquery.com/jquery-3.5.1.min.js && ls -l public/js/vendor/jquery-3.5.1.min.js
RUN wget -O public/js/vendor/popper.min.js https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js
RUN wget -O public/js/vendor/bootstrap.min.js https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js
RUN wget -O public/js/vendor/ethers.umd.min.js https://cdn.jsdelivr.net/npm/ethers@6.15.0/dist/ethers.umd.min.js

# Download CSS file
RUN wget -O public/css/bootstrap.min.css https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css

COPY . .

EXPOSE 9000

CMD [ "npm", "start" ]
