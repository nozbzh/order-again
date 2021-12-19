import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "models/User";

export default NextAuth({
  secret: process.env.JWT_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        let dbUser = await User.findByEmail(user.email);

        if (!dbUser) {
          dbUser = await User.create({ email: user.email, name: user.name });
        }

        if (!dbUser) {
          throw new Error(
            "We are having trouble siging you in. Please try again later."
          );
        }

        token.userId = dbUser.id;
      }
      return token;
    },
  },
  providers: [
    // OAuth authentication providers...
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_ID,
    //   clientSecret: process.env.FACEBOOK_SECRET,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // Passwordless / email sign in
    // EmailProvider({
    //   server: process.env.MAIL_SERVER,
    //   from: "NextAuth.js <no-reply@example.com>",
    // }),
  ],
});
