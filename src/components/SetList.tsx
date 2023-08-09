import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SetListItem from './SetListItem';
import { getConcepts } from '../api';

interface Word {
  id: string;
  concept: string;
  definition: string;
  categoryId: string;
}

const fetchSampleConcepts = (setFn) => {
  return fetch('/concepts.json')
        .then(res => res.json())
        .then(setFn)
};

const SetList: React.FunctionComponent = ({ categoryId }) => {
  const [words, setWords] = useState<Word[] | undefined>(undefined);
  const { data, isLoading } = useQuery(['concepts'], getConcepts);

  useEffect(() => {
    (async () => { await fetchSampleConcepts(setWords) })()
    if (data) {
      const filteredConcepts = data.filter(
        (item: Word) => item.categoryId === categoryId
      );
      setWords(filteredConcepts);
    }
  }, [data])

  const handleClick = () => {
    setWords([
      ...words, {
        id: String(words.length + 1),
        concept: '',
        definition: ''
      }
    ])
  };

  if (!words) return <>...</>;

  const dispatch = (action: any) => {
    switch (action.type) {
      case "add":
        console.log('add', action);
        break;
      case "concept":
        setWords(words.map(
          (w: any) => w.id === action.id ? { ...w, concept: action.value } : w)
        );
        break;
      case "definition":
        setWords(words.map(
          (w: any) => w.id === action.id ? { ...w, definition: action.value } : w)
        );
        break;
      default:
        console.log('default case hit:', action)
    }
  }

  return (
    <div >
      {/* 
        "new set" button => list populates new row with input
      */}
      <div className='set-list'>
        <button onClick={handleClick}>new set</button>
        <ul>
          {!words ? <>...</> : words.length > 0 && words.map((setListItem, i) => {
            return (
              <SetListItem
                key={i}
                setListItem={setListItem}
                dispatch={dispatch}
              />
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default SetList;