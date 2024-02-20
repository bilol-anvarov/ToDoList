import React, { useState } from 'react'
import settings from '/settings.svg';
import text from '../localStorage/text';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ListPage from './list';
import CreateFunc from './create-list';
import Popup from './popup';
import { useEffect } from 'react';


const oldText = JSON.parse(localStorage.getItem('textHistory'));


// отрытие и закрытие
const showCloseSett = (event) => {
    let item = event.currentTarget; 
    let itemMenu = item.closest('.settings'); 
    if (!itemMenu.classList.contains('show')) {
        itemMenu.classList.add('show');
    } else {
        itemMenu.classList.remove('show');
    }
}
// закрытие

function close(event){ 
    let itemMenu = document.querySelectorAll('.settings');
    itemMenu.forEach((item)=>{
        if(!item.contains(event.target) && item.classList.contains('show')){
            item.classList.remove('show');
        }
    })  
};

window.addEventListener('click', close)

const deleteList = (itemId)=>{
    const oldText = JSON.parse(localStorage.getItem('textHistory'));
    if(confirm(`Вы уверены что хотите удалить блок номер ${itemId}`)){
        const realId = itemId - 1
        oldText.splice(realId , 1)[0]
        for(let i = itemId; i < (oldText.length + 1); i++){
            oldText[i - 1].id--
        }
        localStorage.setItem('textHistory', JSON.stringify(oldText));
        window.location.reload();
    }
}

const List = ({id, name, paragraph, diedline, openPopupFunc})=>(
    <li className={`theme_item theme_item_id_${id}`}>
        <Link to={`/${id}/${name}`}>
            <h2>{name}</h2>
            <p>
                {paragraph}
            </p>
            <p className="diedline">{diedline}</p>
        </Link>
        <div className="settings">
            <img 
                className='settingsImg'
                onClick={(event) => showCloseSett(event)}
                src={settings}
                alt=":"
            />
            <div className="settings-menu">
                <ul>
                    <li onClick={()=>{deleteList(id)}} className="set__menu_item">Удалить</li>
                    {/* delete this tab */}
                    <li onClick={()=>{openPopupFunc(id)}} className="set__menu_item">Изменить</li>
                    {/* popup window for change this item */}
                </ul>
            </div>
        </div>
    </li>
)
const ListFunc = ({data, openPopup})=>{
    const [textSearch, setTextSearch] = useState('')
    const handleChage = (event)=>{
        setTextSearch(event.target.value)
    }

    let searchValue = textSearch.toLowerCase();
    let filteredData = data.filter(item => item.name.toLowerCase().includes(searchValue) || item.paragraph.toLowerCase().includes(searchValue   ));
    if(textSearch == true){
        return(
            <h2>Похожее что у час нету дел-_-</h2>
        )
    }
    if(data.length == 0){
        console.log(data.length)
        return(
            <>
                <div className="not_have_theme">
                <div>
                    <input onChange={handleChage} value={textSearch} type="text" placeholder="search" className="search-input"/>
                </div>   
                    <CreateFunc  /> 
                    <div className="title">
                        <h1>У вас нет задач</h1>
                        <h2>Создайте новый блок</h2>    
                    </div>
                </div>
            </>
        )
    }
    return (
        <>
         <div>
            <input onChange={handleChage} value={textSearch} type="text" placeholder="search" className="search-input"/>
        </div>        
        <CreateFunc  /> 
        <ul className="works">
            {filteredData.length === 0 && <h2>Задач не найдено</h2>}
            {filteredData.map(item => (
                <List 
                    openPopupFunc={openPopup} 
                    id={item.id} 
                    key={item.id} 
                    name={item.name} 
                    paragraph={item.paragraph} 
                    diedline={item.diedline}
                />
            ))}
        </ul>
        </>
    );
}
export default function Lists() {
    if(!oldText){
        useEffect(()=>{
            localStorage.setItem('textHistory', JSON.stringify(text))
        },[text])
    }


    const [canOpenPopup, setCanOpenPopup] = useState(false);
    const [itemIdDelete , setItemId] = useState()
    const openPopup = (id)=> {
        setCanOpenPopup(true);
        setItemId(id)
    }
    const closePopup= ()=> {
      setCanOpenPopup(false);
    }
    document.addEventListener("keydown", (event)=>{
        if (event.key === "Escape" || event.key === "Back") {
            setCanOpenPopup(false);
        }
    });
    
    window.addEventListener('click',(event)=>{
        if(canOpenPopup){
            let eventKey = event.target; 
            let elemTwo = eventKey.classList.contains('set__menu_item'); 
            let elem = document.querySelector('.popup_card')
            if(elem){
                if(!elem.contains(eventKey) && !elemTwo){closePopup()}
                let itemMenu = document.querySelectorAll('.settings');
                itemMenu.forEach(item=>{item.classList.remove('show');})  
            }
        }
    })
    window.addEventListener('close',()=>{console.log('ok')})
    
    return (
        <>
        {canOpenPopup && 
        <Popup 
            itemId={itemIdDelete}
            onClose={closePopup}
            type="change"
            text='Введите новое название блока'
            description='Введите новое описание блока'  
        />}
        <div className="listsContainer">  
            <Router>
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            <ListFunc 
                                data={oldText || text} 
                                openPopup={openPopup}
                            />
                        } 
                    />
                    {text.map(item => (
                        <Route 
                            key={item.id} 
                            path={'/:id/:name'}
                            element={
                                <ListPage workId={item.id} />
                            } 
                        />
                    ))}
                </Routes>
            </Router>
        </div>
        </>
    )
}
