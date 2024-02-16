const initialState = {
  address: null,
  network: null,
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_WALLET":
      return {
        ...state,
        address: action.payload.address,
        network: action.payload.network,
      };

    default:
      return state;
  }
};

export default walletReducer;
