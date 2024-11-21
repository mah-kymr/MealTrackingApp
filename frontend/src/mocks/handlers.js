import { rest } from "msw";

export const handlers = [
  rest.get("/api/meals", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ data: [{ id: 1, category: "Breakfast" }] })
    );
  }),
];
