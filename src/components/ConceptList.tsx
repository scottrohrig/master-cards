import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useLoaderData } from 'react-router-dom';
import {
  getCategories,
  getCategory,
  getConcepts,
  useAddConcept,
  useUpdateConcept,
} from '../api';
// import SetList from './SetList';

export function loader({ params }) {
  const category = getCategory(params.categoryId);
  return { category };
}

const ConceptList = () => {
  const { category } = useLoaderData();
  const { data, isLoading } = useQuery(['concepts'], getConcepts);
  const [concepts, setConcepts] = React.useState(null);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (data) setConcepts(data.filter(c => c.categoryId === category.id));
  }, [data]);

  return (
    <div className="">
      <h2 onClick={() => { navigate('/categories') }}>{category.title}</h2>
      <SetList categoryId={category.id} />
    </div>
  );
};

export default ConceptList;


function SetList({ categoryId }) {
  const [concepts, setConcepts] = useState(undefined);
  const [activeItemId, setActiveItemId] = useState('');
  const { data, isLoading } = useQuery(['concepts'], getConcepts);
  const addConceptMutation = useAddConcept();
  useEffect(() => {
    if (data) {
      const filteredConcepts = data.filter(item => item.categoryId === categoryId);
      setConcepts(filteredConcepts);
    }
  }, [data])
  const handleClick = () => {
    const newConcept = { id: '', concept: '', definition: '', categoryId }
    addConceptMutation.mutate(newConcept);
  };
  return (
    <div className="set-list">
      <button tabIndex="0" onClick={handleClick}>new concept</button>
      <ul className="flex flex-col gap-2">
        {isLoading ? <>loading...</> : (
          <>
            {concepts && concepts.length > 0 && concepts.map((item, i) => (
              <ConceptListItem key={i} item={item} activeItemId={activeItemId} setActiveItemId={setActiveItemId} />
            ))}
          </>
        )}
      </ul>
    </div>
  );
}

function ConceptListItem({ item, activeItemId, setActiveItemId }) {
  const [concept, setConcept] = useState(item.concept);
  const [definition, setDefinition] = useState(item.definition);
  const [editing, setEditing] = useState(false);
  const editConceptMutation = useUpdateConcept();

  const handleSave = () => {
    setEditing(false);
    // save concept
    editConceptMutation.mutate({
      id: item.id,
      concept,
      definition,
      categoryId: item.categoryId,
    })
  };
  const handleEdit = () => {
    // setSelected('') // didn't setup the control from the parent so it won't work that way
    setActiveItemId('');
    setEditing(true)
  }

  if (editing) {
    return (
      <li className="selected outline-2 rounded">
        {/* <span>{item.id}</span> */}
        <div className="concept">
          <input value={concept}
            onChange={(e) => setConcept(e.target.value)}
          />
        </div>
        <div className="definition">
          <input value={definition}
            onChange={(e) => setDefinition(e.target.value)}
          />
          <span tabIndex="0" onKeyDown={(e) => {
            if (['enter', ' '].includes(e.key)) handleSave()
          }} onClick={handleSave}>ⓧ</span>
        </div>
      </li>
    )
  }
  return (
    <li onClick={handleEdit} className="concept-li bg-sky-100">
      {/* <span>{item.id}</span> */}
      <div className='concept'>
        <p>
          {concept}
        </p>
      </div>
      <div className='definition'>
        <p>
          {definition}
        </p>
        <span tabIndex="0">✎</span>
      </div>
    </li>
  );
}