import React, { useState, useEffect } from 'react';
import List from './List';
import Alert from './Alert';

// Guardar items en el local storage
const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return (list = JSON.parse(localStorage.getItem('list')));
  } else {
    return [];
  }
};


function App() {
  // states
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });

  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Si no hay valor, retornar un 'plea
    if (!name) {
      showAlert(true, 'danger', 'por favor, ingrese un producto');
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName('');
      setEditID(null);
      setIsEditing(false);
      showAlert(true, 'success', 'Cambio de producto');
    } else {
      showAlert(true, 'success', 'Producto agregado a la lista');
      const newItem = { id: new Date().getTime().toString(), title: name };

      setList([...list, newItem]);
      setName('');
    }
  };

  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };
  const clearList = () => {
    showAlert(true, 'danger', 'Vaciar lista');
    setList([]);
  };
  const removeItem = (id) => {
    showAlert(true, 'danger', 'Producto eliminado');
    setList(list.filter((item) => item.id !== id));
  };
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };
  // agregar listado al localStorage
  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]);
  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}

        <h3>LISTA DEL SÚPER</h3>
        <div className='form-control'>
          <input
            type='text'
            className='grocery'
            placeholder='Frutas'
            value={name}
            // cambiar valor de name por lo que ingrese el usuario en target value
            onChange={(e) => setName(e.target.value)}
          />
          <button type='submit' className='submit-btn'>
            {isEditing ? 'Editar' : 'Agregar'}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className='grocery-container'>
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className='clear-btn' onClick={clearList}>
            Limpiar lista
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
