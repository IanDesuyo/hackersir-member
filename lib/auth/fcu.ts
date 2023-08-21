import type { User } from "next-auth";
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";

export interface FcuProfile extends Record<string, any> {
  id: string;
  name: string;
  type: "學生" | "教職員工" | string;
  classname: string;
  unit_id: string;
  unit_name: string;
  dept_id: string;
  dept_name: string;
  Email: string;
}

export default function Fcu<P extends FcuProfile>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  return {
    id: "fcu-nid",
    name: "FCU NID",
    type: "oauth",
    checks: ["none"],
    authorization: {
      url: "https://opendata.fcu.edu.tw/fcuOAuth/Auth.aspx",
      params: {
        client_url: `${process.env.NEXTAUTH_URL}/api/auth/school/fcu`, // TODO: use next-auth's callbackUrl
      },
    },
    token: {
      request({ params }) {
        return {
          tokens: {
            access_token: params.code,
            expires_at: new Date().getTime() + 10 * 1000, // 10 seconds
          },
        };
      },
    },
    userinfo: {
      async request({ tokens }) {
        if (!tokens.access_token) {
          return {};
        }

        const response = await fetch(
          "https://opendata.fcu.edu.tw/fcuapi/api/GetUserInfo" +
            `?client_id=${options.clientId}&user_code=${tokens.access_token}`
        );

        const { UserInfo } = (await response.json()) as { UserInfo: P[] };

        // API should return an array with a single user profile
        if (UserInfo.length !== 1 || !UserInfo[0]?.id) {
          return {};
        }

        return UserInfo[0];
      },
    },
    profile(profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.image,
      } as User;
    },
    style: {
      logo: "../../static/vendors/fcu-nid.png",
      logoDark: "../../static/vendors/fcu-nid.png",
      bgDark: "#fff",
      bg: "#fff",
      text: "#000",
      textDark: "#000",
    },
    options,
  };
}
