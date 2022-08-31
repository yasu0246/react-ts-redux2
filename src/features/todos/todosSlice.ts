import { 
  createSlice,
  createAsyncThunk,
  SerializedError,
 } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TodoInput, Todo, TodoId, TodoUpdatePayload } from './types';
import { createTodo, removeTodo, updateTodo, restoreTodo } from './crud';
import { RootState} from '../../app/store'
import { fetchTodos } from './api/fetch';
import { setTodos } from './localStorage/todosLocalStorage';

export type TodoState = {
  isFetching: boolean;
  error: SerializedError | null;
  todos: Todo[];
};

const initialState: TodoState = {
  isFetching: false,
  error: null,
  todos: [],
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    create: (state, action: PayloadAction<TodoInput>) => {
      const { title, body } = action.payload;
      if (!title || !body)
        throw new Error('タイトルと本文の両方を入力してください');

      const todo = createTodo(action.payload);
      state.todos.push(todo);
      setTodos(state.todos);
    },

    remove: (state, action: PayloadAction<TodoId>) => {
      const id = action.payload;
      const index = state.todos.findIndex((todo) => todo.id === id);
      const todo = state.todos[index];
      if (!todo) return;

      state.todos[index] = removeTodo(todo);
      setTodos(state.todos);
    },

    update: (state, action: PayloadAction<TodoUpdatePayload>) => {
      const { id, input } = action.payload;
      const index = state.todos.findIndex((todo) => todo.id === id);
      const todo = state.todos[index];
      if (!todo) return;

      state.todos[index] = updateTodo({
        ...todo,
        ...input,
      });
      setTodos(state.todos);
    },

    restore: (state, action: PayloadAction<TodoId>) => {
      const id = action.payload;
      const index = state.todos.findIndex((todo) => todo.id === id);
      const todo = state.todos[index];
      if (!todo) return;

      state.todos[index] = restoreTodo(todo);
      setTodos(state.todos);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchTodosAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.error = null;
        state.todos = action.payload;
      })
      .addCase(fetchTodosAsync.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.error;
      });
  },
});

export const fetchTodosAsync = createAsyncThunk<Todo[]>(
  `${todosSlice.name}/fetch`,
  async () => {
    const response = await fetchTodos();

    return response.data;
  }
);

export const { create,remove, update, restore } = todosSlice.actions;

export const selectTodos = (state: RootState) =>
  state.todos.todos.filter((todo) => todo.deletedAt === undefined);

export const selectDeletedTodos = (state: RootState) =>
  state.todos.todos.filter((todo) => todo.deletedAt !== undefined);
  
  export const selectIsFetching = (state: RootState) => state.todos.isFetching;

export default todosSlice.reducer;