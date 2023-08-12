import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  getCategories, useAddCategory, useDeleteMutation, useUpdateCategory
} from '../api';
import '../App.css';
import { Button } from '../components/ConceptList';
import Page from './Page';

const fetchCategories = async () => {
  // Fetch the categories from your "API" here
  const response = await fetch('/categories.json')
  if (!response.ok) {
    throw new Error(`An error has occurred: ${response.statusText}`);
  }
  return await response.json();
};

function InputGroup(props) {
  return (<div
    className={`${props.className} flex gap-1 px-[4px] py-[2px] justify-center items-center text-sm`}
    {...props}
  >{props.children}</div>);
}

export function Input(props) {
  return <input {...props} className={`
    ${props.className}
    border
    rounded
    outline-sky-500
    py-[2px] px-[4px]
    basis-full
    text-xs
  `} />
}

const CategoriesForm = () => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const addCategoryMutation = useAddCategory();

  const initAddCategory = () => {
    if (!title || !description) return;
    const newCategory = { id: '', title, description };
    addCategoryMutation.mutate(newCategory);
  };

  return (
    <div className='card max-w-xl mx-auto'>
      <h3 className="font-bold text-lg text-sky-700">Add Category</h3>
      <div id="add-category" className="flex flex-col">
        <InputGroup>
          <label htmlFor="category-edit-title" className="basis-[13ch]">Title</label>
          <Input
            className=" border-amber-400 "
            id="category-edit-title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <label htmlFor="category-edit-desc" className="basis-[13ch]">Description</label>
          <Input
            className=" border-amber-400 "
            id="category-edit-desc"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </InputGroup>
        <Button className="text-zinc-50 self-end w-32 m-1" onClick={initAddCategory}>Submit</Button>
      </div>
    </div>
  );
};

const CategoryLiEdit = ({
  item, onSave, onCancel,
}) => {
  const [title, setTitle] = React.useState(item.title);
  const [description, setDescription] = React.useState(item.description);
  const handleSave = () => {
    if (!title || !description) return;
    onSave({
      id: item.id,
      title,
      description,
    });
  };

  return (
    <li className="card  text-amber-500 h-20 border-sky-400 border-b-4 p-2 flex justify-between items-center mb-1">
      <div className='flex flex-col w-full gap-1'>
        <InputGroup>
          <label htmlFor="category-title" className='basis-[13ch] font-light text-sm'>Title</label>
          <Input
            id="category-title"
            name="title"
            value={title}
            className=" border-amber-400 "
            onChange={(e) => setTitle(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <label htmlFor="category-desc" className="basis-[13ch] font-light text-sm">Description</label>
          <Input
            id="category-desc"
            name="description"
            value={description}
            className=" border-amber-400 "
            onChange={(e) => setDescription(e.target.value)}
          />
        </InputGroup>
      </div>
      <div className="action-menu flex gap-1">
        <Button className="bg-zinc-50 border border-sky-400 p-[4px]" onClick={onCancel}>Cancel</Button>
        <Button className="text-zinc-50 p-[4px]" onClick={handleSave}>Save</Button>
      </div>
    </li>
  )
}

const CategoriesListItem = ({
  title, description, onEdit, onDelete,
}) => {
  return (
    <li className="card text-amber-500 h-20 px-2 flex justify-between items-start mt-1 border-b-4 border-sky-400">
      <div className="li-body">
        <h4 className="font-bold">{title}</h4>
        <p className="text-xs">{description}</p>
      </div>
      <div className="flex gap-1 self-center ">
        <Button className="bg-zinc-50 border border-sky-400 p-[4px]" onClick={onEdit}>Edit</Button>
        <Button className="bg-zinc-50 border border-sky-400 text-red-400 p-[4px]" onClick={onDelete}>Delete</Button>
      </div>
    </li>
  );
};

const CategoriesList = () => {
  const { data: categories, isLoading } = useQuery(['categories'], getCategories);
  const deleteCategoryMutation = useDeleteMutation();
  const updateCategoryMutation = useUpdateCategory();
  const [activeItemId, setActiveItemId] = React.useState('');

  const onSave = (item) => {
    updateCategoryMutation.mutate(item);
    setActiveItemId('');
  };

  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>

  return (<div className="categories-list max-w-xl mx-auto">
    <h3 className="font-bold text-xl">Categories</h3>
    <ul className="border border-sky-400 rounded">
      {categories && categories.map((item) => (
        <div key={item.id}>
          {
            (item.id === activeItemId)
              ? (<CategoryLiEdit
                item={item}
                onSave={onSave}
                onCancel={() => setActiveItemId('')}
              />)
              : (<div
                onClick={(e) => {
                  // alert(`should navigate to card set for ${item.id} ${item.title}`)
                  navigate(`/categories/${item.id}`)
                }}
              >
                <CategoriesListItem
                  title={item.title}
                  description={item.description}
                  onEdit={(e) => { e.stopPropagation(); setActiveItemId(item.id) }}
                  onDelete={(e) => {
                    e.stopPropagation();
                    deleteCategoryMutation.mutate(item.id)
                  }}
                /></div>)
          }
        </div>
      ))}
    </ul>
  </div>);
};


const CategoriesPage = () => {
  return (
    <Page >
      <h2 className="font-bold text-2xl text-sky-800">Categories Page</h2>
      <CategoriesForm />
      <CategoriesList />
    </Page>
  );
};

export default CategoriesPage;
