import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default (req, res) =>
  NextAuth(req, res, {
    session: {
      jwt: true,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
    },
    providers: [
      Providers.Google({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
      }),
    ],
    database: {
      type: "mongodb",
      url: process.env.DATABASE_URL,
      useNewUrlParser: true,
    },
    pages: {
      signIn: "/",
    },
  });
