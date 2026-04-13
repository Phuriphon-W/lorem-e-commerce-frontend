import { useState, useEffect } from "react";

export default function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
        return window.matchMedia(query).matches;
    }
    return false;
  })

    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);

        return () => media.removeEventListener('change', listener)
    }, [query]);

    return matches;
}