import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
  getCategories,
  getStats,
  useAddStats,
  getOrAddStat,
  getConceptsByCategoryId,
} from '../api';
import { Button } from '../components/ConceptList';
import Page from './Page';

export default function QuizPage() {
  const [category, setCategory] = useState(null);
  const { data: categories, isLoading: isCategoriesLoading } = useQuery(['categories'], getCategories);
  const { data: cards, isLoading: isCardsLoading} = useQuery(
    ['concepts', category?.id],
    () => getConceptsByCategoryId(category?.id || 0),
    { enabled: !!category }
  );
  const [selectedCardId, setSelectedCardId] = useState(0);
  const [tempCards, setCards] = useState([
    { id: '2', concept: 'useMutation', definition: 'A hook that takes a key and a callback and returns a mutation object. The mutation object is used to update the state given a payload.' },
    { id: '3', concept: 'useQuery', definition: 'A hook that takes a key and a callback a response object { data, isLoading, error }.' },
    { id: '4', concept: 'poop', definition: 'A smelly pile of waste' },
  ]);

  // how do I filter the cards

  return (
    <Page >
      <h2 className='font-bold text-2xl'>Quiz Page</h2>
      <h3 className='font-light text-xl'>Category: {category}</h3>
      <div className='p-2'>
        <label htmlFor='category-select'>Category</label>
        <select
          id='category-select'
          name='category-select'
          placeholder='Select a Category'
          // value={category}
          // onChange={(e) => setCategory(e.target.value)}
        >
          {!isCategoriesLoading && categories.map(c => (
            <option
              value={c.title}
              key={c.title}
            >
              {c.title}
            </option>
          ))}
        </select>
      </div>
      <div className='flex justify-end '>
        <div className=''>
          <p>[timer]</p>
        </div>
      </div>
      <Card
        item={selectedCardId ? cards[selectedCardId] : cards[0]}
        increment={() => { setSelectedCardId(p => ((selectedCardId + 1) % cards.length)) }}
        idx={selectedCardId + 1}
      />
    </Page >
  );
}

function Card({ item, increment, idx }) {
  const [state, setState] = useState(true);
  const [debug, setDebug] = useState(false);
  const stats = { conceptId: '2', countAccurate: 2, totalAttempts: 3 };
  const { data: stat, isLoading } = useQuery(['stat', item.id], () => getOrAddStat(item.id));
  const baseDebug = 'border-2 rounded '
  const bodyDebug = debug && baseDebug + 'border-orange-400'
  const accDebug = debug && baseDebug + 'border-green-400'
  const spaceDebug = debug && baseDebug + 'border-red-400'
  const handleClick = () => {
    setState(!state);
  };
  return (
    <div
      className={`
        mx-auto my-2 p-4 flex
        h-96 sm:w-96 sm:h-64
        text-2xl sm:text-lg text-amber-500
        border border-b-4 rounded 
        ${state ? 'border-sky-400' : 'border-amber-400'}
      `}
    >
      <div className={`flex flex-col basis-full h-full justify-stretch ${bodyDebug}`}
      >
        <h2 className='font-light text-sm'>Card {idx}</h2>
        <div
          className="flex items-center w-full text-center basis-full"
          onClick={handleClick}
        >
          {state
            ? <p className="font-bold w-full">{item.concept}</p>
            : <p className="font-light w-full text-sky-700">{item.definition}</p>
          }
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div className={`flex justify-center items-center ${accDebug}`} onClick={() => setDebug(!debug)}>
          <p>Score:
            {' '}
            {!isLoading && stat && <span>{Math.floor((stat.countAccurate / stat.totalAttempts) * 100)}%</span>}
          </p>
        </div>
        <div className='break-all'>
          {!isLoading && stat && String(JSON.stringify(stat))}
        </div>
        <Button
          className="text-zinc-50 uppercase"
          onClick={() => { setState(true); increment() }}
        >
          <p>Next</p>
        </Button>
      </div>
    </div>
  );
}
