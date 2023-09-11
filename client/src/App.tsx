import {
  QueryClient, QueryClientProvider, useQuery
} from '@tanstack/react-query';
import React from 'react';
import {
  Link,
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from 'react-router-dom';
import './App.css';
import ConceptList, { loader as categoryLoader } from './components/ConceptList';
import CategoriesPage from './pages/CategoriesPage';
import QuizPage from './pages/QuizPage';

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
  const navPages = ['categories', 'quiz', 'error'];
  return (
    <QueryClientProvider client={queryClient} >
      <main className="border-l-4 border-sky-400 min-h-screen">
        <Header pages={navPages} />
        <article className="px-4 pt-2">
          <Outlet />
        </article>
      </main>
    </QueryClientProvider>
  )
}

function Header({ pages }: any) {
  const [toggled, setMenuToggled] = React.useState(false);
  const navigate = useNavigate();
  const handleToggle = () => {
    setMenuToggled(!toggled);
  }
  const showMenu = toggled ? 'flex' : 'hidden';
  const { data: user, isLoading, isError } = useQuery(['me'], async () => {
    const res = await fetch('http://localhost:5001/api/user/1');
    return res.json();
  });

  return (
    <header className="flex justify-between bg-sky-400 px-4 py-2">
      <div className="flex">
        <div className="text-sky-900 font-bold">MASTER</div>
        <div className="text-zinc-50 font-extrabold pointer" onClick={
          () => { navigate('/categories') }
        }>CARDS</div>
          <span className="text-zinc-50 font-extrabold">.</span>
        <div className="flex ms-4 gap-4 items-center text-sky-900 font-light text-xs">
          <div>|</div>
        <div className="">Hello {isLoading ? '...' : user?.name}</div>
        </div>
      </div>
      <nav className='flex gap-1'>
        <ul className="hidden md:flex gap-2">
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
        <MenuButton onClick={handleToggle} />
        <div
          className={`absolute right-0 top-10 p-4 ${showMenu} flex-col min-h-[95vh] w-1/2 bg-white border-l-2 border-l-sky-400 `}
        >
          <ul
            className="flex flex-col border border-sky-400 rounded"
          >
            {pages.map(
              (p: any) => <Link
                className="text-sky-700 px-4 py-2 border-b border-sky-400 hover:bg-slate-100"
                to={`/${p}`}
                key={p}
              // onClick={() => setMenuToggled(false)}
              >
                {p}
              </Link>
            )}
          </ul>
        </div>
      </nav>
    </header >
  )
}

function MenuButton(
  { onClick }: { onClick?: React.MouseEventHandler<HTMLDivElement> | undefined }
) {
  return (
    <div className="md:hidden w-8 h-6 p-1 flex flex-col justify-between cursor-pointer"
      onClick={onClick}
    >
      <div className="w-full h-1 bg-white rounded-lg"></div>
      <div className="w-full h-1 bg-white rounded-lg"></div>
      <div className="w-full h-1 bg-white rounded-lg"></div>
    </div>
  )
}
