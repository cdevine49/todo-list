import { useEffect, useState } from 'react'
import logo from './logo.svg';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [userItems, setUserItems] = useState({})

  useEffect(async () => {
    const fetchedUsers = await fetch("http://localhost:3001/users", {
      mode: 'cors'
    })
    .then(res => res.json())
    .then(data => data)

    setUsers(fetchedUsers);
  }, [])

  useEffect(async () => {
    const items = await fetch("http://localhost:3001/items", {
      mode: 'cors'
    })
    .then(res => res.json())
    .then(data => data)

    setUserItems(items.reduce((acc, item) => {
      if (acc[item.user_id]) {
        acc[item.user_id] = acc[item.user_id].concat([item]);
      } else {
        acc[item.user_id] = [item];
      }
      return acc
    }, {}));
  }, [])

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

  console.log(userItems)

  return (
    <div className="wrapper">
    {users.map(user => {
      return <UserList items={userItems[user.id] || []} addItem={addItem} moveLeft={moveLeft} moveRight={moveRight} user={user} />}
    )}

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
      <h2>{user.name}</h2>
      <ul>
        {items?.map((item, index) => <Item key={item} data={item} moveLeft={moveLeft} moveRight={moveRight} index={index} user={user} />)}
      </ul>
      <button onClick={addCard}>Add a card</button>
    </div>
  );
}

const Item = ({data, index, moveLeft, moveRight, user}) => {
  return (
    <li>
      <button disabled={false} onClick={() => moveLeft(data, index)}>{"<<"}</button>
      {data.name}
      <button disabled={false} onClick={() => moveRight(data, index)}>{">>"}</button>
    </li>
  )
}

export default App;
