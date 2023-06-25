import ky, { KyInstance } from "ky";

export function newWithToken(token: string): KyInstance {
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
