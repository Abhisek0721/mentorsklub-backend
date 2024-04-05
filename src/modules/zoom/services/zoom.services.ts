import { DATABASE_NAME } from '@constants/index';
import { Mentor } from '@modules/mentor/mentor_user/models/mentor.model';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model, Types } from 'mongoose';
import * as querystring from 'querystring';
import { ZoomCallbackType } from '../types/zoomCallbackResponse.type';
import { CreateMeetLinkType } from '../types/createMeetLinkResponse.type';

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
      const tokenExpiresAt = Date.now() + response.data.expires_in * 1000;
      // Convert expires_in to milliseconds
      return {
        userId,
        access_token,
        refresh_token,
        tokenExpiresAt,
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
          'zoomTokens.tokenExpiresAt': zoomTokens.tokenExpiresAt,
        },
      },
      {
        new: true,
      },
    );
    return mentor;
  }

  // Function to refresh access token
  async refreshToken(
    userId: string | Types.ObjectId,
    refreshToken: string,
  ): Promise<string> {
    const params = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };
    const headers = {
      Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
    };

    try {
      const response = await axios.post(
        this.tokenUrl,
        querystring.stringify(params),
        { headers },
      );
      const accessToken = response.data.access_token;
      refreshToken = response.data.refresh_token;
      const tokenExpiresAt = Date.now() + response.data.expires_in * 1000; // Convert expires_in to milliseconds
      const mentor = await this.mentorModel
        .findOneAndUpdate(
          {
            user: userId,
          },
          {
            $set: {
              'zoomTokens.accessToken': accessToken,
              'zoomTokens.refreshToken': refreshToken,
              'zoomTokens.tokenExpiresAt': tokenExpiresAt,
            },
          },
          {
            new: true
          }
        )
        .select('zoomTokens');
      return mentor.zoomTokens.accessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error.response.data);
      throw error;
    }
  }

  async createZoomMeetingLink(
    userId: string | Types.ObjectId,
    meetTopic: string,
    startTime: Date,
    durationInMinute: number = 40,
  ): Promise<CreateMeetLinkType> {
    try {
      const mentor = await this.mentorModel
        .findOne({
          user: userId,
        })
        .select('_id zoomTokens');

      if (!mentor?.zoomTokens?.refreshToken) {
        throw new ForbiddenException('You are not authorized to zoom yet.');
      }
      let accessToken = mentor.zoomTokens.accessToken;
      if (!accessToken || new Date() >= mentor.zoomTokens.tokenExpiresAt) {
        accessToken = await this.refreshToken(
          userId,
          mentor.zoomTokens.refreshToken,
        );
      }
      // Create a Zoom meeting
      const meetingParams = {
        topic: meetTopic,
        type: 2, // Scheduled meeting
        settings: {
          join_before_host: true,
          approval_type: 0, // "automatically approve" or "no registration required"
          registration_type: 0, //  join without registration
        },
        duration: durationInMinute, // Meeting duration in minutes
        // timezone: 'Asia/Kolkata', // Set the timezone for the meeting
        start_time: startTime,
      };
      const meetingHeaders = {
        Authorization: `Bearer ${accessToken}`,
      };
      const meetingResponse = await axios.post(
        this.createMeetingUrl,
        meetingParams,
        {
          headers: meetingHeaders,
        },
      );
      const { join_url } = meetingResponse.data;
      return {
        mentorId: mentor._id,
        join_url: join_url,
      };
    } catch (error) {
      console.error('Error in createZoomMeetLink:', error?.response?.data);
      throw error;
    }
  }
}
