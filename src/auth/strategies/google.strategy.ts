import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Request } from 'express';
import { UserRole } from '../dto/user.dto';

interface StateParam {
  role: UserRole;
}

export interface googleUser {
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  role: UserRole;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  validate(
    request: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    // Extract role from state parameter
    let role: UserRole = UserRole.PATIENT; // Default role
    if (request.query.state) {
      try {
        const stateParam = request.query.state as string;
        const state = JSON.parse(
          Buffer.from(stateParam, 'base64url').toString(),
        ) as StateParam;

        role = state.role;
      } catch (e) {
        console.error('Invalid state parameter:', e);
        return done(new Error('Invalid state parameter'));
      }
    }

    const user: googleUser = {
      email: profile.emails?.[0]?.value || '',
      firstName: profile.name?.givenName || '',
      lastName: profile.name?.familyName || '',
      profilePicture: profile.photos?.[0]?.value,
      role,
    };

    done(null, user);
  }
}
