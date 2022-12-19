import { useEffect, useRef, useState } from 'react'
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {
    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [offset, setOffset] = useState(210);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [charEnded, setCharEnded] = useState(false);

    const marvelServices = new MarvelService();

    useEffect(() => {
        getCharacters();
    }, []);
    
    const getCharacters = (offset) => {
        setNewItemLoading(true);

        marvelServices
            .getAllCharacters(offset)
            .then(newCharList => {
                let charListEnd = false;
                if (newCharList.length < 9) {
                    charListEnd = true;
                }

                setCharList(charList => [...charList, ...newCharList]);
                setLoading(loading => false);
                setNewItemLoading(newItemLoading => false);
                setOffset(offset => offset + 9);
                setCharEnded(charEnded => charListEnd);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }

    const itemsRef = useRef([]);

    const focusOnItem = (index) => {
        itemsRef.current.forEach(item => item.classList.remove('char__item_selected'));
        itemsRef.current[index].classList.add('char__item_selected');
        itemsRef.current[index].focus();
    }

    const renderItems = (charList) => {
        const items = charList.map((item, i) => {
            let imgStyle = {'objectFit': 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit': 'unset'};
            }

            return (
                <li
                    className="char__item"
                    key={item.id}
                    tabIndex={0}
                    ref={el => itemsRef.current[i] = el}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(charList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button
                onClick={() => getCharacters(offset)}
                disabled={newItemLoading}
                style={{'display' : charEnded ? 'none' : 'block'}}
                className={newItemLoading ? 'button button__main button__long pulse' : 'button button__main button__long'}>
                <div className="inner">{newItemLoading ? 'loading...' : 'load more'}</div>
            </button>
        </div>
    )
}

export default CharList;