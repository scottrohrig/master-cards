import React from 'react';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
  useNavigate,
} from 'react-router-dom';
import {
  useQuery, useMutation, QueryClient, QueryClientProvider,
} from '@tanstack/react-query';
import CategoriesPage from './pages/CategoriesPage';
import QuizPage from './pages/QuizPage';
import ConceptList, { loader as categoryLoader } from './components/ConceptList';

import ErrorPage from './components/ErrorPage';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const routerOpts = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'categories',
        element: <CategoriesPage />,
      },
      {
        path: 'Quiz',
        element: <QuizPage />,
      },
      {
        path: 'categories/:categoryId',
        element: <ConceptList />,
        loader: categoryLoader,
      },
    ],
  }
];

const router = createBrowserRouter(routerOpts)

export default function Root() {
  return (
    <RouterProvider router={router} />
  )
}

// URL: / 
function App() {
  const navPages = ['categories', 'quiz', 'error']
  return (
    <main className="border-l-4 border-sky-400 min-h-screen">
      <Header pages={navPages} />
      <article className="px-4 pt-2">
        <QueryClientProvider client={queryClient} >
          <Outlet />
        </QueryClientProvider>
      </article>
    </main>
  )
}

function Header({ pages }: any) {
  const navigate = useNavigate();
  return (
    <header className="flex justify-between bg-sky-400 px-4 py-2">
      <div className="flex gap-2">
        <div className="">LOGO</div>
        <div className="text-zinc-50 pointer" onClick={
          () => { navigate('/categories') }
        }>BRAND</div>
      </div>
      <nav>
        <ul className="flex gap-2">
          {pages.map(
            (p: any) => <Link
              className="text-sky-700"
              to={`/${p}`}
              key={p}
            >
              {p}
            </Link>
          )}
        </ul>
      </nav>
    </header>
  )
}
