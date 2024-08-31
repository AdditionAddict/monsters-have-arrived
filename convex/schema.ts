import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  noGoAreas: defineTable({
    coordinates: v.array(v.array(v.number())),
    userId: v.string(),
  }).index('by_userId', ['userId']),

  users: defineTable({
    userId: v.string(),
    location: v.array(v.number()),
  }).index('by_userId', ['userId']),
});
