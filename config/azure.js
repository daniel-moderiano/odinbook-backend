const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;
require('dotenv').config();

// Authenticate a new ComputerVisionClient using the key and endpoint
// This Client will be used in all image analysis
const key = process.env.AZURE_KEY;
const endpoint = process.env.AZURE_ENDPOINT;

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);


module.exports = computerVisionClient;