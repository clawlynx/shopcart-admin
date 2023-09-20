import clientPromise from "../../../../lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import { signOut } from "next-auth/react";

const adminMails = ["clawlynx77@gmail.com", "shafishahuldq@gmail.com"];
const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session, user, token }) {
      if (adminMails.includes(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
};
export default options;
