/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";

jest.mock("mongoose", () => ({
  connect: jest.fn(),
  connection: {},
  Connection: jest.fn(),
}));

describe("connectToDatabase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).mongoose = { conn: null, promise: null };
  });

  it("should create new connection when cache is empty", async () => {
    process.env.MONGODB_URI = "mongodb://localhost:27017/test";
    const mockConnection = { readyState: 1 };
    const mockConnect = mongoose.connect as jest.MockedFunction<
      typeof mongoose.connect
    >;
    mockConnect.mockResolvedValue({ connection: mockConnection } as any);

    await connectToDatabase();
    expect(mockConnect).toHaveBeenCalled();
  });

  it("should return cached connection when available", async () => {
    process.env.MONGODB_URI = "mongodb://localhost:27017/test";
    const mockConnection = { readyState: 1 };
    (global as any).mongoose = { conn: mockConnection, promise: null };

    const result = await connectToDatabase();
    expect(result).toStrictEqual(mockConnection);
  });
});
