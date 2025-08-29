import { z } from 'zod';

// Option schema - represents a voting option
export const optionSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  vote_count: z.number().int().nonnegative(), // Total number of votes for this option
  created_at: z.coerce.date()
});

export type Option = z.infer<typeof optionSchema>;

// Input schema for creating options
export const createOptionInputSchema = z.object({
  title: z.string().min(1), // Title is required and cannot be empty
  description: z.string().nullable() // Description can be null
});

export type CreateOptionInput = z.infer<typeof createOptionInputSchema>;

// Input schema for voting on an option
export const voteInputSchema = z.object({
  option_id: z.number().int().positive(), // ID of the option to vote for
  voter_identifier: z.string().min(1) // Anonymous identifier (e.g., IP address, session ID)
});

export type VoteInput = z.infer<typeof voteInputSchema>;

// Vote schema - represents a single vote
export const voteSchema = z.object({
  id: z.number(),
  option_id: z.number(),
  voter_identifier: z.string(), // Anonymous identifier to prevent duplicate votes
  created_at: z.coerce.date()
});

export type Vote = z.infer<typeof voteSchema>;

// Option with vote details schema - for returning options with vote information
export const optionWithVotesSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  vote_count: z.number().int().nonnegative(),
  created_at: z.coerce.date(),
  user_has_voted: z.boolean() // Whether the current voter has voted for this option
});

export type OptionWithVotes = z.infer<typeof optionWithVotesSchema>;

// Input schema for getting options with vote status
export const getOptionsInputSchema = z.object({
  voter_identifier: z.string().min(1).optional() // Optional voter identifier to check vote status
});

export type GetOptionsInput = z.infer<typeof getOptionsInputSchema>;