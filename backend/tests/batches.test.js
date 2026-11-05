const request = require("supertest");
const app = require("../src/app");

describe("GET /api/batches", () => {
  test("returns the first page with five records by default", async () => {
    const response = await request(app).get("/api/batches");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(5);
    expect(response.body.pagination.totalRecords).toBe(12);
  });

  test("searches batch code and course name", async () => {
    const response = await request(app).get("/api/batches?search=react");
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].courseName).toBe("React Development");
  });

  test("combines status and centre filters", async () => {
    const response = await request(app).get("/api/batches?status=Running&centre=London-HQ");
    expect(response.status).toBe(200);
    expect(response.body.data.every((item) => item.status === "Running" && item.centreName === "London-HQ")).toBe(true);
  });

  test("rejects invalid pagination values", async () => {
    const response = await request(app).get("/api/batches?page=0");
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("returns an empty list for no matches", async () => {
    const response = await request(app).get("/api/batches?search=does-not-exist");
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(0);
    expect(response.body.pagination.totalPages).toBe(0);
  });
});
