import { useState, useEffect } from "react";

export default function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);
    function onMediaChange(event: MediaQueryListEvent) {
        setMatches(event.matches);
    }

    useEffect(() => {
        const queryList = window.matchMedia(query);
        setMatches(queryList.matches);

        queryList.addEventListener("change", onMediaChange);
        return () => queryList.removeEventListener("change", onMediaChange);
    }, [query])

    return matches;
}