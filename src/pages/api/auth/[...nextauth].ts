import { query as q } from "../../../../node_modules/faunadb/index";

import NextAuth from "../../../../node_modules/next-auth/index";
import GithubProvider from "../../../../node_modules/next-auth/providers/github";

import { fauna } from "../../../services/fauna";

export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            scope: 'read:user',
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }): Promise<boolean> {
            const { email } = user;

            try {
                await fauna.query(
                    q.If(
                        q.Not(
                            q.Exists(
                                q.Match(q.Index('user_by_email'), q.Casefold(user.email)),
                            ),
                        ),
                        q.Create(q.Collection('users'), { data: { email } }),
                        q.Get(q.Match(q.Index('user_by_email'), q.Casefold(user.email))),
                    ),
                );
                return true
            } catch {
                return false;
            }
        },
    },
})
