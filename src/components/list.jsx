import React,{ useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import text from '../localStorage/text';
import arrowSvg from '/arrow.svg';
import settings from '/settings.svg';




const showSettingsMenu = (event)=>{
    let btnItem = event.target;
    let settingsDiv = btnItem.closest('.addListBtn')
    if(!settingsDiv.classList.contains('show')){
        settingsDiv.classList.add('show')
    } else{
        settingsDiv.classList.remove('show')
    }
}
function closeSettingsMenu(event){
    let settingsDiv = document.querySelectorAll('.addListBtn');
    settingsDiv.forEach(item=>{
        if(!item.contains(event.target) && item.classList.contains('show')){
            item.classList.remove('show');
        }
    })

}

window.addEventListener('click', closeSettingsMenu)



// изменение
function changeListValue(itemId){
    const locationId = Number(window.location.pathname.split('/')[1]);
    const oldText = JSON.parse(localStorage.getItem('textHistory'));
    const newValueItem = prompt(`Введите новое имя для задачи номер: ${itemId}`, oldText[locationId - 1].todoLists[itemId - 1].workText);
    if (newValueItem !== null && newValueItem !== '') {
        oldText[locationId - 1].todoLists[itemId - 1].workText = newValueItem;
        localStorage.setItem('textHistory', JSON.stringify(oldText));
        window.location.reload();
    }
}
// удаление 
function deleteListValue(indexToRemove){
    const locationId = Number(window.location.pathname.split('/')[1]);
    const oldText = JSON.parse(localStorage.getItem('textHistory'));
    if(confirm(`Вы уверены что хотите удалить задачу номер ${indexToRemove}`)){
        oldText[locationId - 1].todoLists.splice(indexToRemove - 1, 1)[0];
        for(let i = indexToRemove; i <  (oldText[locationId - 1].todoLists.length + 1); i++){
            oldText[locationId - 1].todoLists[i - 1].id--
        }
        localStorage.setItem('textHistory', JSON.stringify(oldText));
        window.location.reload();
    }
}



const WorkLayout = ({deside, workText, toggleDecide, itemId})=>{
    const [decide, setDecide] = useState(deside)
    const Checkbox = () => {
        const checkboxFunc =()=>{
            setDecide(prevDecide => !prevDecide);
            toggleDecide(!decide, itemId)
        }
        return (
            <input onChange={checkboxFunc} type="checkbox" checked={decide} /> 
        );
    }
    return(
        <li className={`li__work work_deside_${deside}`}>
            <label>
                <Checkbox />
                {workText}
            </label>
            <div className='addListBtn'>
                <img src={settings} onClick={showSettingsMenu} alt="" />
                <ul className="settings-menu">
                    <li className="settings-menu_item" onClick={()=>{deleteListValue(itemId)}}>Удалить</li>
                    <li 
                        onClick={()=>{changeListValue(itemId)}}
                        className="settings-menu_item">Изменить</li>
                </ul>
            </div>
        </li>
    )
}
const WorkItem = ({data, toggleDecide})=>{
    return(
        <>
            <ul className='works_list'> 
                {data.map(item=>{
                    return <WorkLayout 
                        toggleDecide={toggleDecide} 
                        key={item.id} 
                        itemId={item.id}
                        deside={item.workDecided} 
                        workText={item.workText} 
                    />             
                })}
            </ul>
        </>
    )
}
const addNewList = ()=>{
    const locationId = Number(window.location.pathname.split('/')[1]);
    const oldText = JSON.parse(localStorage.getItem('textHistory'));  
    const newWorkText = prompt(`Новая задача`);
    if(newWorkText === null){
        alert('Операция отменена')
        return
    }
    if(newWorkText === ''){
        alert('Вы не заполнили поле')
        return
    }
    if(newWorkText){
        oldText.forEach(item =>{
            if(item.id === locationId){
                const newWork = {
                    id: item.todoLists.length + 1,
                    workText: newWorkText,
                    workDecided: false
                }
                item.todoLists.push(newWork)
                localStorage.setItem('textHistory', JSON.stringify(oldText));
                window.location.reload();
                console.log(item.todoLists)
            }
        })
    } else{
        alert('Ошибка попробуйте обновить сайт')
    }
}
const AddNewList = ()=>{    
    return(
        <>
            <div className='add_new_list'>
                <button onClick={addNewList} className='add_new_list__button'>
                    Добавить
                </button>
            </div>
        </>
    )
}



export default function ListPage() {
    const oldText = JSON.parse(localStorage.getItem('textHistory'));
    
    if(!oldText){
        useEffect(()=>{
            localStorage.setItem('textHistory', JSON.stringify(text))
        },[text])
    }
    
    const path = useParams();
    // console.log(decodeURIComponent(window.location.pathname))
    /*
        хук useParams 
        она из библиотеки react router dom 
        проще говоря она просто берет из url какую то строку её можно передать когда вот так 
        path={`/post/:id`}
        и тут id это название переменной то есть всё кому либо вы дадите ссылку /post/enything 

        после /post/ .... это будет засуннато в переменную id 
        после этого её можно проверять через способ find если вы работаете с объектом и проверить 
        если у вас этот объект и вывести её и дальше работать с ним 
    */
   let work;
    if(oldText){
        work = oldText.find(post => post.id === Number(path.id));
    } else{
        work = text.find(post => post.id === Number(path.id));
    }



    const toggleDecide = (itemBoolean, itemId) => {
        work.todoLists[itemId - 1].workDecided = itemBoolean;
        localStorage.setItem('textHistory', JSON.stringify(oldText))
    }
    if (!work) {
        return (
            <div className="404">
                <h2>Задача не найдена</h2>
                <Link to={'/'} className='button'>Назад</Link>
            </div>
        )
    }
    return (
        <div className='work__detail'>
            <header className='work__header'>
                <h1>
                    <Link to='/'><img src={arrowSvg} alt="" /></Link>
                    {work.name}
                </h1>
            </header>
            <p className='list__paragraph'>{work.paragraph}</p>
            <WorkItem toggleDecide={toggleDecide} data={work.todoLists}/>
            <AddNewList />
            <p>Срок выполнения: {work.diedline}</p>
        </div>
    );
}