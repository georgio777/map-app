import type { Store } from "../types/store";
import { create } from "zustand";

const useStore = create<Store>()((set) => ({
  data: null,
  loading: false,
  error: null,
  currentCharacter: null,

  setCurrentCharacter: (person) => set({ currentCharacter: person }),
  setData: (newData) => set({ data: newData}),
  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ loading: isLoading })
}))

export default useStore;