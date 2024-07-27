const axios = require("axios");
const path = require("path");
const cheerio = require("cheerio");
const { spawn } = require("child_process");
const { decodeBase64 } = require("../01-utils/decode");
const logger = require("../01-utils/logger");

//! Message
// {
//   "id": string,
//   "threadId": string,
//   "labelIds": [
//     string
//   ],
//   "snippet": string,
//   "historyId": string,
//   "internalDate": string,
//   "payload": {
//     object (MessagePart)
//   },
//   "sizeEstimate": integer,
//   "raw": string
// }
//! MessagePart
// {
//   "partId": string,
//   "mimeType": string,
//   "filename": string,
//   "headers": [
//     {
//       object (Header)
//     }
//   ],
//   "body": {
//     object (MessagePartBody)
//   },
//   "parts": [
//     {
//       object (MessagePart)
//     }
//   ]
// }
//! MessagePartBody
// {
//   "attachmentId": string,
//   "size": integer,
//   "data": string
// }

//! Returns:
// "data": {
//   "messages": [
//     {
//       object (Message)
//     }
//   ],
//   "nextPageToken": string,
//   "resultSizeEstimate": integer
// }
const getEmailList = async (accessToken, maxResults) => {
  try {
    const emailList = await axios.get(
      "https://www.googleapis.com/gmail/v1/users/me/messages",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          maxResults: maxResults,
          q: "", // You can use search queries here if needed
        },
      }
    );
    return emailList.data.messages;
  } catch (error) {
    logger.error({ error });
  }
};

//! Returns
// "data": {
//   "id": string,
//   "threadId": string,
//   "labelIds": [
//     string
//   ],
//   "snippet": string,
//   "historyId": string,
//   "internalDate": string,
//   "payload": {
//     object (MessagePart)
//   },
//   "sizeEstimate": integer,
//   "raw": string
// }
const getEmail = async (accessToken, messageId) => {
  try {
    const messageResponse = await axios.get(
      `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const messageContent = extractEmailText(messageResponse);
    return messageContent;
  } catch (error) {
    logger.error({ error });
  }
};

const extractEmailText = (messageResponse) => {
  let plainTextContent = "";

  const processParts = (parts) => {
    parts.forEach((part) => {
      if (part.mimeType === "text/plain") {
        plainTextContent += decodeBase64(part.body.data) + "\n\n";
      } else if (part.mimeType === "text/html") {
        const htmlContent = decodeBase64(part.body.data);
        const $ = cheerio.load(htmlContent);
        plainTextContent += $("body").text().trim() + "\n\n";
      } else if (part.parts) {
        // Recursive call for nested parts
        processParts(part.parts);
      }
    });
  };

  let payload = messageResponse.data.payload;
  if (payload.parts && payload.parts.length > 0) {
    processParts(payload.parts);
  } else {
    // Handle single part payload
    if (payload.mimeType === "text/plain") {
      plainTextContent = decodeBase64(payload.body.data);
    } else if (payload.mimeType === "text/html") {
      const htmlContent = decodeBase64(payload.body.data);
      const $ = cheerio.load(htmlContent);
      plainTextContent = $("body").text().trim();
    }
  }

  return plainTextContent.trim();

  //   let plainTextContent = "";

  //   let payload = messageResponse.data.payload;
  //   if (payload.parts && payload.parts.length > 0) {
  //     // Iterate through each part to find text/plain or text/html content
  //     payload.parts.forEach((part) => {
  //       if (part.mimeType === "text/plain") {
  //         plainTextContent += decodeBase64(part.body.data) + "\n\n";
  //       } else if (part.mimeType === "text/html") {
  //         const htmlContent = decodeBase64(part.body.data);
  //         const $ = cheerio.load(htmlContent);
  //         const textFromHtml = $("body").text().trim();
  //         plainTextContent += textFromHtml + "\n\n";
  //       }
  //     });
  //   } else {
  //     // If there are no parts, assume the whole payload is the message body
  //     if (payload.mimeType === "text/plain") {
  //       plainTextContent = decodeBase64(payload.body.data);
  //     } else if (payload.mimeType === "text/html") {
  //       const htmlContent = decodeBase64(payload.body.data);
  //       const $ = cheerio.load(htmlContent);
  //       plainTextContent = $("body").text().trim();
  //     }
  //   }

  //   return plainTextContent.trim();
};

function processEmail(data) {
  return new Promise((resolve, reject) => {
    const pythonExecutable = "../venv/bin/python";
    const pythonProcess = spawn(pythonExecutable, [
      "./src/04-services/python.service.py",
    ]);

    pythonProcess.stdin.write(JSON.stringify(data));
    pythonProcess.stdin.end();

    let result = "";

    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      reject(data.toString());
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(`Python script exited with code ${code}`);
      } else {
        try {
          const jsonResult = JSON.parse(result);
          resolve(jsonResult);
        } catch (error) {
          reject(`Failed to parse JSON: ${error.message}`);
        }
      }
    });
  });
}

module.exports = {
  getEmailList,
  getEmail,
  extractEmailText,
  processEmail,
};
