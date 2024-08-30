import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("noGoAreas").collect();
  },
});

export const save = mutation({
  args: { coordinates: v.array(v.array(v.number())) },
  handler: async (ctx, args) => {
    await ctx.db.insert("noGoAreas", { coordinates: args.coordinates });
  },
});