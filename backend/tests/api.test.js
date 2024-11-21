const request = require("supertest");
const app = require("../src/app"); // Expressアプリをインポート

describe("API Endpoints", () => {
  it("GET /api/meals - should return all meals", async () => {
    const res = await request(app).get("/api/meals");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data"); // 必要に応じて変更
  });

  it("POST /api/meals - should create a new meal record", async () => {
    const newMeal = {
      user_id: 1,
      category_id: 2,
      start_time: "2024-11-21T08:00:00Z",
      end_time: "2024-11-21T08:30:00Z",
    };
    const res = await request(app).post("/api/meals").send(newMeal);
    expect(res.statusCode).toEqual(201);
  });
});
