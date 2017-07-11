type State = WeakMap<any, Map<string, string>>

export function model() {
  let state: State = new WeakMap
  return {
    get<T extends object, K extends keyof T>(type: T) {
      return (name: K) => {
        if (!state.has(type)) {
          return undefined
        }
        if (!state.get(type)!.has(name)) {
          return undefined
        }
        return state.get(type)!.get(name)
      }
    },
    has<T extends object, K extends keyof T>(type: T) {
      return (name: K) => {
        if (!state.has(type)) {
          return undefined
        }
        return state.get(type)!.has(name)
      }
    },
    set<T extends object, K extends keyof T>(type: T) {
      return (name: K) => (object: T[K]) => {
        if (!state.has(type)) {
          state.set(type, new Map)
        }
        state.get(type)!.set(name, object)
      }
    }
  }
}
