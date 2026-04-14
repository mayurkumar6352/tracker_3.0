import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'expense-tracker-v1';

const INITIAL_STATE = {
  books: [
    { id: 'personal', name: 'Personal', color: '#0A84FF', icon: '👤', createdAt: new Date().toISOString() },
    { id: 'business', name: 'Business', color: '#30D158', icon: '💼', createdAt: new Date().toISOString() },
  ],
  transactions: [],
  activeBookId: 'personal',
  settings: { theme: 'light', currency: '₹' },
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const saved = JSON.parse(raw);
    return { ...INITIAL_STATE, ...saved };
  } catch {
    return INITIAL_STATE;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Storage write failed', e);
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION': {
      const tx = { id: uuidv4(), createdAt: new Date().toISOString(), ...action.payload };
      return { ...state, transactions: [tx, ...state.transactions] };
    }
    case 'UPDATE_TRANSACTION': {
      const txs = state.transactions.map(t => t.id === action.payload.id ? { ...t, ...action.payload } : t);
      return { ...state, transactions: txs };
    }
    case 'DELETE_TRANSACTION': {
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    }
    case 'ADD_BOOK': {
      const book = { id: uuidv4(), createdAt: new Date().toISOString(), ...action.payload };
      return { ...state, books: [...state.books, book], activeBookId: book.id };
    }
    case 'UPDATE_BOOK': {
      const books = state.books.map(b => b.id === action.payload.id ? { ...b, ...action.payload } : b);
      return { ...state, books };
    }
    case 'DELETE_BOOK': {
      const books = state.books.filter(b => b.id !== action.payload);
      const transactions = state.transactions.filter(t => t.bookId !== action.payload);
      const activeBookId = state.activeBookId === action.payload ? (books[0]?.id || null) : state.activeBookId;
      return { ...state, books, transactions, activeBookId };
    }
    case 'SET_ACTIVE_BOOK':
      return { ...state, activeBookId: action.payload };
    case 'SET_THEME': {
      return { ...state, settings: { ...state.settings, theme: action.payload } };
    }
    case 'SET_CURRENCY': {
      return { ...state, settings: { ...state.settings, currency: action.payload } };
    }
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.settings.theme);
  }, [state.settings.theme]);

  const addTransaction = useCallback((data) => dispatch({ type: 'ADD_TRANSACTION', payload: data }), []);
  const updateTransaction = useCallback((data) => dispatch({ type: 'UPDATE_TRANSACTION', payload: data }), []);
  const deleteTransaction = useCallback((id) => dispatch({ type: 'DELETE_TRANSACTION', payload: id }), []);
  const addBook = useCallback((data) => dispatch({ type: 'ADD_BOOK', payload: data }), []);
  const updateBook = useCallback((data) => dispatch({ type: 'UPDATE_BOOK', payload: data }), []);
  const deleteBook = useCallback((id) => dispatch({ type: 'DELETE_BOOK', payload: id }), []);
  const setActiveBook = useCallback((id) => dispatch({ type: 'SET_ACTIVE_BOOK', payload: id }), []);
  const setTheme = useCallback((t) => dispatch({ type: 'SET_THEME', payload: t }), []);
  const setCurrency = useCallback((c) => dispatch({ type: 'SET_CURRENCY', payload: c }), []);

  const activeBook = state.books.find(b => b.id === state.activeBookId) || state.books[0];
  const bookTransactions = state.transactions.filter(t => t.bookId === state.activeBookId);

  return (
    <AppContext.Provider value={{
      ...state,
      activeBook,
      bookTransactions,
      addTransaction, updateTransaction, deleteTransaction,
      addBook, updateBook, deleteBook, setActiveBook,
      setTheme, setCurrency,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
