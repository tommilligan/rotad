import ky from "ky";

export type GoogleClient = any;

export function newWithToken(token: string): GoogleClient {
  const api = ky.extend({
    hooks: {
      beforeRequest: [
        (request) => {
          request.headers.set("Authorization", `Bearer ${token}`);
        },
      ],
    },
  });
  return api;
}
