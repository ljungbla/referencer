import React from 'react';
import './DragAndDrop.scss';

const DragAndDrop = props => {
    const { data, dispatch } = props;

    const handleDragEnter = e => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: 'SET_ERROR', error: '' })
    };
    const handleDragLeave = e => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false })
    };
    const handleDragOver = e => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
        dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: true });
    };
    const handleDrop = e => {
        e.preventDefault();
        e.stopPropagation();
        let items = [...e.dataTransfer.items];

        for (let i = 0; i < items.length; i++) {
            let item = items[i].webkitGetAsEntry();

            if (item.isDirectory) {
                let directoryReader = item.createReader();
                let i = 0;
                directoryReader.readEntries(function (files) {
                    dispatch({ type: 'FILES_FOUND', fileCount: files.length })
                    files.forEach(function (fileEntry) {

                        fileEntry.file(function (file) {
                            if (['image/png', 'image/jpeg', 'image/tiff'].indexOf(file.type) === -1) return;
                            let reader = new FileReader()
                            reader.onload = () => {
                                dispatch({
                                    type: 'ADD_FILE_TO_LIST', files: [{
                                        key: i,
                                        url: reader.result
                                    }]
                                });
                            }
                            reader.readAsDataURL(file);
                        });

                        i++;
                    });
                });

                e.dataTransfer.clearData();
                dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false });
            } else {
                dispatch({ type: 'SET_ERROR', error: 'Please drop a directory' })
            }
        }

    };

    return (
        <div className="mb-3">
            <div className={data.inDropZone ? 'drag-drop-zone inside-drag-area' : 'drag-drop-zone'}
                onDrop={e => handleDrop(e)}
                onDragOver={e => handleDragOver(e)}
                onDragEnter={e => handleDragEnter(e)}
                onDragLeave={e => handleDragLeave(e)}
            >
                <p>Drop a folder here</p>
            </div>
            {
                data.fileList.length !== 0 ?
                <div className={data.fileList.length / data.fileCount === 1 ? 'progress-bar mt-3 done' : 'progress-bar mt-3'}>
                    <div style={{width: ((data.fileList.length / data.fileCount) * 100) + '%'}}></div>
                </div> :
                <></>
            }
            <p>{data.fileList.length} files found</p>
        </div>
    );
};

export default DragAndDrop;