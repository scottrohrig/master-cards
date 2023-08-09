import React from 'react';
import Setlist from './SetList';
import {
  useQuery, useMutation,
} from '@tanstack/react-query';
import { queryClient } from '../App';
import { getCategory } from '../api';

const ListItem = ({ name, description, onEdit, onDelete }) => (
  <li className="list-item">
    <div className="">
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
    <div className="action-menu">
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  </li>
);

const fetchCategories = async () => {
  // Fetch the categories from your "API" here
  const response = await fetch('/concepts.json')
  if (!response.ok) {
    throw new Error(`An error has occurred: ${response.statusText}`);
  }
  return await response.json();
};

const addCategory = async (newCategory) => {
  // Logic to add a new category
  // queryClient.invalidateQueries('categories');
};

const editCategory = async (editedCategory) => {
  // Logic to edit a specific category
  // queryClient.invalidateQueries('categories');
};

const deleteCategory = async (id) => {
  // Logic to delete a specific category
  // queryClient.invalidateQueries('categories');
};

const CategoriesPageRQ = () => {
  const { data: categories, isLoading } = useQuery(['categories'], fetchCategories);
  const mutationAdd = useMutation(addCategory);
  const mutationEdit = useMutation(editCategory);
  const mutationDelete = useMutation(deleteCategory);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="categories-page">
      {/* Rest of your code */}
      Categories Page
      <button onClick={() => {/*mutationAdd.mutate()*/ }} >Add Category </button>
      <div className="category-list">
        {categories && categories.map((category) => (
          <ListItem
            key={category.id}
            name={category.concept}
            description={category.definition}
            onEdit={() => mutationEdit.mutate(category.id)}
            onDelete={() => mutationDelete.mutate(category.id)}
          />
        ))}
      </div>
    </div>
  );
};

function CategoriesPage({id='58'}) {
  const category = getCategory(id);
  return (
    <div className="page">
      <h2>{category?.title}</h2>
      <Setlist />
    </div>
  )
}

export default CategoriesPage;