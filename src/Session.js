import React, { useState } from 'react';
import './Session.scss';

const Session = props => {
    const { data, dispatch } = props;
    const [flip, setFlip ] = useState(false);
    const [gray, setGray ] = useState(false);
    const [grid, setGrid ] = useState(false);
    
    const stop = () => {
        dispatch({ type: 'STOP' });
    }

    const pause = () => {
        dispatch({ type: 'PAUSE' });
    }

    const next = () => {
        if (data.session.count < data.fileList.length)
            dispatch({ type: 'NEXT' });
    }

    const prev = () => {
        if (data.session.count !== 1)
            dispatch({ type: 'PREV' });
    }

    const getTime = () => {
        let sec = (data.session.time - data.session.passed) % 60;
        let min = Math.round(((data.session.time - data.session.passed)/60)-0.5);
        if (min === 0)
            return `${sec}`;
        return `${min}:${sec}`;
    }

    return (
        <div className="session">
            <div className="image-container">
                {
                    grid ?
                    <div className="grid">
                        <div className="horizontal">
                            <div></div>
                            <div></div>
                        </div>
                        <div className="vertical">
                            <div></div>
                            <div></div>
                        </div>
                    </div> :
                    <></>
                }
                <div className="progress">
                    <span>{data.session.count} / {data.fileList.length}</span>
                    <span>{getTime()}</span>
                </div>
                <img src={data.fileList[data.session.img].url} alt="" className={(flip ? 'flip ' : '') + (gray ? 'gray ' : '')}/>
                <div className="controls">
                    <button disabled={data.session.count === 1} onClick={prev}><i className="swi-chevron-left"></i></button>
                    <button onClick={pause}>{ 
                        data.session.pause ? <i className="swi-play"></i> : <i className="swi-pause"></i> 
                        }</button>
                    <button disabled={data.session.count >= data.fileList.length} onClick={next}><i className="swi-chevron-right"></i></button>
                </div>
                <div className="modifier">
                    <button onClick={stop}>Exit</button>
                    <div>
                        <button onClick={() => setGray(!gray)}>Gray</button>
                        <button onClick={() => setFlip(!flip)}>Flip</button>
                        <button onClick={() => setGrid(!grid)}>Grid</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Session;