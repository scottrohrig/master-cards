import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "./App";
import { Category, Concept, Stat } from "./types";

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

export const deleteCategory = (id:string) => {
  try {
    const categories = getCategories();
    const updatedCategories = categories.filter(
      (c:Category) => c.id !== id,
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

const updateCategory = (editedItem: Category) => {
  try {
    const id = editedItem.id
    const categories = getCategories();
    const updatedCategories = categories.map(
      (c:Category) => c.id === id ? { ...editedItem } : c
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

export const getCategory = (id: string) => {
  const category = getCategories().filter((c:Category) => c.id === id).pop();
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

export const getConceptsByCategoryId = (categoryId:string) => {
  const concepts = localStorage.getItem('concepts');
  return concepts ? JSON.parse(concepts).filter((c:Concept) => c.categoryId === categoryId) : [];
}

export const getConcept = (id:string) => {
  const concept = getConcepts().filter((c:Concept) => c.id === id).pop();
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

const editConcept = (concept:Concept) => {
  const concepts = getConcepts();
  const updatedConcepts = concepts.map((c:Concept) => c.id === concept.id ? concept : c)
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

export const getStats=()=>{
  const statsJson = localStorage.getItem('stats')
  if (statsJson) {
    return JSON.parse(statsJson);
  }
  return [];
};

const addStats = (conceptId:string) => {
  const statlist = getStats();
  const newStat = {
    id: randId(),
    conceptId,
    countAccurate: 0,
    totalAttempts: 0,
  }
  const newStatlist = [
    ...statlist,
    newStat
  ];
  localStorage.setItem('stats', JSON.stringify(newStatlist));
};

export const useAddStats = () => {
  return useMutation(addStats, {
    onSuccess: () => {
      queryClient.invalidateQueries(['statlist'])
    }
  })
}

export const getOrAddStat = (conceptId:string) => {
  const statlist = getStats();
  let filteredStatList = statlist.filter((item:Stat) => item.conceptId === conceptId);

  if (filteredStatList.length === 0) {
    addStats(conceptId);
    const updatedStatList = getStats();
    filteredStatList = updatedStatList.filter((item:Stat) => item.conceptId === conceptId);
  }

  return filteredStatList[filteredStatList.length - 1];
};
