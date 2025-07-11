const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");
const Availability = require("../models/Availability");
const Appointment = require("../models/Appointment");

let studentA1Token, studentA2Token, professorToken;
let availabilityId, appointmentId;

beforeAll(async () => {
  // Connect to test DB (use a separate test database in .env)
  await mongoose.connect(process.env.MONGO_URI, { dbName: "test-db" });

  // Clear existing users, appointments, slots
  await User.deleteMany({});
  await Availability.deleteMany({});
  await Appointment.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("E2E Flow", () => {
  test("1. Register and login Student A1", async () => {
    await request(app).post("/api/auth/register").send({
      name: "A1",
      email: "a1@example.com",
      password: "123456",
      role: "student"
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "a1@example.com",
      password: "123456"
    });

    studentA1Token = res.body.token;
    expect(studentA1Token).toBeDefined();
  });

  test("2. Register and login Professor P1", async () => {
    await request(app).post("/api/auth/register").send({
      name: "P1",
      email: "p1@example.com",
      password: "123456",
      role: "professor"
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "p1@example.com",
      password: "123456"
    });

    professorToken = res.body.token;
    expect(professorToken).toBeDefined();
  });

  test("3. Professor adds availability", async () => {
    const res = await request(app)
      .post("/api/user/availability")
      .set("Authorization", `Bearer ${professorToken}`)
      .send({ date: "2025-07-05", time: "10:00 - 11:00 AM" });

    availabilityId = res.body._id;
    expect(res.status).toBe(201);
  });

  test("4. Student A1 views availability slots", async () => {
    const profRes = await request(app)
      .get("/api/auth/login") // reuse to get prof id
      .send({ email: "p1@example.com", password: "123456" });

    const profId = (await User.findOne({ email: "p1@example.com" }))._id;

    const res = await request(app)
      .get(`/api/user/${profId}/availability`)
      .set("Authorization", `Bearer ${studentA1Token}`);

    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]._id).toBe(availabilityId);
  });

  test("5. Student A1 books appointment", async () => {
    const prof = await User.findOne({ email: "p1@example.com" });

    const res = await request(app)
      .post("/api/booking")
      .set("Authorization", `Bearer ${studentA1Token}`)
      .send({
        professorId: prof._id,
        availabilityId
      });

    appointmentId = res.body._id;
    expect(res.status).toBe(201);
  });

  test("6. Student A2 registers and books another slot", async () => {
    await request(app).post("/api/auth/register").send({
      name: "A2",
      email: "a2@example.com",
      password: "123456",
      role: "student"
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "a2@example.com",
      password: "123456"
    });

    studentA2Token = loginRes.body.token;

    // professor adds another slot
    const slotRes = await request(app)
      .post("/api/user/availability")
      .set("Authorization", `Bearer ${professorToken}`)
      .send({ date: "2025-07-06", time: "12:00 - 01:00 PM" });

    const anotherSlotId = slotRes.body._id;

    const prof = await User.findOne({ email: "p1@example.com" });

    const res = await request(app)
      .post("/api/booking")
      .set("Authorization", `Bearer ${studentA2Token}`)
      .send({
        professorId: prof._id,
        availabilityId: anotherSlotId
      });

    expect(res.status).toBe(201);
  });

  test("7. Professor cancels A1's appointment", async () => {
    const res = await request(app)
      .delete(`/api/booking/${appointmentId}`)
      .set("Authorization", `Bearer ${professorToken}`);

    expect(res.body.message).toBe("Appointment canceled");
  });

  test("8. A1 checks appointments (should be empty)", async () => {
    const res = await request(app)
      .get("/api/booking/me")
      .set("Authorization", `Bearer ${studentA1Token}`);

    expect(res.body).toEqual([]); // should return an empty array
  });
});
