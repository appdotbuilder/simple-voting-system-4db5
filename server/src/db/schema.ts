import { serial, text, pgTable, timestamp, integer, index, unique } from 'drizzle-orm/pg-core';

// Options table - stores voting options
export const optionsTable = pgTable('options', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'), // Nullable by default
  vote_count: integer('vote_count').notNull().default(0), // Track total votes for performance
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Votes table - stores individual votes
export const votesTable = pgTable('votes', {
  id: serial('id').primaryKey(),
  option_id: integer('option_id').notNull().references(() => optionsTable.id, { onDelete: 'cascade' }),
  voter_identifier: text('voter_identifier').notNull(), // Anonymous identifier (IP, session, etc.)
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  // Ensure one vote per voter per option
  uniqueVoterOption: unique().on(table.option_id, table.voter_identifier),
  // Index for faster lookups
  voterIdentifierIdx: index('votes_voter_identifier_idx').on(table.voter_identifier),
  optionIdIdx: index('votes_option_id_idx').on(table.option_id),
}));

// TypeScript types for the table schemas
export type Option = typeof optionsTable.$inferSelect; // For SELECT operations
export type NewOption = typeof optionsTable.$inferInsert; // For INSERT operations

export type Vote = typeof votesTable.$inferSelect; // For SELECT operations  
export type NewVote = typeof votesTable.$inferInsert; // For INSERT operations

// Important: Export all tables for proper query building
export const tables = { 
  options: optionsTable, 
  votes: votesTable 
};