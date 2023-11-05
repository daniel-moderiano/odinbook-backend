⚠️ NOTE: [Odinbook](https://odinbook-dzwi.onrender.com/) is now hosted on [render](https://render.com/) to avoid ongoing costs associated with the prior AWS hosting setup. 

# Odinbook backend
This is the backend repository for [odinbook](https://odinbook-dzwi.onrender.com/) - a social media website created as part of [The Odin Project](https://www.theodinproject.com/) NodeJS course. This repository contains all the server-side code for odinbook, with information on the features and technologies used. For a general overview of odinbook, or detailed information on the frontend, please visit the following links:

Visit the [frontend repository »](https://github.com/daniel-moderiano/odinbook-frontend)

Visit the [parent repository »](https://github.com/daniel-moderiano/odinbook)


## About the project

_NOTE: The following AWS architecture has been decommissioned in favour of a free hosting alternative._ 

The odinbook backend is an express/nodeJS server that integrates with MongoDB to provide all the basic underlying features you would find in a social media application. This server is running with NGINX from a single EC2 instance on AWS, and uses Route 53 for DNS management. It uses a simple single-subnet VPC shown below. The server also serves the odinbook frontend from this location.

![case-1_updated](https://user-images.githubusercontent.com/59184832/213827737-27f55c6c-f660-4b6a-8eb3-38bd348f28c0.png)

### Features

* **Session-based authentication:** users can authenticate with odinbook using a session-based authentication system. This authentication system also supports Facebook login.
* **Image upload, storage, and analysis:** images can be added to user's profiles or posts, and updated as needed. The odinbook backend stores images using Cloudinary's API. Microsoft Azure's Computer Vision API is also integrated to provide human-readable descriptions for user uploaded images (used as alt-text on frontend).
* **Comprehensive test suite:** Jest and supertest have been used to add tests for as many controllers and helper functions as possible, with good overall test coverage.
* **REST API:** the odinbook backend API is structured as using REST API principles as much as practicable.

### Technologies used

At it's core, the odinbook backend is a NodeJS/Express application with MongoDB for data storage. Other major third party APIs are also listed here.

* [NodeJS](https://nodejs.org/en/) - JavaScript runtime
* [Express](https://expressjs.com/) - NodeJS web application framework
* [MongoDB](https://www.mongodb.com/) - Application database platform
* [Cloudinary](https://cloudinary.com/) - Image upload and storage
* [Azure Computer Vision](https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/#overview) - AI image analysis
* [Jest](https://jestjs.io/) - JavaScript testing framework
* [AWS](https://aws.amazon.com/) - Cloud Computing Services

## Acknowledgments

The following resources were a great help throughout the development of the odinbook backend.

* [Randall Deggess](https://www.rdegges.com/) and his NodeJS/JWT authentication talks
* [Traversy Media](https://www.youtube.com/channel/UC29ju8bIPH5as8OGnQzwJyA) for general MERN stack advice
* [Zach Gollwitzer](https://www.youtube.com/c/ZachGollwitzer) for the best Passport and Express session reference
* [Adrian Cantrill](https://learn.cantrill.io/) for in-depth, understanding-focused AWS courses
