import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { randomCreditLimit } from "../utils/creditLimitUtils";

export async function routes(app: FastifyInstance) {

  
  app.post("/users", async (request, reply) => {
    const UserBodySchema = z.object({ name: z.string().min(3) });
    const { name } = UserBodySchema.parse(request.body);
    
    await knex("users").insert({ user_id: randomUUID(), name });
    reply.status(201).send({ message: "User created successfully" });
  });

  
  app.post("/emotions", async (request, reply) => {
    const createEmotionBodySchema = z.object({
      user_id: z.string().uuid(), 
      emotion_type: z.enum(["positive", "negative"]), 
      intensity: z.number().int().min(1).max(10), 
    });
    
    const { user_id, emotion_type, intensity } = createEmotionBodySchema.parse(request.body);
    
    try {
     
      const user = await knex("users").where({ user_id }).first();
      if (!user) {
        return reply.status(404).send({ error: "User not found" });
      }
      
      
      await knex("emotions").insert({ user_id, emotion_type, intensity });
      
      
      const newCreditLimit = randomCreditLimit(emotion_type, intensity);
      
      
      await knex("credit_limits")
        .insert({ user_id, credit_limit: newCreditLimit.credit_limit })
        .onConflict("user_id") 
        .merge({ credit_limit: newCreditLimit.credit_limit, updated_at: knex.fn.now() });
        
      reply.status(201).send({ message: "Emotion added and credit limit updated successfully" });
    } catch (error) {
      console.error("Error occurred while adding emotion or updating credit limit:", error);
      reply.status(500).send({ error: "Database error" });
    }
  });

  
  app.get("/emotions", async (request, reply) => {
    try {
      const allEmotions = await knex("emotions").select("*");
      reply.send(allEmotions);
    } catch (error) {
      console.error("Database error:", error);
      reply.status(500).send({ error: "Database error" });
    }
  });

  
  app.get("/credit-limits", async (request, reply) => {
    try {
      const allCreditLimits = await knex("credit_limits").select("*");
      reply.send(allCreditLimits);
    } catch (error) {
      console.error("Database error:", error);
      reply.status(500).send({ error: "Database error" });
    }
  });

  
  app.get("/credit-limit/:user_id", async (request, reply) => {
    const paramsSchema = z.object({ user_id: z.string().uuid() });
    const { user_id } = paramsSchema.parse(request.params);
    
    try {
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

  
  app.get("/users", async () => {
    const allUsers = await knex("users").select("*");
    return allUsers;
  });
}
