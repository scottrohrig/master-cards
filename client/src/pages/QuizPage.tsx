import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
  getCategories,
  getConcepts,
  getOrAddStat
} from '../api';
import Button from '../components/Button';
import { Category, Concept } from '../types';
import Page from './Page';

export default function QuizPage() {
  const [category, setCategory] = useState({ id: 0, title: 'all' });
  const { data: categories, isLoading: isCategoriesLoading } = useQuery(['categories'], getCategories);
  const { data: concepts, isLoading: isCardsLoading } = useQuery(['concepts'], getConcepts);
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(0);

  const handleSelectChange = (e) => {
    if (e.target.value === 'all') {
      setCategory({ id: 0, title: 'all' });
      return;
    }
    const newSelection = categories.find((item: Category) => item.title === e.target.value);
    setCategory(newSelection);
  };

  React.useEffect(() => {
    if (concepts) {
      if (category.title === 'all') {
        setCards(concepts);
        return;
      }
      const filteredConcepts = concepts.filter((item: Concept) => item.categoryId === category.id);
      setCards(filteredConcepts);
    }
  }, [category]);

  if (isCategoriesLoading) return <p>Loading...</p>;

  return (
    <Page>
      <h2 className='font-bold text-2xl'>Quiz Page</h2>
      <div className='p-2 flex justify-between'>
        <label htmlFor='category-select'>Category</label>
        <select
          id='category-select'
          name='category-select'
          placeholder='Select a Category'
          value={category.title}
          onChange={handleSelectChange}
        >
          <option value='all'>All</option>
          {categories.map(c => (
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
      {
        (cards.length === 0)
          ? <PlaceholderCard />
          : <Card
            item={!isCardsLoading && cards && cards?.length > 0 && cards[selectedCardId]}
            increment={() => { setSelectedCardId(p => ((selectedCardId + 1) % (cards?.length || 1))) }}
            idx={selectedCardId + 1}
          />
      }
    </Page >
  );
}

function calcAccuracy(acc, count) {
  if (!acc || !count) return 0
  const out = acc != 0 ? Math.floor(acc / count) * 100 : 0
  return out;
}

function PlaceholderCard() {
  return (

    <div
      className="mx-auto my-2 items-center justify-center flex h-96 sm:w-96 sm:h-64 text-2xl sm:text-lg text-amber-500 border border-b-4 rounded border-sky-400" >Select a Category</div>
  )
}

function Card({ item, increment, idx }: { item: Concept, increment?: object, idx?: number }) {
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
          className="flex items-center w-full text-center basis-full break-all"
          onClick={handleClick}
        >
          {state
            ? <p className="font-bold w-full">{item?.concept}</p>
            : <p className="font-light w-full text-sky-700">{item?.definition}</p>
          }
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div className={`flex justify-center items-center ${accDebug}`} onClick={() => {/* mutate stats */setDebug(!debug) }}>
          <p>Score:
            {' '}
            {<span>{calcAccuracy(stat?.countAccurate, stat?.totalAttempts)}%</span>}
          </p>
        </div>
        <div className='break-all text-xs'>
          {debug && !isLoading && stat && String(JSON.stringify(stat) + JSON.stringify(item))}
        </div>
        <Button
          className="text-zinc-50 uppercase"
          onClick={() => { setState(true); increment(); }}
        >
          <p>Next</p>
        </Button>
      </div>
    </div>
  );
}
