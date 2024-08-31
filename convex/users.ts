import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createOrUpdate = mutation({
  args: { 
    location: v.array(v.float64()),
    userId: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, { location: args.location });
    } else {
      await ctx.db.insert("users", {
        userId,
        location: args.location,
      });
    }
  },
});
