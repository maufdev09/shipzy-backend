/* eslint-disable @typescript-eslint/no-explicit-any */
import  bcryptjs  from 'bcryptjs';
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";


passport.use(
  new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
  }, async (email: string, password: string, done) => {
    try {
      
        const isUserExists = await User.findOne({ email });
        
      
        if (!isUserExists) {
          return done(null, false, { message: "User does not exist" });
        }

        const isGoogleAuthenticated = isUserExists.auth.some(providerObject => providerObject.provider === "google");
        if (isGoogleAuthenticated && !isUserExists.password) {
          return done(null, false, { message: "Please login with Google or set a password by logging in with Google" });
        }


        const isPasswordMatch = await bcryptjs.compare(
    password as string,
    isUserExists.password as string
  );

  if (!isPasswordMatch) {
    return done(null, false, { message: "Invalid password" });
  }
  console.log();
  

  return done(null, isUserExists);

    } catch (error) {
      console.log(`Error in Local Strategy: ${error}`);
      done(error);
      
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "Email not found in profile" });
        }
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.SENDER,
            isVerified: true,
            auth: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }
        return done(null, user);
      } catch (error) {
        console.log(`Error in Google Strategy: ${error}`);

        return done(error);
      }
    }
  )
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(
  async (id: string, done: (err: any, user?: any) => void) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);
