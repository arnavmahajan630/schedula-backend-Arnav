import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Request } from 'express';
import { UserRole } from '../enums/user.enums';

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
  ): googleUser {
    // Extract role from state parameter
    let role: UserRole = UserRole.PATIENT; // Default role
    const roleFromState = request.query.state as string;

    if (
      (roleFromState as UserRole) === UserRole.DOCTOR ||
      (roleFromState as UserRole) === UserRole.PATIENT
    ) {
      role = roleFromState as UserRole;
    }

    const user: googleUser = {
      email: profile.emails?.[0]?.value || '',
      firstName: profile.name?.givenName || '',
      lastName: profile.name?.familyName || '',
      profilePicture: profile.photos?.[0]?.value,
      role,
    };

    return user;
  }
}
