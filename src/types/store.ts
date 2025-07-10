import type { Characters, Character } from "./characters";

type Store = {
  data: Characters | null
  loading: boolean
  error: null | string
  currentCharacter: null | Character

  setCurrentCharacter: (currentCharacter: Character) => void
  setData: (data: Characters) => void
  setError: (error: null | string) => void
  setLoading: (loading: boolean) => void
}

export type { Store };