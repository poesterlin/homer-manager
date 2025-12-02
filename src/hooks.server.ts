/// file: src/hooks.server.ts
import type { Handle, HandleValidationError } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  try {
    const response = await resolve(event);
    return response;
  } catch (err) {
    console.error('[Server Error] Uncaught exception:', err);
    throw err;
  }
};

// This catches Validation errors (Valibot) and prints them
export const handleValidationError: HandleValidationError = ({ event, issues }) => {
  console.error('[Validation Error] Data sent:', event.request);
  console.error('[Validation Error] Issues:', JSON.stringify(issues, null, 2));
  return {
    message: 'Invalid data submitted'
  };
};