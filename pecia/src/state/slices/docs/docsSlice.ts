import { createSlice } from '@reduxjs/toolkit';
import { addDoc, deleteDoc, setTitle, Doc } from './docsReducers';

const docsSlice = createSlice({
    name: 'docs',
    initialState: { docs: [] as Doc[] },
    reducers: { addDoc, deleteDoc, setTitle },
});
export default docsSlice;
