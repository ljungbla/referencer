import React, { useState } from 'react';
import './Seen.scss';

const Session = props => {
    const { data } = props;
    const [ selected, setSelected ] = useState(-1);

    return (
        <div className="seen">
            <h2>Your session</h2>
            <div>
            {
                data.session.seen.map(seen => {
                    return (
                        <img onClick={() => setSelected(seen)} src={data.fileList[seen].url} key={seen} alt={seen} />
                    )
                })
            }
            {
                selected !== -1 ?
                    <div className="lightbox" onClick={() => setSelected(-1)}>
                        <img src={data.fileList[selected].url} />
                    </div> :
                    <></>
            }
            </div>
        </div>
    );
}

export default Session;