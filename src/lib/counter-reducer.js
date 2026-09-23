export const STEPS = [1, 5, 10]
export const HISTORY_LIMIT = 8

export const initialState = {
  count: 0,
  step: 1,
  goal: 50,
  history: [],
  clicks: 0,
  best: 0,
  goalsReached: 0,
}

let nextId = Date.now()

function addHistory(history, entry) {
  return [{ id: nextId++, at: Date.now(), ...entry }, ...history].slice(0, HISTORY_LIMIT)
}

export function counterReducer(state, action) {
  switch (action.type) {
    case 'change': {
      const delta = action.direction * state.step
      const count = state.count + delta
      const crossedGoal = state.goal > 0 && state.count < state.goal && count >= state.goal
      return {
        ...state,
        count,
        clicks: state.clicks + 1,
        best: Math.max(state.best, count),
        goalsReached: state.goalsReached + (crossedGoal ? 1 : 0),
        history: addHistory(state.history, { kind: 'change', delta, value: count }),
      }
    }
    case 'reset':
      if (state.count === 0) return state
      return {
        ...state,
        count: 0,
        history: addHistory(state.history, { kind: 'reset', delta: -state.count, value: 0 }),
      }
    case 'set-step':
      return STEPS.includes(action.step) ? { ...state, step: action.step } : state
    case 'set-goal':
      return { ...state, goal: Math.max(0, Math.min(9999, Math.round(action.goal) || 0)) }
    case 'clear-history':
      return { ...state, history: [] }
    default:
      return state
  }
}
