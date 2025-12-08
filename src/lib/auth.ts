import { passkeyClient } from "@better-auth/passkey/client";
import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, admin, supervisor, user } from "./permissions";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3333",
  plugins: [
    passkeyClient(),
    adminClient({
      ac,
      roles: {
        user,
        admin,
        supervisor,
      },
    }),
  ],
});
