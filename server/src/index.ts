import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schema types
import { 
  createOptionInputSchema, 
  voteInputSchema, 
  getOptionsInputSchema 
} from './schema';

// Import handlers
import { createOption } from './handlers/create_option';
import { getOptions } from './handlers/get_options';
import { voteForOption } from './handlers/vote_for_option';
import { getVoteStatus } from './handlers/get_vote_status';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check endpoint
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Create a new voting option
  createOption: publicProcedure
    .input(createOptionInputSchema)
    .mutation(({ input }) => createOption(input)),

  // Get all voting options with vote counts and user vote status
  getOptions: publicProcedure
    .input(getOptionsInputSchema.optional())
    .query(({ input }) => getOptions(input)),

  // Vote for a specific option
  voteForOption: publicProcedure
    .input(voteInputSchema)
    .mutation(({ input }) => voteForOption(input)),

  // Check if a voter has voted for a specific option
  getVoteStatus: publicProcedure
    .input(voteInputSchema.pick({ option_id: true, voter_identifier: true }))
    .query(({ input }) => getVoteStatus(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();