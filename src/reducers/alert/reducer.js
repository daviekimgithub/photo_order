export const ADD = 'ADD';
export const REMOVE = 'REMOVE';
export const REMOVE_ALL = 'REMOVE_ALL';

export function AlertReducer(state, action) {
  switch (action.type) {
    case ADD:
      return [
        ...state,
        {
          id: +new Date(),
          content: action.payload.content,
          type: action.payload.type,
          action: action.payload.action,
          actionprops: action.payload.actionprops,
        },
      ];
    case REMOVE:
      return state.filter((t) => t.id !== action.payload.id);
    case REMOVE_ALL:
      return [];
    default:
      return state;
  }
}
