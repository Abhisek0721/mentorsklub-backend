import { DATABASE_NAME } from '@constants/index';
import { User } from '@modules/common/users/models/users.model';
import { Mentee } from '@modules/mentee/mentee_user/models/mentee.model';
import { Mentor } from '@modules/mentor/mentor_user/models/mentor.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import * as querystring from 'querystring';
import { ZoomCallbackType } from '../types/zoomCallbackResponse.type';

@Injectable()
export class ZoomService {
  constructor(
    @InjectModel(Mentor.name, DATABASE_NAME) private mentorModel: Model<Mentor>,
  ) {}

  // Redirect URI for OAuth callback
  private redirectUri = `${process.env.BACKEND_URL}/api/zoom/oauth/callback`;

  // OAuth 2.0 credentials
  private clientId = process.env.ZOOM_APP_CLIENT_ID;
  private clientSecret = process.env.ZOOM_APP_CLIENT_SECRET;

  // Zoom OAuth 2.0 authorization endpoint
  private authorizeUrl = 'https://zoom.us/oauth/authorize';

  // Zoom OAuth 2.0 token endpoint
  private tokenUrl = 'https://zoom.us/oauth/token';

  // Zoom API endpoint for creating a meeting
  private createMeetingUrl = 'https://api.zoom.us/v2/users/me/meetings';

  generateAuthorizeUrl(userId: string): string {
    const params = {
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: userId,
    };
    const url = `${this.authorizeUrl}?${querystring.stringify(params)}`;
    return url;
  }

  async zoomCallback(
    userId: string,
    zoomAuthorizationCode: string,
  ): Promise<ZoomCallbackType> {
    try {
      // Exchange authorization code for access token
      const params = {
        grant_type: 'authorization_code',
        code: zoomAuthorizationCode, // Use 'code' instead of 'zoomCode'
        redirect_uri: this.redirectUri,
      };
      const headers = {
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
      };
      const response = await axios.post(
        this.tokenUrl,
        querystring.stringify(params),
        { headers },
      );
      const { access_token, refresh_token } = response.data;
      return {
        userId,
        access_token,
        refresh_token,
      };
    } catch (error) {
      console.error('Failed to exchange code for token:', error.response.data);
      throw error; // Re-throw the error to be caught by the caller
    }
  }

  async saveZoomTokens(zoomTokens: ZoomCallbackType): Promise<Mentor> {
    const mentor = await this.mentorModel.findOneAndUpdate(
      {
        user: zoomTokens.userId,
      },
      {
        $set: {
          'zoomTokens.accessToken': zoomTokens.access_token,
          'zoomTokens.refreshToken': zoomTokens.refresh_token,
        },
      },
      {
        new: true,
      },
    );
    return mentor;
  }
}
