import { useLocationContext } from '@/contexts/location-context'; // Import the context hook

// This custom hook simply re-exports the context hook.
// It provides a clean abstraction layer. If you needed to add
// more logic around location fetching or selection later,
// you could add it here without changing how components consume the hook.
export function useLocation() {
  return useLocationContext();
}