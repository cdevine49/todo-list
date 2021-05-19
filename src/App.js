import { useState } from 'react'
import logo from './logo.svg';
import './App.css';

const users = ["Winnie", "Brad", "Bob", "Thomas"]

function App() {
  const [userItems, setUserItems] = useState(users.reduce((acc, user) => {
    acc[user] = [];
    return acc
  }, {}))

  const addItem = (user, item) => setUserItems(prev => {
    const myItems = [...prev[user]]
    const newUserItems = {...prev}
    newUserItems[user] = myItems.concat([item]);
    return newUserItems;
  })

  const moveLeft = (currentUser, item, itemIndex) => {
    const userIndex = users.findIndex(user => user === currentUser);
    const prevUser = users[userIndex - 1];

    setUserItems(prev => {
      const currentUserItems = [...prev[currentUser]]
      currentUserItems.splice(itemIndex)
      const prevUserItems = [...prev[prevUser]];

      const newUserItems = {...prev}
      newUserItems[currentUser] = currentUserItems;
      newUserItems[prevUser] = [...prevUserItems.slice(0, itemIndex), item, ...prevUserItems.slice(itemIndex)]
      return newUserItems;
    })
  }

  const moveRight = (currentUser, item, itemIndex) => {
    const userIndex = users.findIndex(user => user === currentUser);
    const nextUser = users[userIndex + 1];

    setUserItems(next => {
      const currentUserItems = [...next[currentUser]]
      currentUserItems.splice(itemIndex)
      const nextUserItems = [...next[nextUser]];

      const newUserItems = {...next}
      newUserItems[currentUser] = currentUserItems;
      newUserItems[nextUser] = [...nextUserItems.slice(0, itemIndex), item, ...nextUserItems.slice(itemIndex)]
      return newUserItems;
    })
  }

  return (
    <div className="wrapper">
    {users.map(user => <UserList items={userItems[user]} addItem={addItem} moveLeft={moveLeft} moveRight={moveRight} user={user} />)}
    </div>
  );
}

const UserList = ({addItem, items, moveLeft: moveLeftOrig, moveRight: moveRightOrig, user}) => {
  const addCard = () => {
    const item = window.prompt('What is your card named?');
    addItem(user, item);
  }

  const moveLeft = (item, index) => moveLeftOrig(user, item, index);
  const moveRight = (item, index) => moveRightOrig(user, item, index);

  return (
    <div className="user-container">
      <h2>{user}</h2>
      <ul>
        {items.map((item, index) => <Item key={item} data={item} moveLeft={moveLeft} moveRight={moveRight} index={index} user={user} />)}
      </ul>
      <button onClick={addCard}>Add a card</button>
    </div>
  );
}

const Item = ({data, index, moveLeft, moveRight, user}) => {
  return (
    <li>
      <button disabled={user === "Winnie"} onClick={() => moveLeft(data, index)}>{"<<"}</button>
      {data}
      <button disabled={user === "Thomas"} onClick={() => moveRight(data, index)}>{">>"}</button>
    </li>
  )
}

export default App;
