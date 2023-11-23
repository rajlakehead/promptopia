import { connectToDB } from "@utils/database";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import User from "@models/users";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId:
        "686376580444-6gfmje7m097rmn4aegsqqp7ve5jdjfdd.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
    callbacks: {
      async session({ session }) {
        const sessionUser = await User.findOne({ email: session.user.email });
        session.user.id = sessionUser._id.toString();
    
        return session;
      },
      async signIn({ profile }) {
        try {
          await connectToDB();
    
          // check if user already exists
          const userExists = await User.findOne({ email: profile.email });
    
          // if not, create a new document and save user in MongoDB
          if (!userExists) {
            await User.create({
              email: profile.email,
              username: profile.name.replace(" ", "").toLowerCase(),
              image: profile.picture,
            });
          }
    
          return true;
        } catch (error) {
          console.log("Error checking if user exists: ", error.message);
          return false;
        }
      },

  }
  
});

export { handler as GET, handler as POST };
