import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { useHistory } from 'react-router-dom';

export const Meme = () => {

    const [memes, setMemes] = useState([]);
    const [memeIndex, setMemeIndex] = useState(0);
    const [captions, setCaptions] = useState([]);

    const history = useHistory();

    const updateCaption = (e, index) => {
        const text = e.target.value || '';
        setCaptions(
            captions.map((c, i) => {
                if (index === i) {
                    return text;
                } else {
                    return c;
                }
            })
        );
    };

    const generateMeme = () => {

        const currentMeme = memes[memeIndex];
        const formData = new FormData();

        formData.append('username', 'marrcel12');
        formData.append('password', 'marrcel12');
        formData.append('template_id', currentMeme.id);
        captions.forEach((c, index) => formData.append(`boxes[${index}][text]`, c));

        fetch('https://api.imgflip.com/caption_image', {
            method: 'POST',
            body: formData
        }).then(res => {
            res.json().then(res => {
                console.log(res)
                history.push(`/generated?url=${res.data.url}`);
            });
        })
    };

    const shuffleMemes = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    };

    useEffect(() => {
        fetch('https://api.imgflip.com/get_memes').then(res => {
            res.json().then(res => {
                const _memes = res.data.memes;
                shuffleMemes(_memes);
                setMemes(_memes);
            });
        });
    }, []);

    useEffect(() => {
        if (memes.length) {
            setCaptions(Array(memes[memeIndex].box_count).fill(''));
        }
    }, [memeIndex, memes]);
    // useEffect(() => {
    //     if (captions) {
    //         document.getElementById('generate').setAttribute("disabled","")
    //     }
    // }, [captions])
    return (
        memes.length ?
            <div className={styles.container}>
                <button onClick={generateMeme} className={styles.generate} id="generate"  >Twórz </button>
                <button onClick={() => setMemeIndex(memeIndex + 1)} className={styles.skip}>Przewiń</button>
                {
                    captions.map((c, index) => (
                        <input onChange={(e) => updateCaption(e, index)} key={index} />
                    ))
                }
                <img alt='meme' src={memes[memeIndex].url} />
            </div> :
            <></>
    );
};
