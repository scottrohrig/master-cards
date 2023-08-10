import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  getCategories, useAddCategory, useDeleteMutation, useUpdateCategory
} from '../api';
import '../App.css';

const fetchCategories = async () => {
  // Fetch the categories from your "API" here
  const response = await fetch('/categories.json')
  if (!response.ok) {
    throw new Error(`An error has occurred: ${response.statusText}`);
  }
  return await response.json();
};

function InputGroup({ children }) {
  return (<div
    className="flex flex-column gap-2 border border-sky-400 rounded m-2 p-1"
  >{children}</div>);
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
    <div className='card'>
      <h3 className="font-bold text-xl text-sky-700">Add Category</h3>
      <div id="add-category">
        <InputGroup>
          <label htmlFor="category-title">Title</label>
          <input
            className="bg-amber-400"
            id="category-title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </InputGroup>
        <div className="ml-2 input-group flex gap-2 border border-sky-400 rounded p-2 m-1">
          <label htmlFor="category-desc">Description</label>
          <input
            id="category-desc"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button onClick={initAddCategory}>Submit</button>
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
    <>
      <div className="input-group">
        <label htmlFor="category-title">Title</label>
        <input
          id="category-title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="category-desc">Description</label>
        <input
          id="category-desc"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="action-menu">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </>
  )
}

const CategoriesListItem = ({
  title, description, onEdit, onDelete,
}) => {
  return (
    <li className="card border rounded bg-sky-400 text-zinc-50 px-2 flex justify-between">
      <div className="li-body">
        <h4 className="font-bold">{title}</h4>
        <p className="font-light text-sm">{description}</p>
      </div>
      <div className="flex gap-2 flex-col">
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
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

  return (<div className="categories-list">
    <h3>Categories</h3>
    <ul>
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
    <div className="page border border-amber-400 p-4 rounded text-amber-600">
      <h2 className="font-bold text-xl text-sky-800">Categories Page</h2>
      <CategoriesForm />
      <CategoriesList />
    </div>
  );
};

export default CategoriesPage;
