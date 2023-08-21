import { createSlice } from '@reduxjs/toolkit';
import { addDoc, deleteDoc, setTitle, Doc } from './docsReducers';

const storedDocs = localStorage.getItem('pecia-docs');

const initialDocs = storedDocs
    ? { docs: JSON.parse(storedDocs) }
    : { docs: [] as Doc[] };

const docsSlice = createSlice({
    name: 'docs',
    initialState: initialDocs,
    reducers: { addDoc, deleteDoc, setTitle },
});

export default docsSlice;
