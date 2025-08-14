import { createElement, router, useEffect, useState } from "#core/framework.ts";
import { useContext } from "#core/hooks/useContext.ts";
import { getStorage } from "#services/data.ts";
import { KeysStorage } from "#types/enums.ts";
import type { User } from "#types/user.ts";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [_get, setContext] = useContext();

  useEffect(() => {
    setUser(getStorage(sessionStorage, KeysStorage.USERTRANS))
  }, [])

  setContext("user", [user, setUser])
  return createElement("template", null, router());
}

export default App;
