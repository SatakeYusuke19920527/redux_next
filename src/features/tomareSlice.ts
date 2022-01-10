import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { TomareState } from "../../src/types/tomare";

const initialState: TomareState = {
  menu: '',
  gappi: '',
  tomareId: '',
  uid: ''
} as TomareState;

export const tomareSlice = createSlice({
  name: 'tomare',
  initialState,
  reducers: {
    addTomare: (state, action) => {
      state.tomare = action.payload
      state.menu = action.payload.menu
      state.gappi = action.payload.gappi
      state.uid = action.payload.uid
      state.tomareId = action.payload.tpmareId
    }
  },
});

export const { addTomare } = tomareSlice.actions;
export const selectTomare = (state: RootState) => state.tomare;
export default tomareSlice.reducer;
