import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';

import User from '@models/user';
import { connectToDB } from '@utils/database';

// handler funtion would be exported so that we can handle the O-Auth of an user

// console.log({
//     clientId: process.env.GOOGLE_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECERT,
// });

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECERT,
        }),
    ],
    callbacks: {
        // serverless function -> lambda funtion

        async session({ session }) {
            const sessionUser = await User.findOne({
                email: session.user.email,
            });

            session.user.id = sessionUser._id.toString();
            return session;
        },
        async signIn({ profile }) {
            try {
                await connectToDB();

                // check if user already exists
                const userExists = await User.findOne({
                    email: profile.email,
                });

                // if not, create new user
                if (!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name,
                        image: profile.picture,
                    });
                }

                return true;
            } catch (err) {
                console.log(err);
            }
        },
    },
});

export { handler as GET, handler as POST };