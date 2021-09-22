import React from 'react';
import './SessionSettings.scss';

const SessionSettings = props => {
    const { data, dispatch, onStart } = props;


    const startSession = e => {
        onStart();
    }

    const onChangeTimer = event => {
        dispatch({ type: 'SET_SESSION', time: parseInt(event.target.value) });
    }

    return (
        <div className="session-settings">
            <p>Select your preferred time</p>
            <div className="session-time mb-3 mt-3">
                <div>
                    <input id="30" type="radio" value="30" name="time" onChange={onChangeTimer} checked={data.session.time === 30} />
                    <label for="30"> 30s</label>
                </div>
                <div>
                    <input id="45" type="radio" value="45" name="time" onChange={onChangeTimer} checked={data.session.time === 45} />
                    <label for="45"> 45s</label>
                </div>
                <div>
                    <input id="60" type="radio" value="60" name="time" onChange={onChangeTimer} checked={data.session.time === 60} />
                    <label for="60"> 1m</label>
                </div>
                <div>
                    <input id="120" type="radio" value="120" name="time" onChange={onChangeTimer} checked={data.session.time === 120} />
                    <label for="120"> 2m</label>                
                </div>
                <div>
                    <input id="300" type="radio" value="300" name="time" onChange={onChangeTimer} checked={data.session.time === 300} />
                    <label for="300"> 5m</label>                
                </div>
                <div>
                    <input id="600" type="radio" value="600" name="time" onChange={onChangeTimer} checked={data.session.time === 600} />
                    <label for="600"> 10m</label>
                </div>
            </div>

            <div className="mt-3">
                <button className="btn btn-primary" disabled={data.fileList.length !== data.fileCount} onClick={startSession}>Start</button>
            </div>
        </div>
    );
}

export default SessionSettings;