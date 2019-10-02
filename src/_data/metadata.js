require('dotenv').config()
const environment = process.env.ENVIRONMENT;
if (environment == "dev") { var path = "http://localhost:3000"; } else { var path = "https://www.d-hagemeier.com"; };

module.exports = {
  "title": "Dennis Hagemeier | Marketing, Code & Design",
  "description": "Blog about Marketing, Code & Design",
  "url": path,
  "type": "website",
  "name": "Dennis Hagemeier",
  "email": "hello@d-hagemeier.com",
  "social": {
    "linkedin": {
      "name": "Dennis Hagemeier",
      "url": "https://www.linkedin.com/in/dennishagemeier"
    },
    "twitter": {
      "name": "DennisView",
      "url": "https://twitter.com/DennisView"
    },
    "xing": {
      "name": "Dennis Hagemeier",
      "url": "https://www.xing.com/profile/Dennis_Hagemeier/"
    },
    "instagram": {
      "name": "@dennis.hagemeier",
      "url": "https://www.instagram.com/dennis.hagemeier/"
    },
    "github": {
      "name": "dennishagemeier",
      "url": "https://github.com/dennishagemeier",
      "source": "https://github.com/dennishagemeier/d-hagemeier"
    }
  }
};