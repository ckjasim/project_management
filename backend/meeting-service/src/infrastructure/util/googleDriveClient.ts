import axios from "axios";
import { google, drive_v3 } from "googleapis";

export const getDriveClient = async (accessToken: string): Promise<drive_v3.Drive | null> => {
  try {
    console.log("Validating Access Token...",accessToken);
    
    // Use updated endpoint for token validation
    const tokenInfoResponse = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`
    );

    if (tokenInfoResponse?.data?.expires_in <= 0) {
      console.error("Access token has expired or is invalid.");
      return null;
    }

    console.log("Token Info:", tokenInfoResponse.data);

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: "v3", auth: oauth2Client });
    console.log("Drive Client Initialized Successfully");

    return drive;
  } catch (error: any) {
    console.error("Error occurred while initializing Google Drive client:");

    // Detailed Axios error handling
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.message);
      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Status Code:", error.response.status);
      }
    } else {
      console.error("General Error:", error.message || "Unknown error");
    }

    return null;
  }
};
