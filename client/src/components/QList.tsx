import React from 'react';

export default function QList() {
  const [qitems, setqitems] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState('');
  const [active, setActive] = React.useState(qitems?.length === undefined);
  const [title, setTitle] = React.useState('');
  /**/
  const handleAdd = () => {
    // add new item with a status of selected/active
    setActive(!active);
  }
  const handleChange = (e: any) => {
    setTitle(e.target.value)
  };
  const handleSubmit = () => {
    // add item to list
    setqitems([
      ...qitems,
      {
        id: String(Math.floor(Math.random() * 9999)),
        title,
      }])
    // set not active
    setActive(false);
  };
  const update=(id)=>{
    setqitems([
      
    ])
  };

  return (
    <>
      <div className="qlist-actionbar-div">
        <button
          id="add-qlist-item"
          onClick={handleAdd}
        >
          {active ? 'cancel' : 'add item'}
        </button>
      </div>
      <ul className="qlist">
        {active &&
          <AddQItem
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />}
        {qitems.length>0 && qitems.map(item => (
          <QItem
            key={item?.id}
            item={item}
            active={selectedId === item.id}
            update={update}
          />
        ))}
      </ul>
    </>
  );
}

function QItem({
  item, active, update,
}: any) {
  const [value, setValue] = React.useState(item.title)
  const edit = (e: any) => {
    // somehow get title in input
    setValue(e.target.value);
  };
  
  if (active) {
    return (
      <AddQItem
        value={value}
        handleChange={edit}
        handleSubmit={update}
      />
    )
  }
  return (<li>{item.title}</li>);
}

function AddQItem({ value, handleChange, handleSubmit }: any) {
  return (
    <li>
      <label
        htmlFor="add-qitem-input"
        style={{ padding: "0 1ch" }}
      >
        Title
      </label>
      <input
        id="add-qitem-input"
        style={{ paddingLeft: "1ch" }}
        onChange={handleChange}
        value={value}
      />
      <button onClick={handleSubmit}>submit</button>
    </li>
  );
}