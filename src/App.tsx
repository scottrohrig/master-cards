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
  const [toggled, setMenuToggled] = React.useState(false);
  const navigate = useNavigate();
  const handleToggle = () => {
    console.log('toggling', toggled);
    setMenuToggled(!toggled);
  }
  const showMenu = toggled ? 'flex' : 'hidden';
  console.log('showmenu', showMenu);

  return (
    <header className="flex justify-between bg-sky-400 px-4 py-2">
      <div className="flex gap-2">
        <div className="">LOGO</div>
        <div className="text-zinc-50 pointer" onClick={
          () => { navigate('/categories') }
        }>BRAND</div>
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
        <ul
          className={`absolute right-0 top-14 ${showMenu} flex-col min-h-[100vh] w-1/2 bg-slate-50`}
          >
          {pages.map(
            (p: any) => <Link
              className="text-sky-700 px-4 py-2 border-b border-sky-400 hover:bg-slate-100"
              to={`/${p}`}
              key={p}
              onClick={() => setMenuToggled(false)}
            >
              {p}
            </Link>
          )}
        </ul>
      </nav>
    </header>
  )
}

function MenuButton (
  { onClick }: { onClick?: React.MouseEventHandler<HTMLDivElement> | undefined }
) {
  return (
    <div className="md:hidden w-10 h-10 p-1 flex flex-col justify-between cursor-pointer"
      onClick={onClick}
    >
      <div className="w-full h-1 bg-white rounded-lg"></div>
      <div className="w-full h-1 bg-white rounded-lg"></div>
      <div className="w-full h-1 bg-white rounded-lg"></div>
    </div>
  )
}
