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
    <div className="border rounded border-sky-400 bg-sky-100">
      <h2 onClick={() => { navigate('/categories') }}>{category.title}</h2>
      <SetList categoryId={category.id} />
    </div>
  );
};

export default ConceptList;

function Button(props){
  return (
    <button {...props}
      className="p-2 bg-sky-400 rounded"
    >
      {props.children}
    </button>
  );
}

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
      <Button tabIndex="0" onClick={handleClick}>new concept</Button>
      <ul className="flex flex-col gap-3 mt-2">
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
      <li className="selected outline outline-1 rounded flex justify-between bg-sky-400">
        {/* <span>{item.id}</span> */}
        <div className="concept basis-[40ch] text-vertical">
          <input value={concept} className="w-full"
            onChange={(e) => setConcept(e.target.value)}
          />
        </div>
        <div className="definition flex basis-full">
          <input value={definition} className="basis-full"
            onChange={(e) => setDefinition(e.target.value)}
          />
          <span className="bg-sky-400 min-w-[32px] text-center"
          tabIndex="0" onKeyDown={(e) => {
            if (['enter', ' '].includes(e.key)) handleSave()
          }} onClick={handleSave}>ⓧ</span>
        </div>
      </li>
    )
  }
  return (
    <li onClick={handleEdit} className="concept-li flex items-center justify-between bg-sky-400">
      {/* <span>{item.id}</span> */}
      <div className="concept basis-[40ch] items-center">
        <p>
          {concept}
        </p>
      </div>
      <div className="definition flex basis-full">
        <p className="basis-full">
          {definition}
        </p>
        <span className="bg-sky-400 min-w-[32px] text-center" tabIndex="0">✎</span>
      </div>
    </li>
  );
}
