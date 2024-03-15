export const INIT_STATE = {
  filesQueue: [],
  added: 0,
  uploaded: 0,
  failed: 0,
  poisonQueue: [],
};

export function FileReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case 'ADD_FILE':
      var file = action.data;
      if (file === undefined) {
        return { ...state };
      }
      var newState = {
        ...state,
        filesQueue: [...state.filesQueue, file],
        added: state.added + 1,
      };
      return newState;

    default:
      return { ...state };
  }
}
