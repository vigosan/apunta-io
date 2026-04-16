import { useSession } from "@hono/auth-js/react";
import { useEffect, useRef } from "react";

const STORAGE_KEY = "welist_session_user";

type CachedUser = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

function readCache(): CachedUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CachedUser) : null;
  } catch {
    return null;
  }
}

function writeCache(user: CachedUser | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

export function useCachedSession() {
  const { data: session, status } = useSession();
  const initialUser = useRef(readCache());

  useEffect(() => {
    if (status === "loading") return;
    if (status === "authenticated" && session?.user) {
      writeCache(session.user);
      initialUser.current = null;
    } else if (status === "unauthenticated") {
      writeCache(null);
      initialUser.current = null;
    }
  }, [status, session]);

  if (status === "loading" && initialUser.current) {
    return {
      data: { user: initialUser.current },
      status: "authenticated" as const,
    };
  }

  return { data: session, status };
}
