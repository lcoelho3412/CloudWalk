import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { randomCreditLimit } from "../utils/creditLimitUtils";

export async function routes(app: FastifyInstance) {
  // POST /users: Create a new user
  app.post("/users", async (request, reply) => {
    const UserBodySchema = z.object({
      name: z.string().min(3),
    });

    const { name } = UserBodySchema.parse(request.body);

    await knex("users").insert({
      user_id: randomUUID(),
      name: name,
    });

    reply.status(201).send({ message: "User created successfully" });
  });

  // POST /emotions: Add an emotion to a specific user and update their credit limit
  app.post("/emotions", async (request, reply) => {
    const createEmotionBodySchema = z.object({
      user_id: z.string().uuid(), // Ensure user_id is a valid UUID
      emotion_type: z.enum(["positive", "negative"]), // 'positive' or 'negative' emotion
      intensity: z.number().int().min(1).max(10), // Intensity must be between 1 and 10
    });

    const { user_id, emotion_type, intensity } = createEmotionBodySchema.parse(
      request.body
    );

    try {
      // Check if the user exists
      const user = await knex("users").where({ user_id }).first();
      if (!user) {
        return reply.status(404).send({ error: "User not found" });
      }

      // Insert the emotion into the emotions table
      await knex("emotions").insert({
        user_id,
        emotion_type,
        intensity,
      });

      // Calculate the new credit limit based on the emotion
      const newCreditLimit = randomCreditLimit(emotion_type, intensity);

      // Update or insert the new credit limit in the credit_limits table
      await knex("credit_limits")
        .insert({
          user_id,
          credit_limit: newCreditLimit.credit_limit,
        })
        .onConflict("user_id") // Handle conflict if the user already has a credit limit
        .merge({
          credit_limit: newCreditLimit.credit_limit,
          updated_at: knex.fn.now(),
        });

      reply
        .status(201)
        .send({
          message: "Emotion added and credit limit updated successfully",
        });
    } catch (error) {
      console.error("Error occurred while adding emotion or updating credit limit:", error); // Log the error
      reply.status(500).send({ error: "Database error" });
    }
    
  });

  // GET /emotions: Retrieve all emotions
  app.get("/emotions", async (request, reply) => {
    try {
      // Retrieve all entries from the emotions table
      const allEmotions = await knex("emotions").select("*");

      reply.send(allEmotions); // Return the list of emotions
    } catch (error) {
      console.error("Database error:", error); // Log the error for debugging
      reply.status(500).send({ error: "Database error" });
    }
  });

  // GET /credit-limits: Retrieve all credit limits
  app.get("/credit-limits", async (request, reply) => {
    try {
      // Retrieve all entries from the credit_limits table
      const allCreditLimits = await knex("credit_limits").select("*");

      reply.send(allCreditLimits); // Return the list of credit limits
    } catch (error) {
      console.error("Database error:", error); // Log the error for debugging
      reply.status(500).send({ error: "Database error" });
    }
  });

  // GET /credit-limit/:user_id: Retrieve the current credit limit for a specific user
  app.get("/credit-limit/:user_id", async (request, reply) => {
    const paramsSchema = z.object({
      user_id: z.string().uuid(), // Ensure user_id is a valid UUID
    });

    const { user_id } = paramsSchema.parse(request.params);

    try {
      // Retrieve the most recent credit limit for the user
      const creditLimit = await knex("credit_limits")
        .where({ user_id })
        .orderBy("updated_at", "desc")
        .first();

      if (!creditLimit) {
        return reply.status(404).send({ error: "Credit limit not found" });
      }

      reply.send(creditLimit);
    } catch (error) {
      reply.status(500).send({ error: "Database error" });
    }
  });

  // GET /users: Retrieve all users
  app.get("/users", async () => {
    const allUsers = await knex("users").select("*");
    return allUsers;
  });
}
