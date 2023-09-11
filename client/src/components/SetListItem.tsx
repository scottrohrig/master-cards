import React, { useState, useEffect, useRef } from 'react';

const SetListItem = ({
  setListItem, dispatch,
}: any) => {
  const [selectedId, setSelectedId] = useState('');
  const listItemRef = useRef(null);
  const conceptInputRef = useRef(null);
  const definitionInputRef = useRef(null);

  const handleClickOutside = (event: any) => {
    if (listItemRef.current && !listItemRef.current.contains(event.target)) {
      setSelectedId('');
    }
  };

  const handleBlur = (e: any) => {
    if (!listItemRef.current.contains(e.relatedTarget)) {
      setSelectedId('');
    }
  };
  
const handleClick = (e: React.MouseEvent) => {
    setSelectedId(setListItem.id);
    if (e.target === conceptInputRef.current) {
      conceptInputRef.current?.focus();
    }
    if (e.target === definitionInputRef.current) {
      definitionInputRef.current?.focus();
    }
  };


  useEffect(() => {
    // Attach the listener to the document when the component mounts
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Remove the listener when the component unmounts
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (selectedId && selectedId === setListItem.id) {
    return (
      <li className='selected' ref={listItemRef} onClick={handleClick}>
        <div className='concept'>
          <input
            value={setListItem.concept}
            onChange={(e) => dispatch(
              {
                type: 'concept',
                id: selectedId,
                value: e.target.value,
              })}
            onBlur={handleBlur}
          />
        </div>
        <div className='definition'>
          <input
            value={setListItem.definition}
            onChange={(e) => dispatch(
              {
                type: 'definition',
                id: setListItem.id,
                value: e.target.value,
              })}
            onBlur={handleBlur}
          />
        </div>
      </li>
    )
  }

  return (
    <li onClick={() => setSelectedId(setListItem.id)}>
      <div className='concept'>
        <p>
          {setListItem.concept}
        </p>
      </div>
      <div className='definition'>
        <p>
          {setListItem.definition}
        </p>
      </div>
    </li>
  )
}

export default SetListItem;