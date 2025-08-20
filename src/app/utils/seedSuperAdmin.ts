import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedAdmin = async () => {
  try {
    const admin = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL });

    if (admin) {
      console.log("Super Admin already exists");
      return; // Exit if the admin already exists
    }
    console.log("Seeding Super Admin...");

    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
       Number(envVars.BCRYPT_SALT_ROUNDS)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Super Admin",
      role: Role.ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      auth: [authProvider],
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newAdmin = await User.create(payload);
    console.log("Super Admin seeded successfully:",);
    
  } catch (error) {
    console.log(error);
  }
};
