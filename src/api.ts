import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "./App";

interface Category {
  id: string;
  title: string;
  description: string;
}

const randId = () => Math.floor(Math.random() * 999) + 1

export const getCategories = () => {
  const categories = localStorage.getItem('categories');
  return categories ? JSON.parse(categories) : [];
};

export const addCategory = (newCategory: Category) => {
  try {
    newCategory.id = String(randId());
    const prevCategories = getCategories();
    const updatedCategories: Category[] = [
      ...prevCategories,
      newCategory
    ];
    localStorage.setItem(
      'categories',
      JSON.stringify(updatedCategories),
    );
  } catch (err) {
    console.log('failed setting storage', err)
  }
};

export const useAddCategory = () => {
  return useMutation(addCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(['categories'])
    }
  })
};

export const deleteCategory = (id) => {
  try {
    const categories = getCategories();
    const updatedCategories = categories.filter(
      (c) => c.id !== id,
    );
    localStorage.setItem(
      'categories',
      JSON.stringify(updatedCategories),
    )
  } catch (err) {
    console.log('failed deleting category: ' + id, err)
  }
};

export const useDeleteMutation = () => {
  return useMutation(deleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(['categories'])
    }
  })
};

const updateCategory = (editedItem) => {
  try {
    const id = editedItem.id
    const categories = getCategories();
    const updatedCategories = categories.map(
      (c) => c.id === id ? { id, ...editedItem } : c
    )
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  } catch (err) {
    console.log('failed to update: ' + editedItem, err);
  };
};

export const useUpdateCategory = () => {
  return useMutation(updateCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(['categories'])
    }
  });
};

export const getCategory = (id) => {
  const category = getCategories().filter(c => c.id === id).pop();
  return category;
};

export const getConcepts = () => {
  const concepts = localStorage.getItem('concepts');
  
  if (concepts) {
    const temp = JSON.parse(concepts);
    return temp;
  }
  return []
};

const fetchDefaultConcepts = () => {
  return fetch('/concepts.json')
        .then(res => res.json())
}

export const getConceptsByCategoryId = (categoryId) => {
  const concepts = localStorage.getItem('concepts');
  return concepts ? JSON.parse(concepts).filter(c => c.categoryId === categoryId) : [];
}

export const getConcept = (id) => {
  const concept = getConcepts().filter(c => c.id === id).pop();
  return concept;
};

export const addConcept = (newConcept: Concept) => {
    newConcept.id = String(randId());
    const prevConcepts = getConcepts();
    const updatedConcepts = [
      ...prevConcepts,
      newConcept
    ];
    localStorage.setItem(
      'concepts',
      JSON.stringify(updatedConcepts),
    );
};

export const useAddConcept = () => {
  return useMutation(addConcept, {
    onSuccess: () => {
      queryClient.invalidateQueries(['concepts'])
    }
  })
};

const editConcept = (concept) => {
  const concepts = getConcepts();
  const updatedConcepts = concepts.map(c=> c.id === concept.id ? concept : c)
  localStorage.setItem(
    'concepts',
    JSON.stringify(updatedConcepts),
  )
};

export const useUpdateConcept = () => {
  return useMutation(editConcept, {
    onSuccess: () => {
      queryClient.invalidateQueries(['concepts'])
    }
  });
};
