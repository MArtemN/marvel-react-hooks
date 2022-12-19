import { useEffect, useState } from 'react'

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import MarvelService from '../../services/MarvelService';

import './charInfo.scss';

const CharInfo = ({selectedChar}) => {
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [scrollY, setScrollY] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        scrollWithContent();
    }, []);

    useEffect(() => {
        updateCharacter();
    }, [selectedChar]);

    const updateCharacter = () => {
        if (!selectedChar) {
            return;
        }

        setLoading(true);
        setError(false);
        marvelService
            .getCharacter(selectedChar)
            .then(char => {
                setChar(char);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                setError(true);
            });
    }

    const scrollWithContent = () => {
        window.addEventListener('scroll', (e) => {
            if (window.scrollY >= 446) {
                setScrollY(true);
            } else {
                setScrollY(false);
            }
        })
    }

    const skeleton = char || error || loading ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null;

    return (
        <div
            className="char__info"
            style={scrollY ? {'position': 'fixed', 'right': '21%', 'marginTop': '15px'} : {'position': 'absolute'}}>
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;

    let imgStyle = {'objectFit': 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit': 'unset'};
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {
                    comics.map((item, key) => {
                        return (
                            <li className="char__comics-item" key={key}>
                                <a target='_blank' href={item.url}>{item.name}</a>
                            </li>
                        )})
                }
            </ul>
        </>
    )
}

export default CharInfo;