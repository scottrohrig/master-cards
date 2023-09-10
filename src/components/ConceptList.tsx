import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import {
  getCategory,
  getConcepts,
  useAddConcept,
  useUpdateConcept
} from '../api';
import Button from '../components/Button';
import { Category, Concept } from '../types';
// import SetList from './SetList';

export function loader({ params }: { params: { categoryId: string } }) {
  const category = getCategory(params.categoryId);
  return { category };
}

const ConceptList = () => {
  const { category } = useLoaderData() as { category: Category };
  const { data, isLoading } = useQuery(['concepts'], getConcepts);
  const [concepts, setConcepts] = React.useState(null);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (data) setConcepts(data.filter((c:Concept) => c.categoryId === category.id));
  }, [data]);

  return (
    <div className="border rounded border-sky-400 bg-sky-100 p-2">
      <h2 className="font-bold text-xl text-amber-500 mb-1" onClick={() => { navigate('/categories') }}>{category.title}</h2>
      <SetList categoryId={category.id} />
    </div>
  );
};

export default ConceptList;

function SetList({ categoryId }: { categoryId: string }) {
  const [concepts, setConcepts] = useState([]);
  const [activeItemId, setActiveItemId] = useState('');
  const navigate = useNavigate();
  const { data, isLoading } = useQuery(['concepts'], getConcepts);
  const addConceptMutation = useAddConcept();
  useEffect(() => {
    if (data) {
      const filteredConcepts = data.filter((item:Concept) => item.categoryId === categoryId);
      setConcepts(filteredConcepts);
    }
  }, [data])
  const handleClick = () => {
    const newConcept = { id: '', concept: '', definition: '', categoryId }
    addConceptMutation.mutate(newConcept);
  };

  return (
    <div className="set-list">
      <div className="flex justify-end gap-1">
        <Button tabIndex={0} className="text-white" onClick={handleClick}>new concept</Button>
        {/* <Button className="bg-transparent text-sky-500 border-spacing-1 border-2 rounded-md border-sky-400 p-[4px]" tabIndex={0} onClick={()=> {navigate('/quiz')}}>Quiz Yourself</Button> */}
        <Button className="bg-transparent border-2 border-sky-400 text-amber-500 p-[4px]" tabIndex={0} onClick={() => { navigate('/quiz') }}>Quiz Yourself</Button>

      </div>
      <ConceptListHead />
      <ul className="flex flex-col gap-3">
        {isLoading ? <>loading...</> : (
          <>
            {concepts.length > 0 && concepts.map((item:Concept, i:number) => (
              <ConceptListItem key={i} item={item} activeItemId={activeItemId} setActiveItemId={setActiveItemId} />
            ))}
          </>
        )}
      </ul>
    </div>
  );
}

function ConceptListHead() {
  return (
    <li className='flex w-full mt-2'>
      <p className='basis-[40ch]'>CONCEPT</p>
      <p className='basis-full'>DEFINITION</p>
    </li>
  );
}

type ConceptListItemProps = {
  item: Concept,
  activeItemId: string,
  setActiveItemId: React.Dispatch<React.SetStateAction<string>>
}

function ConceptListItem({ item, activeItemId, setActiveItemId }: ConceptListItemProps): JSX.Element {
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
      <li className="selected rounded flex justify-between border border-sky-400 focus:outline-sky-500 focus:outline-2  focus:border-transparent">
        <div className="concept basis-[40ch] text-vertical">
          <input value={concept} className="w-full px-2 py-1 rounded-e-none focus:outline-none focus:border focus:border-l-2 focus:border-y-2 focus:border-sky-400 ring-sky-400" onKeyDown={(e) => {
            if (['Enter'].includes(e.key)) handleSave()
          }}
            onChange={(e) => setConcept(e.target.value)}
          />
        </div>
        <div className="definition flex basis-full">
          <input value={definition}
            className={`
            basis-full px-2 py-1 rounded-s-none
            focus:outline-none focus:border
            focus:border-y-2 focus:border-r-2 focus:border-sky-400
          `}
            onKeyDown={(e) => {
              if (['Enter'].includes(e.key)) handleSave()
            }}
            onChange={(e) => setDefinition(e.target.value)}
          />
          <span className="bg-sky-400 min-w-[32px] text-center"
            tabIndex={0} onKeyDown={(e) => {
              if (['Enter', ' '].includes(e.key)) handleSave()
            }} onClick={handleSave}>ⓧ</span>
        </div>
      </li>
    )
  }
  return (
    <li onClick={handleEdit} className="concept-li flex rounded items-center justify-between border border-sky-400 text-sky-700">
      <div className="concept basis-[40ch] items-center">
        <p className='px-2 py-1' tabIndex={0}>
          {concept}
        </p>
      </div>
      <div className="definition flex basis-full overflow-x-auto">
        <p className="basis-full px-2 py-1 overflow-hidden whitespace-nowrap" tabIndex={0}>
          {definition}
        </p>
        <span className=" min-w-[32px] text-center" tabIndex={0}>✎</span>
      </div>
    </li>
  );
}
